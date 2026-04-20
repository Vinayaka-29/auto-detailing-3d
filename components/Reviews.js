'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const defaultReviews = [
  { name:'Rahul S.', rating:5, service:'Ceramic Coating', carModel:'BMW 3 Series', message:'Absolutely incredible work. My 5-year-old car looks like it just rolled off the showroom floor! The ceramic coating is flawless and the team was professional throughout.', createdAt: new Date('2024-10-15') },
  { name:'Priya M.', rating:5, service:'Paint Protection Film', carModel:'Mercedes GLA', message:'The PPF installation was flawless. Great attention to detail and excellent customer service. They even came to my home — total convenience!', createdAt: new Date('2024-11-02') },
  { name:'Arjun K.', rating:5, service:'Full Detailing Package', carModel:'Honda City', message:'I was skeptical at first, but wow. Every inch of my car is spotless. Interior smells amazing. Worth every rupee. Will definitely book again.', createdAt: new Date('2024-12-10') },
  { name:'Sneha R.', rating:5, service:'Interior Detailing', carModel:'Hyundai Creta', message:'The doorstep service is a game changer. They showed up on time, were super professional, and my car interior looks brand new. Highly recommended!', createdAt: new Date('2025-01-05') },
  { name:'Vikram T.', rating:5, service:'Paint Correction', carModel:'Tata Nexon', message:"The paint correction on my Nexon was phenomenal. Swirl marks are completely gone. The team clearly knows what they're doing. 10/10 experience.", createdAt: new Date('2025-01-20') },
  { name:'Meera P.', rating:4, service:'Exterior Wash & Dry', carModel:'Maruti Baleno', message:'Great wash, very thorough. They missed a small spot near the door jamb but fixed it immediately when I pointed it out. Overall very happy!', createdAt: new Date('2025-02-08') },
];

function StarRating({ rating, size = 16 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= rating ? '#f0b429' : '#333' }}>★</span>
      ))}
    </div>
  );
}

function ReviewForm({ onSubmit }) {
  const [form, setForm] = useState({ name:'', rating:5, service:'', carModel:'', message:'' });
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const services = ['Exterior Wash & Dry','Interior Detailing','Ceramic Coating','Paint Protection Film','Paint Correction','Full Detailing Package'];

  const handleSubmit = async () => {
    if (!form.name || !form.message) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/reviews`, form);
      onSubmit();
    } catch(e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const inputStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'white', padding:'10px 14px', borderRadius:6, width:'100%', fontSize:13, fontFamily:'var(--font-body)', outline:'none' };

  return (
    <div style={{ background:'var(--dark)', border:'1px solid var(--border)', borderRadius:10, padding:'1.5rem', marginTop:'2rem' }}>
      <h3 style={{ fontFamily:'var(--font-display)', letterSpacing:2, marginBottom:16, fontSize:'1.2rem' }}>SHARE YOUR EXPERIENCE</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <input style={inputStyle} placeholder="Your Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <select style={inputStyle} value={form.service} onChange={e=>setForm(f=>({...f,service:e.target.value}))}>
            <option value="">Select Service</option>
            {services.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <input style={inputStyle} placeholder="Your Car Model (e.g. Honda City)" value={form.carModel} onChange={e=>setForm(f=>({...f,carModel:e.target.value}))} />
        <div>
          <div style={{ fontSize:12, color:'#666', marginBottom:6 }}>Your Rating *</div>
          <div style={{ display:'flex', gap:4 }}>
            {[1,2,3,4,5].map(i=>(
              <span key={i} onMouseEnter={()=>setHoverStar(i)} onMouseLeave={()=>setHoverStar(0)}
                onClick={()=>setForm(f=>({...f,rating:i}))}
                style={{ fontSize:28, cursor:'pointer', color: i<=(hoverStar||form.rating) ? '#f0b429' : '#333', transition:'color 0.15s' }}>★</span>
            ))}
          </div>
        </div>
        <textarea style={{ ...inputStyle, minHeight:80, resize:'vertical' }} placeholder="Tell us about your experience... *" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} />
        <button onClick={handleSubmit} disabled={submitting||!form.name||!form.message} style={{
          padding:'11px', background:'var(--crimson)', border:'none', color:'white', borderRadius:6,
          cursor:submitting?'not-allowed':'pointer', fontFamily:'var(--font-body)', fontSize:13, fontWeight:700, letterSpacing:1
        }}>{submitting?'Submitting...':'Submit Review'}</button>
        <p style={{ fontSize:11, color:'#555', textAlign:'center' }}>Reviews appear after a quick approval check.</p>
      </div>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(defaultReviews);
  const [avgRating, setAvgRating] = useState('4.9');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/reviews`)
      .then(r => { if (r.data.success && r.data.reviews.length) { setReviews(r.data.reviews); setAvgRating(r.data.avgRating); } })
      .catch(()=>{});
  }, []);

  const handleSubmitted = () => { setSubmitted(true); setShowForm(false); };

  return (
    <section style={{ padding:'6rem 4vw', background:'var(--black)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:'3rem' }}>
          <div>
            <div className="section-tag">Client Reviews</div>
            <h2 className="section-title">WHAT CLIENTS<br /><span className="accent">SAY</span></h2>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'4rem', color:'white', lineHeight:1 }}>{avgRating}</div>
            <StarRating rating={Math.round(parseFloat(avgRating))} size={20} />
            <div style={{ fontSize:12, color:'#666', marginTop:4, letterSpacing:1 }}>{reviews.length} REVIEWS</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:'1.25rem', marginBottom:'2rem' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background:'var(--dark2)', border:'1px solid var(--border)', borderRadius:10, padding:'1.5rem', transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(192,57,43,0.3)'; e.currentTarget.style.transform='translateY(-4px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; }}>

              <StarRating rating={r.rating} />
              <p style={{ color:'#ccc', fontSize:14, lineHeight:1.7, margin:'12px 0', fontStyle:'italic' }}>
                &ldquo;{r.message}&rdquo;
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:12, borderTop:'1px solid var(--border)' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--crimson)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{r.name}</div>
                  <div style={{ fontSize:11, color:'#666' }}>{r.service}{r.carModel ? ` · ${r.carModel}` : ''}</div>
                </div>
                <div style={{ marginLeft:'auto', fontSize:11, color:'#555' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { month:'short', year:'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review */}
        {submitted ? (
          <div style={{ textAlign:'center', padding:'2rem', background:'rgba(46,160,67,0.1)', border:'1px solid rgba(46,160,67,0.3)', borderRadius:10 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🙏</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', letterSpacing:2 }}>THANK YOU!</div>
            <div style={{ color:'#888', fontSize:14, marginTop:4 }}>Your review will appear after approval.</div>
          </div>
        ) : (
          <>
            <div style={{ textAlign:'center', marginTop:8 }}>
              <button onClick={()=>setShowForm(f=>!f)} style={{
                padding:'12px 28px', background:'transparent', border:'1px solid var(--border)',
                color:'white', borderRadius:6, cursor:'pointer', fontFamily:'var(--font-body)',
                fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', transition:'all 0.3s'
              }} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--crimson)'; e.currentTarget.style.color='var(--crimson)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='white';}}>
                {showForm ? '✕ Cancel' : '✍️ Write a Review'}
              </button>
            </div>
            {showForm && <ReviewForm onSubmit={handleSubmitted} />}
          </>
        )}
      </div>
    </section>
  );
}
