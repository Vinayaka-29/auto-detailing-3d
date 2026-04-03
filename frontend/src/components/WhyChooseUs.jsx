import React from "react";

const features = [
  { icon: "🏠", title: "Doorstep Service", desc: "We come to your home, office, or anywhere. No need to wait at a center — we bring the detailing to you." },
  { icon: "🔬", title: "Premium Products", desc: "We use only professional-grade ceramic coatings, pH-neutral shampoos, and certified PPF materials." },
  { icon: "⏱️", title: "On-Time Promise", desc: "We respect your schedule. Every appointment is completed on time or we offer a complimentary next service." },
  { icon: "🛡️", title: "Trained Professionals", desc: "All our technicians are certified detailers with years of hands-on experience on luxury vehicles." },
  { icon: "📸", title: "Before & After Photos", desc: "We document every job with detailed photos so you can see the transformation for yourself." },
  { icon: "🔄", title: "Satisfaction Guarantee", desc: "Not 100% happy? We'll come back and fix it, free of charge. Your satisfaction is our commitment." },
];

export default function WhyChooseUs() {
  return (
    <section style={{ padding: "6rem 4vw", background: "var(--black)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "4rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left - Text */}
          <div style={{ flex: "1 1 350px" }}>
            <div className="section-tag">Why Sparkline</div>
            <h2 className="section-title">THE STANDARD<br /><span className="accent">OTHERS</span> CAN'T MATCH</h2>
            <div className="gold-line" />
            <p style={{ color: "#888", lineHeight: 1.8, marginBottom: 24, fontSize: 15 }}>
              We built Sparkline Auto because we believe your car deserves more than a basic car wash. 
              Every vehicle we touch gets treated like our own — with precision, care, and pride.
            </p>
            <p style={{ color: "#888", lineHeight: 1.8, fontSize: 15 }}>
              From a quick exterior refresh to a full ceramic coating job, we pour the same 
              dedication into every appointment.
            </p>

            <div style={{ marginTop: 36, display: "flex", gap: "2rem" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: "var(--crimson)", letterSpacing: 2 }}>6+</div>
                <div style={{ fontSize: 12, letterSpacing: 2, color: "#666", textTransform: "uppercase" }}>Years in Business</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: "var(--crimson)", letterSpacing: 2 }}>2K+</div>
                <div style={{ fontSize: 12, letterSpacing: 2, color: "#666", textTransform: "uppercase" }}>Cars Detailed</div>
              </div>
            </div>
          </div>

          {/* Right - Features Grid */}
          <div style={{ flex: "1 1 500px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: "1.5rem", background: "var(--dark2)",
                border: "1px solid var(--border)", borderRadius: 8,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(192,57,43,0.4)";
                  e.currentTarget.style.background = "rgba(192,57,43,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--dark2)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: 1, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
