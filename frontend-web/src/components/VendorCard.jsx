import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/helpers'

export default function VendorCard({ vendor, index = 0 }) {
  const minPrice = vendor.services?.length
    ? Math.min(...vendor.services.map(s => s.price))
    : null

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.35, delay: index * 0.06 }}>
      <Link to={`/vendors/${vendor.slug || vendor.id}`} style={{ textDecoration:'none', display:'block' }}>
        <div style={{
          background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:18, overflow:'hidden', cursor:'pointer',
          transition:'all 0.25s',
        }}
        onMouseOver={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(226,75,74,0.3)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.4)' }}
        onMouseOut={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none' }}>

          {/* Cover */}
          <div style={{ position:'relative', height:172, overflow:'hidden', background:'#222' }}>
            {vendor.cover_url ? (
              <img src={vendor.cover_url} alt={vendor.business_name}
                style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                onMouseOver={e=>e.target.style.transform='scale(1.06)'}
                onMouseOut={e=>e.target.style.transform='scale(1)'}
              />
            ) : (
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#1a1a1a,#2a2a2a)', fontSize:48 }}>🚗</div>
            )}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.6),transparent 60%)' }} />

            {/* Rating */}
            <div style={{
              position:'absolute', top:12, right:12,
              display:'flex', alignItems:'center', gap:4,
              background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)',
              padding:'4px 10px', borderRadius:20,
            }}>
              <span style={{ color:'#FBBF24', fontSize:12 }}>★</span>
              <span style={{ color:'#fff', fontSize:12, fontWeight:600 }}>{Number(vendor.rating).toFixed(1)}</span>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>({vendor.review_count})</span>
            </div>

            {/* Verified */}
            {vendor.is_approved && (
              <div style={{
                position:'absolute', top:12, left:12,
                background:'rgba(29,158,117,0.85)', backdropFilter:'blur(6px)',
                color:'#fff', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:5,
              }}>✓ Verified</div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding:'14px 16px 16px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
              {vendor.logo_url ? (
                <img src={vendor.logo_url} alt="" style={{ width:38, height:38, borderRadius:10, objectFit:'cover', border:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }} />
              ) : (
                <div style={{
                  width:38, height:38, borderRadius:10, flexShrink:0,
                  background:'rgba(226,75,74,0.18)', display:'flex', alignItems:'center',
                  justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, color:'#E24B4A', fontSize:16,
                }}>{vendor.business_name?.[0]}</div>
              )}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:0, fontFamily:'Syne,sans-serif', fontWeight:700, color:'#fff', fontSize:15, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {vendor.business_name}
                </p>
                <p style={{ margin:'2px 0 0', fontSize:12, color:'rgba(255,255,255,0.4)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {vendor.address}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12 }}>
              <div style={{ display:'flex', gap:12, color:'rgba(255,255,255,0.45)' }}>
                {vendor.distance_km != null && <span>📍 {vendor.distance_km} km</span>}
                <span>{vendor.city}</span>
              </div>
              {minPrice && (
                <span style={{ color:'#E24B4A', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14 }}>
                  {formatPrice(minPrice)} <span style={{ fontSize:10, fontFamily:'DM Sans,sans-serif', fontWeight:400, color:'rgba(255,255,255,0.35)' }}>onwards</span>
                </span>
              )}
            </div>

            {/* Service tags */}
            {vendor.services?.length > 0 && (
              <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
                {vendor.services.slice(0,3).map(sv => (
                  <span key={sv.id} style={{
                    fontSize:11, background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)',
                    padding:'2px 9px', borderRadius:100,
                  }}>{sv.name}</span>
                ))}
                {vendor.services.length > 3 && (
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', padding:'2px 4px' }}>+{vendor.services.length-3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
