require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const bookingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { success: false, message: 'Too many bookings, try again later.' } });
app.use('/api/', limiter);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sparklineauto')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ── Schemas ──────────────────────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 100 },
  phone:       { type: String, required: true, trim: true, maxlength: 20 },
  email:       { type: String, required: true, trim: true, lowercase: true },
  service:     { type: String, required: true },
  packageTier: { type: String, enum: ['basic','standard','premium'], default: 'standard' },
  carModel:    { type: String, trim: true, maxlength: 100 },
  date:        { type: Date, required: true },
  timeSlot:    { type: String, required: true },
  location:    { type: String, enum: ['doorstep','center'], default: 'center' },
  address:     { type: String, trim: true, maxlength: 300 },
  notes:       { type: String, trim: true, maxlength: 500 },
  status:      { type: String, enum: ['pending','confirmed','in-progress','completed','cancelled'], default: 'pending' },
  bookingId:   { type: String, unique: true },
  createdAt:   { type: Date, default: Date.now }
});
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'SPA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
  }
  next();
});

const reviewSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 100 },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  message:  { type: String, required: true, trim: true, maxlength: 1000 },
  service:  { type: String, trim: true },
  carModel: { type: String, trim: true },
  approved: { type: Boolean, default: false },
  createdAt:{ type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true },
  phone:    { type: String, trim: true },
  message:  { type: String, required: true, trim: true, maxlength: 1000 },
  createdAt:{ type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  name: String, description: String,
  price: { basic: Number, standard: Number, premium: Number },
  duration: String, category: String, popular: Boolean
});

const Booking = mongoose.model('Booking', bookingSchema);
const Review  = mongoose.model('Review', reviewSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Service = mongoose.model('Service', serviceSchema);

// ── Email ────────────────────────────────────────────────────────────────────
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
}

async function sendConfirmationEmail(booking) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: `"Sparkline Auto" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: `✅ Booking Confirmed — ${booking.bookingId}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden;"><div style="background:linear-gradient(135deg,#c0392b,#8b0000);padding:30px;text-align:center;"><h1 style="margin:0;font-size:28px;letter-spacing:2px;">SPARKLINE AUTO</h1><p style="margin:8px 0 0;color:rgba(255,255,255,0.8);">Premium Auto Detailing</p></div><div style="padding:30px;"><h2 style="color:#e74c3c;">Booking Confirmed! 🎉</h2><p>Hi <strong>${booking.name}</strong>, your appointment is locked in.</p><div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:20px;margin:20px 0;"><p><strong>Booking ID:</strong> <span style="color:#e74c3c;">${booking.bookingId}</span></p><p><strong>Service:</strong> ${booking.service}</p><p><strong>Package:</strong> ${booking.packageTier}</p><p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p><p><strong>Time:</strong> ${booking.timeSlot}</p><p><strong>Type:</strong> ${booking.location==='doorstep'?'🏠 Doorstep Service':'🏢 Service Center'}</p>${booking.address?`<p><strong>Address:</strong> ${booking.address}</p>`:''}</div><p style="color:#aaa;font-size:14px;">Our team will call you 24 hours before. Questions? <a href="tel:8123823193" style="color:#e74c3c;">8123823193</a></p></div><div style="background:rgba(255,255,255,0.05);padding:20px;text-align:center;font-size:12px;color:#666;">© ${new Date().getFullYear()} Sparkline Auto. All rights reserved.</div></div>`
    });
  } catch(e) { console.error('Email error:', e.message); }
}

// ── Booking Routes ───────────────────────────────────────────────────────────
app.post('/api/book', bookingLimiter, async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    sendConfirmationEmail(booking);
    res.status(201).json({ success: true, message: 'Booking confirmed!', bookingId: booking.bookingId, booking });
  } catch(err) {
    if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
    res.status(500).json({ success: false, message: 'Server error, please try again.' });
  }
});

