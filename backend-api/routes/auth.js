const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query }       = require('../db');
const { authenticate } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/* POST /api/auth/register */
router.post('/register', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });
  const { name, email, phone, password } = req.body;
  try {
    const dup = await query('SELECT id FROM users WHERE email=$1', [email]);
    if (dup.rows[0]) return res.status(409).json({ success: false, message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const { rows: [u] } = await query(
      'INSERT INTO users(name,email,phone,password_hash) VALUES($1,$2,$3,$4) RETURNING id,name,email,role',
      [name, email, phone, hash]);
    res.status(201).json({ success: true, token: sign(u.id), user: u });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* POST /api/auth/login */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });
  const { email, password } = req.body;
  try {
    const { rows: [u] } = await query('SELECT * FROM users WHERE email=$1 AND is_active=TRUE', [email]);
    if (!u || !(await bcrypt.compare(password, u.password_hash)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const { password_hash, ...safe } = u;
    res.json({ success: true, token: sign(u.id), user: safe });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* GET /api/auth/me */
router.get('/me', authenticate, (req, res) => res.json({ success: true, user: req.user }));

module.exports = router;
