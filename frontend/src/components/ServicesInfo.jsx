import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const defaultServices = [
  { name:"Exterior Wash & Dry", description:"Complete foam wash, rinse, and hand dry for a spotless finish.", price:{basic:499,standard:799,premium:1199}, duration:"1–2 hrs", category:"Wash", popular:false, img:"https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=80" },
  { name:"Interior Detailing", description:"Deep vacuum, dashboard cleaning, leather conditioning and odor removal.", price:{basic:799,standard:1299,premium:1999}, duration:"2–3 hrs", category:"Interior", popular:true, img:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80" },
  { name:"Ceramic Coating", description:"9H nano-ceramic coating for long-lasting gloss and paint protection.", price:{basic:9999,standard:14999,premium:24999}, duration:"1–2 days", category:"Protection", popular:true, img:"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80" },
  { name:"Paint Protection Film", description:"Self-healing TPU film that shields your paint from scratches and chips.", price:{basic:14999,standard:24999,premium:49999}, duration:"2–3 days", category:"Protection", popular:false, img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
  { name:"Paint Correction", description:"Multi-stage machine polishing to remove swirl marks, scratches, and oxidation.", price:{basic:4999,standard:8999,premium:14999}, duration:"4–8 hrs", category:"Paint", popular:true, img:"https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80" },
  { name:"Full Detailing Package", description:"Complete interior + exterior + engine bay — the ultimate treatment.", price:{basic:2999,standard:4999,premium:7999}, duration:"4–6 hrs", category:"Package", popular:true, img:"https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80" },
];

const categories = ["All","Wash","Interior","Protection","Paint","Package"];

export default function ServicesInfo() {
  const [services, setServices] = useState(defaultServices);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tier, setTier] = useState("standard");

  useEffect(() => {
    axios.get(`${API}/api/services`).then(r => { if (r.data.success && r.data.services.length) setServices(r.data.services); }).catch(() => {});
  }, []);

  const filtered = activeCategory === "All" ? services : services.filter(s => s.category === activeCategory);

  const scrollToBooking = (serviceName) => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    window.__preselectedService = serviceName;
  };

  return (
    <section style={{ padding: "6rem 4vw", background: "var(--dark)", color: "white" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="section-tag">What We Offer</div>
        <h2 className="section-title">OUR <span className="accent">SERVICES</span></h2>
        <div className="gold-line" style={{ margin: "20px auto" }} />
        <p style={{ color: "#888", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Professional auto detailing with premium-grade products and trained specialists — whether you come to us or we come to you.
        </p>
      </div>

      {/* Tier Toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: "2.5rem" }}>
        {["basic","standard","premium"].map(t => (
          <button key={t} onClick={() => setTier(t)} style={{
            padding: "8px 20px", borderRadius: 4,
            background: tier === t ? "var(--crimson)" : "transparent",
            border: `1px solid ${tier === t ? "var(--crimson)" : "var(--border)"}`,
            color: tier === t ? "white" : "#888",
            cursor: "pointer", fontFamily: "var(--font-body)",
            fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            transition: "all 0.3s"
          }}>{t}</button>
        ))}
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: "3rem", flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "6px 16px", borderRadius: 20,
            background: activeCategory === cat ? "white" : "transparent",
            border: "1px solid var(--border)",
            color: activeCategory === cat ? "black" : "#888",
            cursor: "pointer", fontFamily: "var(--font-body)",
            fontSize: 12, fontWeight: 600, letterSpacing: 1,
            transition: "all 0.3s"
          }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        {filtered.map((service, i) => (
          <div key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: "relative", borderRadius: 8, overflow: "hidden",
              border: `1px solid ${hoveredIndex === i ? "rgba(192,57,43,0.5)" : "var(--border)"}`,
              background: "var(--dark2)",
              transition: "all 0.4s ease",
              transform: hoveredIndex === i ? "translateY(-6px)" : "none",
              boxShadow: hoveredIndex === i ? "0 20px 50px rgba(0,0,0,0.5)" : "none",
              cursor: "pointer"
            }}>

            {/* Image */}
            <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
              <img src={service.img || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80`}
                alt={service.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: hoveredIndex === i ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s ease" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }} />
              {service.popular && (
                <div style={{ position: "absolute", top: 12, right: 12, background: "var(--crimson)", color: "white", fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: "4px 10px", borderRadius: 2, textTransform: "uppercase" }}>Popular</div>
              )}
              <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 2 }}>
                <span style={{ fontSize: 11, color: "#aaa", letterSpacing: 1 }}>⏱ {service.duration}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--crimson)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{service.category}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: 1, marginBottom: 8 }}>{service.name}</h3>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 16 }}>{service.description}</p>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Starting from</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "white", letterSpacing: 1, lineHeight: 1 }}>
                    ₹{service.price?.[tier]?.toLocaleString('en-IN') || 'N/A'}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  {["basic","standard","premium"].filter(t => t !== tier).map(t => (
                    <div key={t} style={{ fontSize: 11, color: "#555" }}>{t}: ₹{service.price?.[t]?.toLocaleString('en-IN')}</div>
                  ))}
                </div>
              </div>

              <button onClick={() => scrollToBooking(service.name)} style={{
                width: "100%", padding: "10px", background: hoveredIndex === i ? "var(--crimson)" : "transparent",
                border: `1px solid ${hoveredIndex === i ? "var(--crimson)" : "var(--border)"}`,
                color: "white", borderRadius: 4, fontSize: 12, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
                fontFamily: "var(--font-body)"
              }}>Book This Service →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
