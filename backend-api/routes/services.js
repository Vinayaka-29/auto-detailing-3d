const router = require('express').Router();
const { query }       = require('../db');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { vendor_id } = req.query;
  try {
    const { rows } = await query(
      'SELECT * FROM services WHERE vendor_id=$1 AND is_active=TRUE ORDER BY price', [vendor_id]);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authenticate, async (req, res) => {
  const { vendor_id, name, description, price, duration_minutes, category } = req.body;
  try {
    const { rows: [own] } = await query('SELECT id FROM vendors WHERE id=$1 AND user_id=$2', [vendor_id, req.user.id]);
    if (!own) return res.status(403).json({ success: false, message: 'Not your vendor' });
    const { rows: [s] } = await query(
      'INSERT INTO services(vendor_id,name,description,price,duration_minutes,category) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [vendor_id, name, description, price, duration_minutes, category]);
    res.status(201).json({ success: true, data: s });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, description, price, duration_minutes, is_active } = req.body;
  try {
    const { rows } = await query(`
      UPDATE services s SET
        name=COALESCE($1,name), description=COALESCE($2,description),
        price=COALESCE($3,price), duration_minutes=COALESCE($4,duration_minutes),
        is_active=COALESCE($5,is_active)
      FROM vendors v WHERE v.id=s.vendor_id AND v.user_id=$6 AND s.id=$7 RETURNING s.*`,
      [name, description, price, duration_minutes, is_active, req.user.id, req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await query(`UPDATE services s SET is_active=FALSE FROM vendors v
      WHERE v.id=s.vendor_id AND v.user_id=$1 AND s.id=$2`, [req.user.id, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
