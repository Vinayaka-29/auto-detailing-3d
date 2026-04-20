'use client';

import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactSection() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState({ type:'', message:'' });
  const [loading, setLoading] = useState(false);

  const upd = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus({ type:'error', message:'Please fill all required fields.' }); return;
    }
    setLoading(true);
    try {
      const r = await axios.post(`${API}/api/contact`, form);
      setStatus({ type:'success', message: r.data.message });
      setForm({ name:'', email:'', phone:'', message:'' });
    } catch(e) {
      setStatus({ type:'error', message: 'Failed to send. Please call us directly.' });
    } finally { setLoading(false); }
  };

  const inputStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'white', padding:'12px 16px', borderRadius:6, width:'100%', fontSize:14, fontFamily:'var(--font-body)', outline:'none', transition:'border 0.3s' };

  const contactItems = [
    { icon:'📞', label:'Call Us', value:'8123823193', link:'tel:8123823193', sub:'Mon–Sat · 9 AM – 6 PM' },
    { icon:'✉️', label:'Email', value:'vinayakaj29@gmail.com', link:'mailto:vinayakaj29@gmail.com', sub:'We reply within 24 hours' },
    { icon:'📸', label:'Instagram', value:'@its_vinu29', link:'https://instagram.com/its_vinu29', sub:'See our work' },
    { icon:'💼', label:'LinkedIn', value:'VINAYAKA J', link:'https://linkedin.com/in/vinayaka-j', sub:'Connect professionally' },
  ];

  return (
    <section style={{ padding:'6rem 4vw', background:'var(--dark2)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div className="section-tag">Get In Touch</div>
          <h2 className="section-title">CONTACT <span className="accent">US</span></h2>
          <div className="gold-line" style={{ margin:'20px auto' }} />
          <p style={{ color:'#888', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>Have a question? Want a quote? We&apos;re here to help — reach out any way you prefer.</p>
        </div>

        <div style={{ display:'flex', gap:'4rem', flexWrap:'wrap' }}>
          {/* Left — Contact Info */}
          <div style={{ flex:'1 1 300px', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {contactItems.map((item, i) => (
              <a key={i} href={item.link} target={item.link.startsWith('http')?'_blank':'_self'} rel="noreferrer"
                style={{ display:'flex', gap:16, alignItems:'flex-start', padding:'1.25rem', background:'var(--dark)', border:'1px solid var(--border)', borderRadius:8, textDecoration:'none', color:'white', transition:'all 0.3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(192,57,43,0.4)'; e.currentTarget.style.transform='translateX(6px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; }}>
                <div style={{ fontSize:24, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:'#666', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:'white' }}>{item.value}</div>
                  <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{item.sub}</div>
                </div>
                <div style={{ marginLeft:'auto', color:'#444', fontSize:18 }}>→</div>
              </a>
            ))}

            {/* Hours */}
            <div style={{ padding:'1.25rem', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:8 }}>
              <div style={{ fontSize:11, color:'var(--crimson)', fontWeight:700, letterSpacing:2, marginBottom:10 }}>WORKING HOURS</div>
              {[['Monday – Saturday','9:00 AM – 6:00 PM'],['Sunday','By Appointment Only']].map(([day,hrs],i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0', borderBottom:i===0?'1px solid rgba(255,255,255,0.06)':'none' }}>
                  <span style={{ color:'#aaa' }}>{day}</span>
                  <span style={{ color:'white', fontWeight:600 }}>{hrs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ flex:'1 1 400px', background:'var(--dark)', border:'1px solid var(--border)', borderRadius:12, padding:'2rem' }}>
            <h3 style={{ fontFamily:'var(--font-display)', letterSpacing:2, marginBottom:20, fontSize:'1.3rem' }}>SEND A MESSAGE</h3>

            {status.message && (
              <div style={{ padding:'12px 16px', borderRadius:6, marginBottom:16, fontSize:13, background:status.type==='error'?'rgba(231,76,60,0.15)':'rgba(46,160,67,0.15)', border:`1px solid ${status.type==='error'?'rgba(231,76,60,0.4)':'rgba(46,160,67,0.4)'}`, color:status.type==='error'?'#e74c3c':'#2ea043' }}>
                {status.message}
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label>Full Name *</label>
                  <input style={inputStyle} placeholder="John Doe" value={form.name} onChange={e=>upd('name',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--crimson)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                </div>
                <div>
                  <label>Phone</label>
                  <input style={inputStyle} placeholder="98XXXXXXXX" type="tel" value={form.phone} onChange={e=>upd('phone',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--crimson)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                </div>
              </div>
              <div>
                <label>Email *</label>
                <input style={inputStyle} placeholder="you@email.com" type="email" value={form.email} onChange={e=>upd('email',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--crimson)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              </div>
              <div>
                <label>Message *</label>
                <textarea style={{ ...inputStyle, minHeight:120, resize:'vertical' }} placeholder="Ask about pricing, availability, or any service..." value={form.message} onChange={e=>upd('message',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--crimson)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{
                padding:'13px', background:loading?'#333':'var(--crimson)', border:'none',
                color:'white', borderRadius:6, cursor:loading?'not-allowed':'pointer',
                fontFamily:'var(--font-body)', fontSize:14, fontWeight:700, letterSpacing:1
              }}>{loading ? 'Sending...' : 'Send Message →'}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
