const router   = require('express').Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const { query }       = require('../db');
const { authenticate } = require('../middleware/auth');

const rp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

/* POST /api/payments/create-order */
router.post('/create-order', authenticate, async (req, res) => {
  const { booking_id } = req.body;
  try {
    const { rows: [b] } = await query('SELECT * FROM bookings WHERE id=$1 AND user_id=$2', [booking_id, req.user.id]);
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found' });

    const order = await rp.orders.create({
      amount: b.total_amount, currency: 'INR',
      receipt: b.booking_ref,
      notes: { booking_id, user_id: req.user.id },
    });

    await query('INSERT INTO payments(booking_id,razorpay_order_id,amount) VALUES($1,$2,$3)',
      [booking_id, order.id, b.total_amount]);

    res.json({ success: true, data: {
      order_id: order.id, amount: order.amount,
      currency: order.currency, key: process.env.RAZORPAY_KEY_ID,
      booking_ref: b.booking_ref,
    }});
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* POST /api/payments/verify */
router.post('/verify', authenticate, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

  if (expected !== razorpay_signature)
    return res.status(400).json({ success: false, message: 'Payment verification failed' });

  try {
    await query("UPDATE payments SET razorpay_payment_id=$1,razorpay_signature=$2,status='paid' WHERE razorpay_order_id=$3",
      [razorpay_payment_id, razorpay_signature, razorpay_order_id]);
    await query("UPDATE bookings SET status='confirmed' WHERE id=$1", [booking_id]);
    res.json({ success: true, message: 'Payment verified. Booking confirmed!' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
