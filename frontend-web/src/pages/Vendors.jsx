import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'
import VendorCard from '../components/VendorCard'

const FILTERS = ['All','Wash','Detailing','Coating','PPF']

export default function Vendors() {
  const [vendors,  setVendors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')
  const [search,   setSearch]   = useState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => { load() }, [])

  const load = async (params = {}) => {
    setLoading(true)
    try {
      const res = await api.get('/vendors', { params: { limit:50, ...params } })
      setVendors(res.data || [])
    } catch { setVendors([]) }
    finally  { setLoading(false) }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => { load({ lat: pos.coords.latitude, lng: pos.coords.longitude, radius:20 }); setLocating(false) },
      ()  => setLocating(false)
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) load({ city: search.trim() })
  }

  const shown = vendors.filter(v => {
    if (filter === 'All') return true
    return v.services?.some(s => s.category === filter.toLowerCase())
  })

  return (
    <div style={{ paddingTop:72, minHeight:'100vh' }}>
      {/* Sticky filter bar */}
      <div style={{
        position:'sticky', top:60, zIndex:30,
        background:'rgba(10,10,10,0.95)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        padding:'12px clamp(1rem,4vw,1.5rem)',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:10, alignItems:'center' }}>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:8 }}>
            <input className="input" style={{ height:36, width:200, fontSize:13 }}
              placeholder="Search city…" value={search} onChange={e=>setSearch(e.target.value)} />
            <button type="submit" className="btn-primary" style={{ height:36, padding:'0 16px', fontSize:13 }}>Go</button>
          </form>
          <button onClick={detectLocation} style={{
            height:36, padding:'0 12px', background:'none',
            border:'1px solid rgba(255,255,255,0.12)', borderRadius:9,
            color:'rgba(255,255,255,0.55)', fontSize:12, cursor:'pointer', transition:'all 0.2s',
          }}
          onMouseOver={e=>{e.currentTarget.style.color='#E24B4A';e.currentTarget.style.borderColor='rgba(226,75,74,0.4)'}}
          onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,0.55)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}}>
            {locating ? '⟳ Detecting…' : '📍 Near me'}
          </button>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                height:34, padding:'0 14px', borderRadius:20, fontSize:12, fontWeight:500,
                border: filter===f ? '1px solid #E24B4A' : '1px solid rgba(255,255,255,0.1)',
                background: filter===f ? 'rgba(226,75,74,0.15)' : 'none',
                color: filter===f ? '#E24B4A' : 'rgba(255,255,255,0.5)',
                cursor:'pointer', transition:'all 0.15s',
              }}>{f}</button>
            ))}
          </div>
          <span style={{ marginLeft:'auto', fontSize:12, color:'rgba(255,255,255,0.3)' }}>
            {loading ? 'Loading…' : `${shown.length} centers`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem clamp(1rem,4vw,1.5rem)' }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ height:280, borderRadius:18, background:'#1a1a1a', animation:'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : shown.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {shown.map((v,i) => <VendorCard key={v.id} vendor={v} index={i} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ textAlign:'center', padding:'5rem 0', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🔍</div>
            <p style={{ fontSize:17 }}>No wash centers found</p>
            <p style={{ fontSize:13, marginTop:6 }}>Try a different city or remove filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
