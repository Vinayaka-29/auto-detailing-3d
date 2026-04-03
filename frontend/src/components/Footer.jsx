import React from "react";

export default function Footer() {
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };

  return (
    <footer style={{ backgroundColor:"#060606", color:"#fff", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      {/* CTA Banner */}
      <div style={{ background:"var(--crimson-dark)", padding:"3rem 4vw", textAlign:"center", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2rem,4vw,3.5rem)", letterSpacing:3, marginBottom:8 }}>READY FOR A TRANSFORMATION?</div>
        <p style={{ color:"rgba(255,255,255,0.7)", marginBottom:24, fontSize:15 }}>Book your appointment today and experience the Sparkline difference.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={()=>scrollTo("booking")} className="btn-primary"><span>Book Now</span><span>→</span></button>
          <a href="tel:8123823193" className="btn-outline">📞 Call Now</a>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"4rem 4vw", display:"flex", flexWrap:"wrap", gap:"3rem", justifyContent:"space-between" }}>
        {/* Brand */}
        <div style={{ flex:"1 1 250px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:40, background:"var(--crimson)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:16, letterSpacing:1 }}>SL</div>
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:20, letterSpacing:3 }}>SPARKLINE</div>
              <div style={{ fontSize:9, letterSpacing:4, color:"#555", textTransform:"uppercase" }}>AUTO DETAILING</div>
            </div>
          </div>
          <p style={{ color:"#555", lineHeight:1.8, fontSize:14, marginBottom:20 }}>Professional auto detailing at your doorstep or our center. Premium products, trained specialists, guaranteed results.</p>
          <div style={{ display:"flex", gap:12 }}>
            {[
              { href:"https://instagram.com/its_vinu29", label:"IG", color:"#E4405F" },
              { href:"https://linkedin.com/in/vinayaka-j", label:"IN", color:"#0077b5" },
              { href:"https://wa.me/918123823193", label:"WA", color:"#25D366" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
                width:36, height:36, borderRadius:"50%", border:"1px solid #222",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color:"#888", textDecoration:"none", transition:"all 0.3s",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=s.color; e.currentTarget.style.color=s.color; e.currentTarget.style.background=`${s.color}15`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="#222"; e.currentTarget.style.color="#888"; e.currentTarget.style.background="transparent"; }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{ flex:"1 1 180px" }}>
          <h4 style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#555", marginBottom:16 }}>Services</h4>
          {["Exterior Wash & Dry","Interior Detailing","Ceramic Coating","Paint Protection Film","Paint Correction","Full Detailing Package"].map((s, i) => (
            <div key={i} onClick={()=>scrollTo("services")} style={{ fontSize:13, color:"#777", margin:"8px 0", cursor:"pointer", transition:"color 0.3s" }}
              onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="#777"}>{s}</div>
          ))}
        </div>

        {/* Quick Links */}
        <div style={{ flex:"1 1 150px" }}>
          <h4 style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#555", marginBottom:16 }}>Quick Links</h4>
          {[["home","Home"],["services","Services"],["why","Why Us"],["booking","Book Now"],["reviews","Reviews"],["contact","Contact"]].map(([id, label], i) => (
            <div key={i} onClick={()=>scrollTo(id)} style={{ fontSize:13, color:"#777", margin:"8px 0", cursor:"pointer", transition:"color 0.3s" }}
              onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="#777"}>{label}</div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ flex:"1 1 220px" }}>
          <h4 style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#555", marginBottom:16 }}>Contact</h4>
          {[
            { icon:"📞", text:"8123823193", href:"tel:8123823193" },
            { icon:"✉️", text:"vinayakaj29@gmail.com", href:"mailto:vinayakaj29@gmail.com" },
            { icon:"🕒", text:"Mon–Sat: 9 AM – 6 PM", href:null },
            { icon:"📍", text:"Bengaluru, Karnataka", href:null },
          ].map((item, i) => (
            item.href ? (
              <a key={i} href={item.href} style={{ display:"flex", gap:8, fontSize:13, color:"#777", margin:"10px 0", textDecoration:"none", transition:"color 0.3s", alignItems:"flex-start" }}
                onMouseEnter={e=>{ e.currentTarget.style.color="white"; }} onMouseLeave={e=>{ e.currentTarget.style.color="#777"; }}>
                <span style={{ flexShrink:0 }}>{item.icon}</span>{item.text}
              </a>
            ) : (
              <div key={i} style={{ display:"flex", gap:8, fontSize:13, color:"#666", margin:"10px 0", alignItems:"flex-start" }}>
                <span style={{ flexShrink:0 }}>{item.icon}</span>{item.text}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"1.25rem 4vw", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, alignItems:"center" }}>
        <div style={{ fontSize:12, color:"#444" }}>© {new Date().getFullYear()} Sparkline Auto Detailing. All rights reserved.</div>
        <div style={{ fontSize:12, color:"#444" }}>Built with ❤️ by <span style={{ color:"var(--crimson)" }}>VINAYAKA J</span></div>
      </div>
    </footer>
  );
}
