const router = require('express').Router();
const { query }       = require('../db');
const { authenticate } = require('../middleware/auth');

/* GET /api/vendors?lat=&lng=&radius=10&city=&page=1&limit=12 */
router.get('/', async (req, res) => {
  const { lat, lng, radius = 10, city, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  try {
    let sql, params;
    if (lat && lng) {
      sql = `
        SELECT v.*,
          ROUND((6371 * acos(
            cos(radians($1)) * cos(radians(v.latitude)) *
            cos(radians(v.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(v.latitude))
          ))::numeric, 1) AS distance_km,
          COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL),'[]') AS services
        FROM vendors v
        LEFT JOIN services s ON s.vendor_id=v.id AND s.is_active=TRUE
        WHERE v.is_approved=TRUE AND v.is_active=TRUE
          AND (6371 * acos(
            cos(radians($1)) * cos(radians(v.latitude)) *
            cos(radians(v.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(v.latitude))
          )) <= $3
        GROUP BY v.id ORDER BY distance_km LIMIT $4 OFFSET $5`;
      params = [lat, lng, radius, limit, offset];
    } else {
      sql = `
        SELECT v.*,
          COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL),'[]') AS services
        FROM vendors v
        LEFT JOIN services s ON s.vendor_id=v.id AND s.is_active=TRUE
        WHERE v.is_approved=TRUE AND v.is_active=TRUE
          ${city ? 'AND LOWER(v.city)=LOWER($3)' : ''}
        GROUP BY v.id ORDER BY v.rating DESC LIMIT $1 OFFSET $2`;
      params = city ? [limit, offset, city] : [limit, offset];
    }
    const { rows } = await query(sql, params);
    res.json({ success: true, data: rows, page: +page, limit: +limit });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* GET /api/vendors/:idOrSlug */
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT v.*,
        COALESCE(json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL),'[]') AS services,
        COALESCE(json_agg(DISTINCT jsonb_build_object(
          'id',r.id,'rating',r.rating,'comment',r.comment,
          'created_at',r.created_at,'user_name',u.name
        )) FILTER (WHERE r.id IS NOT NULL),'[]') AS reviews
      FROM vendors v
      LEFT JOIN services s ON s.vendor_id=v.id AND s.is_active=TRUE
      LEFT JOIN reviews r ON r.vendor_id=v.id
      LEFT JOIN users u ON u.id=r.user_id
      WHERE v.id=$1 OR v.slug=$1
      GROUP BY v.id`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* POST /api/vendors/register */
router.post('/register', authenticate, async (req, res) => {
  const { business_name, description, address, city, state, pincode, phone, email, latitude, longitude } = req.body;
  const slug = business_name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now();
  try {
    const { rows: [v] } = await query(
      `INSERT INTO vendors(user_id,business_name,slug,description,address,city,state,pincode,phone,email,latitude,longitude)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.user.id,business_name,slug,description,address,city,state,pincode,phone,email,latitude,longitude]);
    await query("UPDATE users SET role='vendor' WHERE id=$1", [req.user.id]);
    res.status(201).json({ success: true, data: v });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* GET /api/vendors/my/profile — vendor sees own profile */
router.get('/my/profile', authenticate, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM vendors WHERE user_id=$1', [req.user.id]);
    res.json({ success: true, data: rows[0] || null });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/* PUT /api/vendors/:id */
router.put('/:id', authenticate, async (req, res) => {
  const fields = ['description','address','phone','opening_time','closing_time','working_days','slot_duration_minutes','cover_url','logo_url'];
  const sets = []; const vals = []; let i = 1;
  fields.forEach(f => { if (req.body[f] !== undefined) { sets.push(`${f}=$${i++}`); vals.push(req.body[f]); } });
  if (!sets.length) return res.status(400).json({ success: false, message: 'Nothing to update' });
  vals.push(req.params.id, req.user.id);
  try {
    const { rows } = await query(
      `UPDATE vendors SET ${sets.join(',')} WHERE id=$${i} AND user_id=$${i+1} RETURNING *`, vals);
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
