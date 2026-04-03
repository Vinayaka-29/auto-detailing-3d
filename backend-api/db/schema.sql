-- ═══════════════════════════════════════════════════════
-- CarWash Connect — Supabase SQL Schema
-- Run this ONCE in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────
-- USERS
-- ─────────────────────────────────────
CREATE TABLE users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  password_hash TEXT,
  avatar_url    TEXT,
  role          TEXT DEFAULT 'customer',   -- customer | vendor | admin
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- VENDORS
-- ─────────────────────────────────────
CREATE TABLE vendors (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name         TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  description           TEXT,
  address               TEXT NOT NULL,
  city                  TEXT NOT NULL,
  state                 TEXT NOT NULL,
  pincode               TEXT,
  latitude              DOUBLE PRECISION,
  longitude             DOUBLE PRECISION,
  phone                 TEXT,
  email                 TEXT,
  logo_url              TEXT,
  cover_url             TEXT,
  photos                TEXT[]  DEFAULT '{}',
  rating                NUMERIC(3,2) DEFAULT 0,
  review_count          INT     DEFAULT 0,
  is_approved           BOOLEAN DEFAULT FALSE,
  is_active             BOOLEAN DEFAULT TRUE,
  opening_time          TIME    DEFAULT '08:00',
  closing_time          TIME    DEFAULT '20:00',
  working_days          TEXT[]  DEFAULT ARRAY['Mon','Tue','Wed','Thu','Fri','Sat'],
  slot_duration_minutes INT     DEFAULT 60,
  commission_pct        NUMERIC(5,2) DEFAULT 10.00,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────
CREATE TABLE services (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id        UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  price            INTEGER NOT NULL,      -- paise  (₹299 = 29900)
  duration_minutes INTEGER DEFAULT 60,
  category         TEXT DEFAULT 'wash',  -- wash | detailing | coating | ppf
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────
CREATE TABLE bookings (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref      TEXT UNIQUE NOT NULL,
  user_id          UUID REFERENCES users(id),
  vendor_id        UUID REFERENCES vendors(id),
  service_id       UUID REFERENCES services(id),
  vehicle_type     TEXT NOT NULL,   -- hatchback|sedan|suv|muv|luxury
  vehicle_number   TEXT,
  booking_date     DATE NOT NULL,
  booking_time     TIME NOT NULL,
  status           TEXT DEFAULT 'pending', -- pending|confirmed|in_progress|completed|cancelled
  total_amount     INTEGER NOT NULL,
  platform_fee     INTEGER DEFAULT 0,
  vendor_payout    INTEGER DEFAULT 0,
  notes            TEXT,
  cancelled_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────
CREATE TABLE payments (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id           UUID REFERENCES bookings(id),
  razorpay_order_id    TEXT UNIQUE,
  razorpay_payment_id  TEXT,
  razorpay_signature   TEXT,
  amount               INTEGER NOT NULL,
  currency             TEXT DEFAULT 'INR',
  status               TEXT DEFAULT 'created', -- created|paid|failed|refunded
  method               TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────
CREATE TABLE reviews (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  user_id    UUID REFERENCES users(id),
  vendor_id  UUID REFERENCES vendors(id),
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────
CREATE INDEX idx_vendors_city     ON vendors(city);
CREATE INDEX idx_vendors_latlong  ON vendors(latitude, longitude);
CREATE INDEX idx_bookings_user    ON bookings(user_id);
CREATE INDEX idx_bookings_vendor  ON bookings(vendor_id);
CREATE INDEX idx_bookings_date    ON bookings(booking_date);
CREATE INDEX idx_reviews_vendor   ON reviews(vendor_id);

-- ─────────────────────────────────────
-- TRIGGERS — updated_at
-- ─────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users    BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_vendors  BEFORE UPDATE ON vendors  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────
INSERT INTO users (name, email, phone, role, password_hash) VALUES
  ('Admin', 'admin@carwashconnect.in', '9999999999', 'admin',
   '$2a$12$placeholder_replace_with_real_hash');

INSERT INTO vendors (user_id, business_name, slug, description, address, city, state, pincode, latitude, longitude, phone, email, is_approved, rating, review_count)
VALUES
  ((SELECT id FROM users WHERE email='admin@carwashconnect.in'),
   'Speed Car Wash', 'speed-car-wash',
   'Premium car wash and detailing in the heart of Bangalore.',
   '15, Residency Rd, Shanthala Nagar', 'Bangalore', 'Karnataka', '560025',
   12.9716, 77.5946, '9876543210', 'hello@speedcarwash.in', TRUE, 4.8, 124),
  ((SELECT id FROM users WHERE email='admin@carwashconnect.in'),
   'Shine Auto Spa', 'shine-auto-spa',
   'Full-service auto detailing with ceramic coating specialists.',
   '42, Indiranagar 100ft Rd', 'Bangalore', 'Karnataka', '560038',
   12.9784, 77.6408, '9845001234', 'info@shineautospa.in', TRUE, 4.6, 89);

INSERT INTO services (vendor_id, name, description, price, duration_minutes, category) VALUES
  ((SELECT id FROM vendors WHERE slug='speed-car-wash'), 'Basic Wash',       'Exterior foam wash + rinse',              29900,  30,  'wash'),
  ((SELECT id FROM vendors WHERE slug='speed-car-wash'), 'Interior Cleaning', 'Full interior vacuum, wipe & fragrance',  49900,  60,  'wash'),
  ((SELECT id FROM vendors WHERE slug='speed-car-wash'), 'Full Detailing',    'Complete exterior + interior detailing',  149900, 180, 'detailing'),
  ((SELECT id FROM vendors WHERE slug='speed-car-wash'), 'Ceramic Coating',   '9H nano ceramic paint protection',        1499900,480, 'coating'),
  ((SELECT id FROM vendors WHERE slug='shine-auto-spa'), 'Express Wash',      'Quick foam wash in 20 minutes',           19900,  20,  'wash'),
  ((SELECT id FROM vendors WHERE slug='shine-auto-spa'), 'PPF Installation',  'Self-healing paint protection film',      2499900,720, 'ppf');
