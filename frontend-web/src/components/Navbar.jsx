import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout }   = useAuth()
  const { pathname }       = useLocation()
  const navigate           = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const NAV_LINKS = [
    { to: '/',        label: 'Home' },
    { to: '/vendors', label: 'Find Wash' },
  ]

  const isHome = pathname === '/'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: scrolled ? '60px' : '72px',
        padding: '0 clamp(1rem, 4vw, 2.5rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(10,10,10,0.94)'
          : isHome ? 'linear-gradient(to bottom,rgba(0,0,0,0.65),transparent)' : 'rgba(10,10,10,0.94)',
        backdropFilter: (scrolled || !isHome) ? 'blur(20px)' : 'none',
        borderBottom: (scrolled || !isHome) ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg,#E24B4A,#ff6b6b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>🚗</div>
          <div>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
              CarWash<span style={{ color: '#E24B4A' }}> Connect</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontSize: 13, fontWeight: 500,
              color: pathname === l.to ? '#fff' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none', transition: 'color 0.2s',
              borderBottom: pathname === l.to ? '2px solid #E24B4A' : '2px solid transparent',
              paddingBottom: 2,
            }}
            onMouseOver={e => e.currentTarget.style.color='#fff'}
            onMouseOut={e => e.currentTarget.style.color = pathname===l.to ? '#fff' : 'rgba(255,255,255,0.6)'}
            >{l.label}</Link>
          ))}

          {user ? (
            <>
              <Link to="/bookings" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.6)'}>
                My Bookings
              </Link>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '6px 12px', transition: 'all 0.2s',
              }}
              onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: '#E24B4A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff',
                }}>{user.name?.[0]?.toUpperCase()}</div>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/') }} style={{
                background: 'none', border: 'none', fontSize: 12,
                color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'color 0.2s',
              }}
              onMouseOver={e=>e.target.style.color='#E24B4A'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.35)'}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none', padding: '8px 16px',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9,
                transition: 'all 0.2s',
              }}
              onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.35)';e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';e.currentTarget.style.color='rgba(255,255,255,0.7)'}}>
                Login
              </Link>
              <Link to="/register" style={{
                fontSize: 13, fontWeight: 600, color: '#fff',
                textDecoration: 'none', padding: '8px 18px',
                background: '#E24B4A', borderRadius: 9,
                transition: 'all 0.15s',
              }}
              onMouseOver={e=>{e.currentTarget.style.background='#A32D2D';e.currentTarget.style.transform='translateY(-1px)'}}
              onMouseOut={e=>{e.currentTarget.style.background='#E24B4A';e.currentTarget.style.transform='translateY(0)'}}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o=>!o)} className="mobile-hamburger"
          style={{ display:'none', flexDirection:'column', gap:5, background:'none', border:'none', cursor:'pointer', padding:6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:22, height:2, background:'#fff', borderRadius:2, transition:'all 0.25s',
              transform: menuOpen ? [
                'rotate(45deg) translate(5px,5px)',
                'scaleX(0)',
                'rotate(-45deg) translate(5px,-5px)',
              ][i] : 'none',
              opacity: menuOpen && i===1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position:'fixed', inset:0, zIndex:999,
        background:'rgba(10,10,10,0.98)', backdropFilter:'blur(20px)',
        padding:'90px 1.5rem 2rem',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {[{ to:'/', label:'Home' },{ to:'/vendors', label:'Find Wash' },
          ...(user ? [{ to:'/bookings', label:'My Bookings' },{ to:'/profile', label:'Profile' }]
                   : [{ to:'/login', label:'Login' },{ to:'/register', label:'Sign Up Free' }])
        ].map(l => (
          <Link key={l.to} to={l.to} style={{
            display:'block', padding:'16px 0', fontSize:'1.1rem',
            fontWeight: 500, color:'rgba(255,255,255,0.85)', textDecoration:'none',
            borderBottom:'1px solid rgba(255,255,255,0.06)',
          }}>{l.label}</Link>
        ))}
        {user && (
          <button onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}
            style={{ marginTop:'1.5rem', width:'100%', padding:14, background:'rgba(226,75,74,0.12)',
              border:'1px solid rgba(226,75,74,0.25)', color:'#E24B4A',
              borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer' }}>
            Logout
          </button>
        )}
      </div>

      <style>{`
        @media(max-width:768px){ .desktop-nav{display:none!important} .mobile-hamburger{display:flex!important} }
      `}</style>
    </>
  )
}
