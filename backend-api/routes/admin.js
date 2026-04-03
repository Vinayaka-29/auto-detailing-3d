const router = require('express').Router();
const { query }                  = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('admin'));

router.get('/stats', async (req, res) => {
  try {
    const [users, vendors, bookings, revenue] = await Promise.all([
      query("SELECT COUNT(*) FROM users WHERE role='customer'"),
      query("SELECT COUNT(*) FROM vendors WHERE is_approved=TRUE"),
      query("SELECT COUNT(*) FROM bookings"),
      query("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='paid'"),
    ]);
    res.json({ success: true, data: {
      total_users:    +users.rows[0].count,
      total_vendors:  +vendors.rows[0].count,
      total_bookings: +bookings.rows[0].count,
      total_revenue:  +revenue.rows[0].total,
    }});
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/vendors', async (req, res) => {
  const approved = req.query.approved !== 'false';
  try {
    const { rows } = await query(
      `SELECT v.*, u.email AS owner_email, u.phone AS owner_phone
       FROM vendors v JOIN users u ON u.id=v.user_id
       WHERE v.is_approved=$1 ORDER BY v.created_at DESC`, [approved]);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/vendors/:id/approve', async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE vendors SET is_approved=$1 WHERE id=$2 RETURNING *',
      [req.body.approved !== false, req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/bookings', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT b.*, u.name AS user_name, v.business_name, s.name AS service_name,
             p.status AS payment_status
      FROM bookings b
      JOIN users u ON u.id=b.user_id
      JOIN vendors v ON v.id=b.vendor_id
      JOIN services s ON s.id=b.service_id
      LEFT JOIN payments p ON p.booking_id=b.id
      ORDER BY b.created_at DESC LIMIT 200`);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/users', async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id,name,email,phone,role,is_active,created_at FROM users ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
