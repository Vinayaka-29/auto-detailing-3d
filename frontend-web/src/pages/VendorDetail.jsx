import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import { formatPrice, categoryLabel } from '../utils/helpers'

const CAT_COLORS = {
  wash:      { bg:'rgba(29,158,117,0.12)', border:'rgba(29,158,117,0.3)', text:'#4ade80' },
  detailing: { bg:'rgba(226,75,74,0.12)',  border:'rgba(226,75,74,0.3)',  text:'#ff8a80' },
  coating:   { bg:'rgba(55,138,221,0.12)', border:'rgba(55,138,221,0.3)', text:'#7dd3fc' },
  ppf:       { bg:'rgba(127,119,221,0.12)',border:'rgba(127,119,221,0.3)',text:'#c4b5fd' },
}

export default function VendorDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [vendor,   setVendor]  = useState(null)
  const [loading,  setLoading] = useState(true)
  const [tab,      setTab]     = useState('services')
  const [imgError, setImgError]= useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/vendors/${id}`)
      .then(r => setVendor(r.data))
      .catch(() => navigate('/vendors'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ paddingTop:72, minHeight:'100vh', maxWidth:900, margin:'0 auto', padding:'72px 1.5rem 2rem' }}>
      <div style={{ height:260, background:'#1a1a1a', borderRadius:20, marginBottom:24, animation:'pulse 1.5s ease infinite' }} />
      <div style={{ height:32, background:'#1a1a1a', borderRadius:8, width:'50%', marginBottom:12, animation:'pulse 1.5s ease infinite' }} />
      <div style={{ height:20, background:'#1a1a1a', borderRadius:8, width:'35%', animation:'pulse 1.5s ease infinite' }} />
    </div>
  )

  if (!vendor) return null

  const reviews = vendor.reviews?.filter(r => r.id) || []
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : Number(vendor.rating).toFixed(1)

  return (
    <div style={{ paddingTop:72, minHeight:'100vh', background:'#0a0a0a' }}>

      {/* ── Cover image ─────────────────────── */}
      <div style={{ position:'relative', height:260, overflow:'hidden', background:'#111' }}>
        {vendor.cover_url && !imgError ? (
          <img src={vendor.cover_url} alt={vendor.business_name}
            onError={() => setImgError(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{
            width:'100%', height:'100%',
            background:'linear-gradient(135deg,#1a0808,#0a0a1a)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:80,
          }}>🚗</div>
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,#0a0a0a 0%,rgba(10,10,10,0.4) 50%,transparent 100%)' }} />
        {/* Back button */}
        <button onClick={() => navigate('/vendors')} style={{
          position:'absolute', top:16, left:16,
          display:'flex', alignItems:'center', gap:6,
          background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)',
          border:'1px solid rgba(255,255,255,0.12)', borderRadius:20,
          color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight:500,
          padding:'6px 14px', cursor:'pointer', transition:'all 0.2s',
        }}
        onMouseOver={e=>e.currentTarget.style.background='rgba(0,0,0,0.8)'}
        onMouseOut={e=>e.currentTarget.style.background='rgba(0,0,0,0.6)'}>
          ← Back
        </button>
      </div>

      {/* ── Main content ─────────────────────── */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 clamp(1rem,4vw,1.5rem) 4rem', marginTop:-40, position:'relative', zIndex:2 }}>

        {/* Header card */}
        <div style={{
          background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:20,
          padding:'1.5rem', marginBottom:'1.5rem',
        }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
            {/* Logo */}
            {vendor.logo_url ? (
              <img src={vendor.logo_url} alt=""
                style={{ width:64, height:64, borderRadius:14, objectFit:'cover', border:'2px solid rgba(255,255,255,0.1)', flexShrink:0 }} />
            ) : (
              <div style={{
                width:64, height:64, borderRadius:14, flexShrink:0,
                background:'rgba(226,75,74,0.2)', display:'flex',
                alignItems:'center', justifyContent:'center',
                fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:26, color:'#E24B4A',
              }}>{vendor.business_name?.[0]}</div>
            )}

            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                <div>
                  <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(1.25rem,3vw,1.6rem)', color:'#fff', margin:0, letterSpacing:'-0.3px' }}>
                    {vendor.business_name}
                  </h1>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginTop:4 }}>
                    📍 {vendor.address}, {vendor.city}
                  </p>
                </div>
                {vendor.is_approved && (
                  <span style={{
                    background:'rgba(29,158,117,0.15)', border:'1px solid rgba(29,158,117,0.35)',
                    color:'#4ade80', fontSize:11, fontWeight:700,
                    padding:'4px 10px', borderRadius:6, letterSpacing:'0.5px', flexShrink:0,
                  }}>✓ VERIFIED</span>
                )}
              </div>

              {/* Meta row */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginTop:12, fontSize:13 }}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:'#FBBF24' }}>★</span>
                  <span style={{ color:'#fff', fontWeight:600 }}>{avgRating}</span>
                  <span style={{ color:'rgba(255,255,255,0.4)' }}>({vendor.review_count || reviews.length} reviews)</span>
                </span>
                {vendor.phone && (
                  <a href={`tel:${vendor.phone}`} style={{ color:'#E24B4A', textDecoration:'none', transition:'opacity 0.2s' }}
                    onMouseOver={e=>e.target.style.opacity='0.7'} onMouseOut={e=>e.target.style.opacity='1'}>
                    📞 {vendor.phone}
                  </a>
                )}
                {vendor.opening_time && (
                  <span style={{ color:'rgba(255,255,255,0.45)' }}>
                    🕐 {vendor.opening_time.slice(0,5)} – {vendor.closing_time?.slice(0,5)}
                  </span>
                )}
                {vendor.working_days?.length > 0 && (
                  <span style={{ color:'rgba(255,255,255,0.35)', fontSize:12 }}>
                    {vendor.working_days.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {vendor.description && (
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginTop:16, lineHeight:1.7, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              {vendor.description}
            </p>
          )}

          {/* Book CTA */}
          <button
            onClick={() => navigate(`/booking/${vendor.id}`, { state:{ vendor } })}
            className="btn-glow"
            style={{
              width:'100%', marginTop:20, padding:'14px',
              background:'linear-gradient(135deg,#E24B4A,#ff5252)',
              border:'none', color:'#fff', borderRadius:12,
              fontSize:15, fontWeight:700, cursor:'pointer', transition:'opacity 0.2s',
            }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.9'}
            onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Book a Slot at {vendor.business_name}
          </button>
        </div>

        {/* ── Tabs ───────────────────────────── */}
        <div style={{
          display:'flex', gap:4,
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:14, padding:4, marginBottom:'1.5rem',
        }}>
          {['services','reviews','photos'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'10px 0', fontSize:13, fontWeight:500,
              borderRadius:10, border:'none', cursor:'pointer',
              background: tab===t ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: tab===t ? '#fff' : 'rgba(255,255,255,0.4)',
              transition:'all 0.2s', textTransform:'capitalize',
            }}>
              {t}
              {t==='services' && vendor.services?.length > 0 && (
                <span style={{ marginLeft:6, background:'rgba(226,75,74,0.2)', color:'#E24B4A', fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700 }}>
                  {vendor.services.length}
                </span>
              )}
              {t==='reviews' && reviews.length > 0 && (
                <span style={{ marginLeft:6, background:'rgba(251,191,36,0.15)', color:'#FBBF24', fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700 }}>
                  {reviews.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Services ───────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === 'services' && (
            <motion.div key="services" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {vendor.services?.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {vendor.services.map((s, i) => {
                    const clr = CAT_COLORS[s.category] || CAT_COLORS.wash
                    return (
                      <motion.div key={s.id}
                        initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                          borderRadius:16, padding:'16px 18px',
                          display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
                          transition:'border-color 0.2s',
                        }}
                        onMouseOver={e=>e.currentTarget.style.borderColor='rgba(226,75,74,0.25)'}
                        onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                        <div style={{ flex:1, minWidth:160 }}>
                          <div style={{ marginBottom:6 }}>
                            <span style={{
                              fontSize:10, fontWeight:700, letterSpacing:'0.8px',
                              textTransform:'uppercase', padding:'3px 9px', borderRadius:6,
                              background: clr.bg, border:`1px solid ${clr.border}`, color: clr.text,
                            }}>{categoryLabel(s.category)}</span>
                          </div>
                          <p style={{ margin:'0 0 4px', fontWeight:600, color:'#fff', fontSize:15 }}>{s.name}</p>
                          {s.description && <p style={{ margin:0, color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.5 }}>{s.description}</p>}
                          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.3)', fontSize:12 }}>⏱ {s.duration_minutes} min</p>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'#E24B4A' }}>
                            {formatPrice(s.price)}
                          </div>
                          <button
                            onClick={() => navigate(`/booking/${vendor.id}`, { state:{ vendor, service:s } })}
                            style={{
                              marginTop:6, padding:'7px 16px',
                              background:'rgba(226,75,74,0.15)', border:'1px solid rgba(226,75,74,0.35)',
                              color:'#E24B4A', borderRadius:8, fontSize:12, fontWeight:600,
                              cursor:'pointer', transition:'all 0.15s',
                            }}
                            onMouseOver={e=>{ e.currentTarget.style.background='rgba(226,75,74,0.25)'; e.currentTarget.style.borderColor='#E24B4A' }}
                            onMouseOut={e=>{ e.currentTarget.style.background='rgba(226,75,74,0.15)'; e.currentTarget.style.borderColor='rgba(226,75,74,0.35)' }}>
                            Book This →
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'4rem 0', color:'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>⚙️</div>
                  <p>No services listed yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Reviews ────────────────────── */}
          {tab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {reviews.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {/* Overall score */}
                  <div style={{
                    background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.2)',
                    borderRadius:14, padding:'16px 20px',
                    display:'flex', alignItems:'center', gap:16,
                  }}>
                    <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2.5rem', fontWeight:800, color:'#FBBF24' }}>{avgRating}</div>
                    <div>
                      <div style={{ display:'flex', gap:2 }}>
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{ color: i <= Math.round(avgRating) ? '#FBBF24' : 'rgba(255,255,255,0.2)', fontSize:16 }}>★</span>
                        ))}
                      </div>
                      <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:'4px 0 0' }}>{reviews.length} verified review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {reviews.map((r, i) => (
                    <motion.div key={r.id}
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                        borderRadius:14, padding:'16px 18px',
                      }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{
                            width:36, height:36, borderRadius:'50%',
                            background:'linear-gradient(135deg,#E24B4A,#ff6b6b)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight:700, fontSize:14, color:'#fff',
                          }}>{r.user_name?.[0]?.toUpperCase() || 'U'}</div>
                          <div>
                            <p style={{ margin:0, fontWeight:600, color:'#fff', fontSize:14 }}>{r.user_name || 'Customer'}</p>
                            <p style={{ margin:0, fontSize:11, color:'rgba(255,255,255,0.3)' }}>
                              {new Date(r.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:2 }}>
                          {[1,2,3,4,5].map(i => (
                            <span key={i} style={{ color: i <= r.rating ? '#FBBF24' : 'rgba(255,255,255,0.15)', fontSize:13 }}>★</span>
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.65, margin:0 }}>"{r.comment}"</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'4rem 0', color:'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>⭐</div>
                  <p>No reviews yet — be the first!</p>
                  <button onClick={() => navigate(`/booking/${vendor.id}`, { state:{ vendor } })}
                    style={{ marginTop:16, padding:'10px 24px', background:'#E24B4A', border:'none', color:'#fff', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 }}>
                    Book & Review →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Photos ─────────────────────── */}
          {tab === 'photos' && (
            <motion.div key="photos" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {vendor.photos?.length > 0 ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
                  {vendor.photos.map((p, i) => (
                    <img key={i} src={p} alt=""
                      style={{ width:'100%', height:160, objectFit:'cover', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'4rem 0', color:'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>📷</div>
                  <p>No photos uploaded yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
