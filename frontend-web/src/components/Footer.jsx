import { Link, useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{ background:'#080808', borderTop:'1px solid rgba(255,255,255,0.06)' }}>

      {/* CTA Banner */}
      <div style={{
        background:'linear-gradient(135deg,#E24B4A,#A32D2D)',
        padding:'3rem 2rem',
      }}>
        <div style={{
          maxWidth:1200, margin:'0 auto',
          display:'flex', flexWrap:'wrap', alignItems:'center',
          justifyContent:'space-between', gap:'1.5rem',
        }}>
          <div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, color:'#fff', margin:0 }}>
              Ready for a Showroom Finish?
            </h3>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, marginTop:6 }}>
              Find verified wash centers near you and book a slot in 60 seconds.
            </p>
          </div>
          <button onClick={() => navigate('/vendors')}
            style={{
              padding:'14px 32px', background:'#fff', color:'#E24B4A',
              border:'none', borderRadius:10, fontSize:14, fontWeight:800,
              cursor:'pointer', flexShrink:0, transition:'transform 0.15s',
            }}
            onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
            Find a Wash Center →
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{
        maxWidth:1200, margin:'0 auto',
        padding:'4rem 2rem 3rem',
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
        gap:'3rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1rem' }}>
            <div style={{
              width:34, height:34, borderRadius:8,
              background:'linear-gradient(135deg,#E24B4A,#ff6b6b)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:17,
            }}>🚗</div>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:'1rem' }}>
              CarWash<span style={{color:'#E24B4A'}}> Connect</span>
            </span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, lineHeight:1.8 }}>
            India's first marketplace for car wash and auto detailing. Book trusted centers near you — instantly.
          </p>
          <div style={{ display:'flex', gap:8, marginTop:'1.25rem' }}>
            {[
              { emoji:'📸', href:'https://instagram.com', label:'Instagram' },
              { emoji:'💼', href:'https://linkedin.com',  label:'LinkedIn'  },
              { emoji:'🐦', href:'#',                    label:'Twitter'   },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{
                  width:36, height:36, borderRadius:8, fontSize:15,
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  textDecoration:'none', transition:'all 0.2s',
                }}
                onMouseOver={e=>{e.currentTarget.style.background='rgba(226,75,74,0.15)';e.currentTarget.style.borderColor='rgba(226,75,74,0.3)'}}
                onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}}>
                {s.emoji}
              </a>
            ))}
          </div>
        </div>

        {/* For Customers */}
        <div>
          <h4 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:12, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.9)', marginBottom:'1.1rem' }}>
            For Customers
          </h4>
          {[['/', 'Home'],  ['/vendors','Find Wash Centers'], ['/login','Sign In'], ['/register','Create Account'], ['/bookings','My Bookings']].map(([to,label]) => (
            <div key={to} style={{ marginBottom:10 }}>
              <Link to={to} style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
                {label}
              </Link>
            </div>
          ))}
        </div>

        {/* For Vendors */}
        <div>
          <h4 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:12, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.9)', marginBottom:'1.1rem' }}>
            For Vendors
          </h4>
          {['/register','List Your Center', '/register','Manage Bookings', '/register','Analytics Dashboard', '/register','Set Pricing'].map((v,i,arr) =>
            i%2===0 ? (
              <div key={v} style={{ marginBottom:10 }}>
                <Link to={v} style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', transition:'color 0.2s' }}
                  onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
                  {arr[i+1]}
                </Link>
              </div>
            ) : null
          )}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:12, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.9)', marginBottom:'1.1rem' }}>
            Contact
          </h4>
          {[
            { icon:'📞', val:'8123823193',           href:'tel:8123823193' },
            { icon:'✉️', val:'vinayakaj29@gmail.com', href:'mailto:vinayakaj29@gmail.com' },
            { icon:'🕒', val:'Mon–Sat: 9 AM – 6 PM', href:null },
            { icon:'📍', val:'Bangalore, Karnataka',  href:null },
          ].map(item => (
            <div key={item.val} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:12 }}>
              <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>{item.icon}</span>
              {item.href
                ? <a href={item.href} style={{ fontSize:13, color:'rgba(255,255,255,0.6)', textDecoration:'none', transition:'color 0.2s', lineHeight:1.5 }}
                    onMouseOver={e=>e.target.style.color='#E24B4A'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.6)'}>
                    {item.val}
                  </a>
                : <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.5 }}>{item.val}</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop:'1px solid rgba(255,255,255,0.05)',
        padding:'1.5rem 2rem',
        maxWidth:1200, margin:'0 auto',
        display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:'1rem',
      }}>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} CarWash Connect. All rights reserved.
        </p>
        <div style={{ display:'flex', gap:20 }}>
          {['Privacy Policy','Terms of Service','Refund Policy'].map(t => (
            <span key={t} style={{ fontSize:12, color:'rgba(255,255,255,0.2)', cursor:'pointer', transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='rgba(255,255,255,0.5)'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.2)'}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
