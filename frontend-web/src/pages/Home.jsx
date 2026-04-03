import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import VendorCard from '../components/VendorCard'

/* ── Hero slides ────────────────────────────────────── */
const SLIDES = [
  {
    title: 'Find Car Wash',
    accent: 'Near You',
    desc: 'Book verified wash centers in minutes.',
    sub: 'Location-aware search · Instant booking · Secure payment',
    img: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=80',
    badge: 'Live in Bangalore',
  },
  {
    title: 'Premium Detailing',
    accent: 'At Your Doorstep',
    desc: 'Ceramic coating, PPF, deep wash & more.',
    sub: 'Professional-grade services from verified vendors',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80',
    badge: 'Top Rated Services',
  },
  {
    title: 'Instant Booking,',
    accent: 'Online Payment',
    desc: 'Choose your slot, pay securely, get a showroom finish.',
    sub: 'UPI · Cards · Net Banking · Wallets via Razorpay',
    img: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&q=80',
    badge: 'Secure Payments',
  },
]

const STATS = [
  { value: '500+', label: 'Wash Centers' },
  { value: '50K+', label: 'Happy Cars'   },
  { value: '4.8★', label: 'Avg Rating'  },
  { value: '100%', label: 'Verified'     },
]

const STEPS = [
  { icon: '📍', step: '01', title: 'Find',       desc: 'Detect your location or search any city to see nearby verified wash centers with ratings and pricing.' },
  { icon: '📅', step: '02', title: 'Book',       desc: 'Select a service, pick a time slot that works for you, and confirm your booking in seconds.'           },
  { icon: '💳', step: '03', title: 'Pay & Shine', desc: 'Pay securely via Razorpay. Drop your car off and pick it up with a showroom finish.'                 },
]

