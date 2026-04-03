const router = require('express').Router();
const { query }       = require('../db');
const { authenticate } = require('../middleware/auth');

const genRef = () => 'CWC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,5).toUpperCase();

/* GET /api/bookings/slots?vendor_id=&date= */
router.get('/slots', async (req, res) => {
  const { vendor_id, date } = req.query;
  if (!vendor_id || !date) return res.status(400).json({ success: false, message: 'vendor_id and date required' });
  try {
    const { rows: [v] } = await query(
      'SELECT opening_time,closing_time,slot_duration_minutes FROM vendors WHERE id=$1', [vendor_id]);
    if (!v) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const [oh, om] = v.opening_time.split(':').map(Number);
    const [ch, cm] = v.closing_time.split(':').map(Number);
    const dur = v.slot_duration_minutes;
    const slots = [];
    let cur = oh * 60 + om;
    while (cur + dur <= ch * 60 + cm) {
      slots.push(`${String(Math.floor(cur/60)).padStart(2,'0')}:${String(cur%60).padStart(2,'0')}`);
      cur += dur;
    }

    const { rows: booked } = await query(
      "SELECT to_char(booking_time,'HH24:MI') t FROM bookings WHERE vendor_id=$1 AND booking_date=$2 AND status NOT IN ('cancelled')",
      [vendor_id, date]);
    const bookedSet = new Set(booked.map(r => r.t));
    res.json({ success: true, data: slots.map(s => ({ time: s, available: !bookedSet.has(s) })) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* GET /api/bookings  — own bookings */
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT b.*, v.business_name, v.address, v.phone AS vendor_phone,
             s.name AS service_name, s.price,
             p.status AS payment_status, p.razorpay_payment_id
      FROM bookings b
      JOIN vendors v ON v.id=b.vendor_id
      JOIN services s ON s.id=b.service_id
      LEFT JOIN payments p ON p.booking_id=b.id
      WHERE b.user_id=$1 ORDER BY b.created_at DESC`, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* GET /api/bookings/vendor  — vendor sees their bookings */
router.get('/vendor', authenticate, async (req, res) => {
  try {
    const { rows: [v] } = await query('SELECT id FROM vendors WHERE user_id=$1', [req.user.id]);
    if (!v) return res.status(404).json({ success: false, message: 'Vendor not found' });
    const { rows } = await query(`
      SELECT b.*, u.name AS customer_name, u.phone AS customer_phone,
             s.name AS service_name, p.status AS payment_status
      FROM bookings b
      JOIN users u ON u.id=b.user_id
      JOIN services s ON s.id=b.service_id
      LEFT JOIN payments p ON p.booking_id=b.id
      WHERE b.vendor_id=$1 ORDER BY b.booking_date DESC, b.booking_time ASC`, [v.id]);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* POST /api/bookings */
router.post('/', authenticate, async (req, res) => {
  const { vendor_id, service_id, vehicle_type, vehicle_number, booking_date, booking_time, notes } = req.body;
  try {
    const { rows: [svc] } = await query('SELECT price FROM services WHERE id=$1', [service_id]);
    if (!svc) return res.status(404).json({ success: false, message: 'Service not found' });

    const { rows: conflict } = await query(
      "SELECT id FROM bookings WHERE vendor_id=$1 AND booking_date=$2 AND booking_time=$3 AND status NOT IN ('cancelled')",
      [vendor_id, booking_date, booking_time]);
    if (conflict.length) return res.status(409).json({ success: false, message: 'Slot already taken' });

    const { rows: [vnd] } = await query('SELECT commission_pct FROM vendors WHERE id=$1', [vendor_id]);
    const platform_fee  = Math.floor(svc.price * vnd.commission_pct / 100);
    const vendor_payout = svc.price - platform_fee;

    const { rows: [b] } = await query(`
      INSERT INTO bookings(booking_ref,user_id,vendor_id,service_id,vehicle_type,vehicle_number,booking_date,booking_time,total_amount,platform_fee,vendor_payout,notes)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [genRef(),req.user.id,vendor_id,service_id,vehicle_type,vehicle_number,booking_date,booking_time,svc.price,platform_fee,vendor_payout,notes]);
    res.status(201).json({ success: true, data: b });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* PUT /api/bookings/:id/cancel */
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      "UPDATE bookings SET status='cancelled',cancelled_reason=$1 WHERE id=$2 AND user_id=$3 AND status='pending' RETURNING *",
      [req.body.reason || 'Customer cancelled', req.params.id, req.user.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Cannot cancel' });
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* PUT /api/bookings/:id/status  — vendor updates */
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  if (!['confirmed','in_progress','completed','cancelled'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });
  try {
    const { rows } = await query(`
      UPDATE bookings b SET status=$1
      FROM vendors v WHERE v.id=b.vendor_id AND v.user_id=$2 AND b.id=$3 RETURNING b.*`,
      [status, req.user.id, req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