app.get('/api/book/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

app.get('/api/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date required' });
    const allSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
    const start = new Date(date); start.setHours(0,0,0,0);
    const end = new Date(date); end.setHours(23,59,59,999);
    const booked = await Booking.find({ date:{$gte:start,$lte:end}, status:{$ne:'cancelled'} }).select('timeSlot');
    const bookedSlots = booked.map(b => b.timeSlot);
    res.json({ success: true, slots: allSlots.map(slot => ({ slot, available: !bookedSlots.includes(slot) })) });
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── Admin Routes ─────────────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ success: false, message: 'Unauthorized' });
  next();
}
app.get('/api/admin/bookings', adminAuth, async (req, res) => {
  try {
    const { status, page=1, limit=20 } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ success: true, bookings, total, pages: Math.ceil(total/limit) });
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});
app.patch('/api/admin/bookings/:id/status', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, booking });
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});
app.get('/api/admin/reviews', adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});
app.patch('/api/admin/reviews/:id/approve', adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json({ success: true, review });
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── Reviews ──────────────────────────────────────────────────────────────────
app.post('/api/reviews', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ success: true, message: 'Review submitted! It will appear after approval.' });
  } catch(err) { res.status(500).json({ success: false, message: 'Error submitting review' }); }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(20);
    const avgData = await Review.aggregate([{ $match:{approved:true} },{ $group:{_id:null,avg:{$avg:'$rating'}} }]);
    const avgRating = avgData.length ? avgData[0].avg.toFixed(1) : '5.0';
    res.json({ success: true, reviews, avgRating, count: reviews.length });
  } catch(err) { res.status(500).json({ success: false, message: 'Error fetching reviews' }); }
});

// ── Contact ──────────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: "Message received! We'll get back to you within 24 hours." });
  } catch(err) { res.status(500).json({ success: false, message: 'Error sending message' }); }
});

// ── Services ─────────────────────────────────────────────────────────────────
app.get('/api/services', async (req, res) => {
  try {
    let services = await Service.find();
    if (!services.length) {
      services = await Service.insertMany([
        { name:'Exterior Wash & Dry', description:'Complete foam wash, rinse, and hand dry.', price:{basic:499,standard:799,premium:1199}, duration:'1–2 hrs', category:'Wash', popular:false },
        { name:'Interior Detailing', description:'Deep vacuum, dashboard cleaning, leather conditioning.', price:{basic:799,standard:1299,premium:1999}, duration:'2–3 hrs', category:'Interior', popular:true },
        { name:'Ceramic Coating', description:'9H nano-ceramic coating for long-lasting gloss and protection.', price:{basic:9999,standard:14999,premium:24999}, duration:'1–2 days', category:'Protection', popular:true },
        { name:'Paint Protection Film', description:'Self-healing TPU film against scratches and chips.', price:{basic:14999,standard:24999,premium:49999}, duration:'2–3 days', category:'Protection', popular:false },
        { name:'Paint Correction', description:'Multi-stage machine polishing to remove swirls and scratches.', price:{basic:4999,standard:8999,premium:14999}, duration:'4–8 hrs', category:'Paint', popular:true },
        { name:'Full Detailing Package', description:'Complete interior + exterior + engine bay treatment.', price:{basic:2999,standard:4999,premium:7999}, duration:'4–6 hrs', category:'Package', popular:true },
      ]);
    }
    res.json({ success: true, services });
  } catch(err) { res.status(500).json({ success: false, message: 'Error fetching services' }); }
});

// ── Stats ────────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [totalBookings, completedJobs, totalReviews, avgData] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status:'completed' }),
      Review.countDocuments({ approved:true }),
      Review.aggregate([{ $match:{approved:true} },{ $group:{_id:null,avg:{$avg:'$rating'}} }])
    ]);
    res.json({ success: true, stats: {
      totalBookings, completedJobs,
      happyClients: Math.max(completedJobs, 500),
      avgRating: avgData.length ? avgData[0].avg.toFixed(1) : '4.9',
      yearsExperience: new Date().getFullYear() - 2018,
      carsDetailed: Math.max(completedJobs, 2000)
    }});
  } catch(err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(PORT, () => console.log(`🚀 Sparkline Auto backend → http://localhost:${PORT}`));