/* ── Main component ─────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate()
  const [slide,    setSlide]    = useState(0)
  const [animating,setAnimating]= useState(false)
  const [search,   setSearch]   = useState('')
  const [vendors,  setVendors]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [locating, setLocating] = useState(false)
  const [coords,   setCoords]   = useState(null)

  /* Cinematic cross-fade slide */
  const goTo = useCallback((idx) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setSlide(idx); setAnimating(false) }, 350)
  }, [animating])

  useEffect(() => {
    const t = setInterval(() => goTo((slide + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [slide, goTo])

  /* Fetch vendors */
  useEffect(() => { fetchVendors() }, [])

  const fetchVendors = async (lat, lng, city) => {
    setLoading(true)
    try {
      const params = lat && lng ? { lat, lng, radius: 20 } : city ? { city } : {}
      const res = await api.get('/vendors', { params })
      setVendors(res.data || [])
    } catch { setVendors([]) }
    finally  { setLoading(false) }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported')
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCoords({ lat, lng })
        fetchVendors(lat, lng)
        setLocating(false)
      },
      () => { setLocating(false); alert('Location access denied') }
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) fetchVendors(null, null, search.trim())
  }

  const s = SLIDES[slide]

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════════════════ */}
      <section style={{ position:'relative', height:'100vh', overflow:'hidden' }}>

        {/* Background images — cinematic cross-fade */}
        {SLIDES.map((sl, i) => (
          <div key={i} style={{
            position:'absolute', inset:0,
            backgroundImage: `url(${sl.img})`,
            backgroundSize:'cover', backgroundPosition:'center',
            opacity: i === slide ? 1 : 0,
            transform: i === slide ? 'scale(1.04)' : 'scale(1)',
            transition: 'opacity 1.1s ease, transform 7s ease',
          }} />
        ))}

        {/* Overlays */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.5) 55%,rgba(0,0,0,0.15) 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)' }} />

        {/* Progress line */}
        <div style={{
          position:'absolute', top:0, left:0,
          height:3, background:'#E24B4A',
          width:`${((slide+1)/SLIDES.length)*100}%`,
          transition:'width 5.5s linear',
        }} />

        {/* Content */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column', justifyContent:'center',
          padding:'0 clamp(1.5rem,6vw,7rem)', paddingTop:80,
        }}>
          {/* Live badge */}
          <motion.div
            key={`badge-${slide}`}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(226,75,74,0.15)', border:'1px solid rgba(226,75,74,0.4)',
              borderRadius:100, padding:'5px 14px', width:'fit-content', marginBottom:'1.5rem',
            }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#E24B4A', display:'inline-block', animation:'glowPulse 2s infinite' }} />
            <span style={{ color:'#ff8a80', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>
              {s.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${slide}`}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
              transition={{ duration:0.5 }}
              style={{
                fontFamily:'Syne,sans-serif',
                fontSize:'clamp(2.8rem,7vw,6rem)',
                fontWeight:800, lineHeight:1.05,
                letterSpacing:'-2px', color:'#fff',
                marginBottom:'0.6rem', maxWidth:700,
              }}>
              {s.title}{' '}
              <span style={{ color:'#E24B4A', textShadow:'0 0 40px rgba(226,75,74,0.4)' }}>
                {s.accent}
              </span>
            </motion.h1>
          </AnimatePresence>

          <motion.p
            key={`desc-${slide}`}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}
            style={{ fontSize:'clamp(1rem,2vw,1.2rem)', color:'rgba(255,255,255,0.85)', fontWeight:300, marginBottom:6 }}>
            {s.desc}
          </motion.p>
          <motion.p
            key={`sub-${slide}`}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
            style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:'2.5rem' }}>
            {s.sub}
          </motion.p>

          {/* Search + location */}
          <form onSubmit={handleSearch} style={{ display:'flex', gap:10, maxWidth:500, marginBottom:14, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200, position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search city or area…"
                style={{
                  width:'100%', padding:'13px 16px 13px 40px',
                  background:'rgba(255,255,255,0.08)', backdropFilter:'blur(12px)',
                  border:'1px solid rgba(255,255,255,0.15)', borderRadius:10,
                  color:'#fff', fontSize:14, fontFamily:'DM Sans,sans-serif', outline:'none',
                }}
                onFocus={e=>e.target.style.borderColor='#E24B4A'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
              />
            </div>
            <button type="submit" className="btn-glow" style={{
              padding:'13px 24px', background:'#E24B4A', border:'none',
              color:'#fff', borderRadius:10, fontSize:14, fontWeight:600,
              cursor:'pointer', whiteSpace:'nowrap', transition:'background 0.15s',
            }}
            onMouseOver={e=>e.currentTarget.style.background='#A32D2D'}
            onMouseOut={e=>e.currentTarget.style.background='#E24B4A'}>
              Search
            </button>
          </form>

          <button onClick={detectLocation} style={{
            display:'flex', alignItems:'center', gap:8,
            background:'none', border:'none', cursor:'pointer',
            fontSize:13, color:'rgba(255,255,255,0.55)', transition:'color 0.2s',
          }}
          onMouseOver={e=>e.currentTarget.style.color='#E24B4A'}
          onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.55)'}>
            {locating ? <>⟳ Detecting location…</> : <>📍 Use my current location</>}
          </button>
        </div>

        {/* Slide dots */}
        <div style={{
          position:'absolute', bottom:110, left:'clamp(1.5rem,6vw,7rem)',
          display:'flex', gap:8, alignItems:'center',
        }}>
          {SLIDES.map((_,i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i===slide ? 28 : 8, height:8,
              borderRadius:4, border:'none',
              background: i===slide ? '#E24B4A' : 'rgba(255,255,255,0.25)',
              cursor:'pointer', transition:'all 0.35s', padding:0,
            }} />
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          background:'rgba(0,0,0,0.65)', backdropFilter:'blur(16px)',
          borderTop:'1px solid rgba(255,255,255,0.06)',
          display:'flex', justifyContent:'center',
        }}>
          {STATS.map((st, i) => (
            <div key={st.label} style={{
              flex:'1 1 0', maxWidth:220,
              display:'flex', flexDirection:'column', alignItems:'center',
              padding:'16px 10px',
              borderRight: i<STATS.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1rem,2vw,1.4rem)', color:'#fff' }}>{st.value}</span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ NEARBY VENDORS ══════════════════ */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'5rem 1.5rem' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <span className="section-tag">{coords ? 'Near You' : 'Featured'}</span>
            <h2 className="section-title" style={{ marginTop:4 }}>
              {coords ? 'Wash Centers Near You' : 'Top Wash Centers'}
            </h2>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:4 }}>
              {vendors.length > 0 ? `${vendors.length} centers found` : 'Discover top-rated centers across India'}
            </p>
          </div>
          <button onClick={() => navigate('/vendors')} style={{
            background:'none', border:'1px solid rgba(226,75,74,0.3)',
            color:'#E24B4A', padding:'8px 18px', borderRadius:8,
            fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s',
          }}
          onMouseOver={e=>{e.currentTarget.style.background='rgba(226,75,74,0.1)';e.currentTarget.style.borderColor='#E24B4A'}}
          onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.borderColor='rgba(226,75,74,0.3)'}}>
            View all →
          </button>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ height:280, borderRadius:16, background:'#1a1a1a', animation:'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {vendors.slice(0,6).map((v,i) => <VendorCard key={v.id} vendor={v} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'5rem 0', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🚗</div>
            <p style={{ fontSize:16 }}>No wash centers found. Try a different city.</p>
            <button onClick={() => navigate('/vendors')} style={{
              marginTop:20, padding:'10px 24px', background:'#E24B4A',
              border:'none', color:'#fff', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight:600,
            }}>Browse All Centers</button>
          </div>
        )}
      </section>

      {/* ═══════════════ HOW IT WORKS ════════════════════ */}
      <section style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'5rem 1.5rem' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title" style={{ marginTop:4 }}>How It Works</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.5rem' }}>
            {STEPS.map((item, i) => (
              <motion.div key={item.step} whileHover={{ y:-6 }}
                style={{
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:20, padding:'2rem', textAlign:'center', cursor:'default',
                  transition:'border-color 0.2s',
                }}
                onMouseOver={e=>e.currentTarget.style.borderColor='rgba(226,75,74,0.25)'}
                onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                <div style={{ fontSize:40, marginBottom:12 }}>{item.icon}</div>
                <div style={{ fontFamily:'DM Sans,monospace', fontSize:11, color:'#E24B4A', letterSpacing:2, marginBottom:8 }}>{item.step}</div>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.15rem', color:'#fff', marginBottom:10 }}>{item.title}</h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES PREVIEW ════════════════ */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'5rem 1.5rem' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <span className="section-tag">Services</span>
          <h2 className="section-title" style={{ marginTop:4 }}>What's Available on CarWash Connect</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:8, maxWidth:480, margin:'8px auto 0' }}>
            From quick washes to full ceramic protection — all services in one place.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
          {[
            { icon:'🚿', name:'Basic Wash',         price:'From ₹299', color:'rgba(29,158,117,0.15)', border:'rgba(29,158,117,0.3)'  },
            { icon:'✨', name:'Interior Detailing', price:'From ₹499', color:'rgba(226,75,74,0.12)',  border:'rgba(226,75,74,0.3)'   },
            { icon:'🛡️', name:'Ceramic Coating',   price:'From ₹5,999',color:'rgba(55,138,221,0.12)',border:'rgba(55,138,221,0.3)' },
            { icon:'🎬', name:'PPF Installation',  price:'From ₹9,999',color:'rgba(127,119,221,0.12)',border:'rgba(127,119,221,0.3)'},
            { icon:'🪣', name:'Full Detailing',    price:'From ₹1,499',color:'rgba(239,159,39,0.12)', border:'rgba(239,159,39,0.3)' },
          ].map(sv => (
            <button key={sv.name} onClick={() => navigate('/vendors')}
              style={{
                background: sv.color, border:`1px solid ${sv.border}`,
                borderRadius:14, padding:'1.25rem',
                display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                cursor:'pointer', transition:'transform 0.2s, border-color 0.2s',
              }}
              onMouseOver={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
              <span style={{ fontSize:28 }}>{sv.icon}</span>
              <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{sv.name}</span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{sv.price}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════ VENDOR CTA ══════════════════════ */}
      <section style={{ padding:'5rem 1.5rem', textAlign:'center', background:'rgba(226,75,74,0.04)', borderTop:'1px solid rgba(226,75,74,0.1)' }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <span className="section-tag">For Business Owners</span>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:800, color:'#fff', marginTop:8, marginBottom:16, letterSpacing:'-0.5px' }}>
            Own a Car Wash Center?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, lineHeight:1.7, marginBottom:'2.5rem' }}>
            Join hundreds of wash centers on CarWash Connect. Get more bookings, manage your schedule, and grow your business — all in one dashboard.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/register')} className="btn-glow" style={{
              padding:'14px 32px', background:'#E24B4A', border:'none',
              color:'#fff', borderRadius:10, fontSize:15, fontWeight:700,
              cursor:'pointer', transition:'background 0.15s',
            }}
            onMouseOver={e=>e.currentTarget.style.background='#A32D2D'}
            onMouseOut={e=>e.currentTarget.style.background='#E24B4A'}>
              Register Your Center →
            </button>
            <button onClick={() => navigate('/vendors')} style={{
              padding:'14px 32px', background:'transparent',
              border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)',
              borderRadius:10, fontSize:15, fontWeight:500, cursor:'pointer', transition:'all 0.2s',
            }}
            onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.4)';e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';e.currentTarget.style.color='rgba(255,255,255,0.7)'}}>
              See How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
