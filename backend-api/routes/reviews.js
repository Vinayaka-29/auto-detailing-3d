const router = require('express').Router();
const { query }       = require('../db');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  const { booking_id, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ success: false, message: 'Rating must be 1-5' });
  try {
    const { rows: [b] } = await query(
      "SELECT * FROM bookings WHERE id=$1 AND user_id=$2 AND status='completed'", [booking_id, req.user.id]);
    if (!b) return res.status(400).json({ success: false, message: 'Can only review completed bookings' });

    const dup = await query('SELECT id FROM reviews WHERE booking_id=$1', [booking_id]);
    if (dup.rows[0]) return res.status(409).json({ success: false, message: 'Already reviewed' });

    const { rows: [r] } = await query(
      'INSERT INTO reviews(booking_id,user_id,vendor_id,rating,comment) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [booking_id, req.user.id, b.vendor_id, rating, comment]);

    // Recalculate vendor rating
    await query(
      'UPDATE vendors SET rating=(SELECT ROUND(AVG(rating)::numeric,2) FROM reviews WHERE vendor_id=$1), review_count=(SELECT COUNT(*) FROM reviews WHERE vendor_id=$1) WHERE id=$1',
      [b.vendor_id]);

    res.status(201).json({ success: true, data: r });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
