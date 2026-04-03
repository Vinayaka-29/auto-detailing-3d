# CarWash Connect 🚗💦

> Swiggy/Zomato-style marketplace for car wash & auto detailing — built for India.

## Architecture

```
carwash-connect/
├── frontend-web/       React + Vite + Tailwind  (Customer App)   → Vercel  :5173
├── vendor-dashboard/   React + Vite + Tailwind  (Vendor App)     → Vercel  :5174
├── admin-panel/        React + Vite + Tailwind  (Admin App)      → Vercel  :5175
└── backend-api/        Node + Express + pg      (REST API)       → Render  :5000
```

## Quick Start

```bash
# 1. Clone & install all
git clone https://github.com/YOUR_USERNAME/carwash-connect
cd carwash-connect
npm run install:all

# 2. Setup backend env
cp backend-api/.env.example backend-api/.env
# Fill in DATABASE_URL, JWT_SECRET, RAZORPAY_KEY_ID/SECRET, GOOGLE_MAPS_API_KEY

# 3. Run Supabase SQL schema
# Open Supabase SQL editor → paste backend-api/db/schema.sql → Run

# 4. Start all services (4 terminals)
npm run dev:backend   # :5000
npm run dev:frontend  # :5173
npm run dev:vendor    # :5174
npm run dev:admin     # :5175
```

## Tech Stack

| Layer      | Tech                                |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Framer Motion |
| Backend    | Node.js, Express, JWT, Razorpay     |
| Database   | PostgreSQL via Supabase             |
| Maps       | Google Maps JS API                  |
| Payments   | Razorpay                            |
| Hosting    | Vercel (frontend) + Render (backend)|

## Environment Variables

See `backend-api/.env.example` and `frontend-web/.env.example`
