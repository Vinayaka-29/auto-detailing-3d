const jwt = require('jsonwebtoken');
const { query } = require('../db');

const authenticate = async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'No token' });
  try {
    const { id } = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const { rows } = await query(
      'SELECT id, name, email, role FROM users WHERE id=$1 AND is_active=TRUE', [id]);
    if (!rows[0]) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next()
    : res.status(403).json({ success: false, message: 'Forbidden' });

module.exports = { authenticate, requireRole };
