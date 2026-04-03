import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home","explore","services","why","booking","reviews","contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) { setActive(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "explore", label: "Gallery" },
    { id: "why", label: "Why Us" },
    { id: "booking", label: "Book Now" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(5,5,5,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
        padding: "0 2rem",
        height: "70px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => scrollTo("home")}>
         <img src="/logo.svg" alt="Sparkline Auto" style={{
  width: 44, height: 44, borderRadius: 8,
  boxShadow: "0 0 20px rgba(192,57,43,0.4)"
}} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 3, lineHeight: 1 }}>SPARKLINE</div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "#888", textTransform: "uppercase", lineHeight: 1 }}>AUTO DETAILING</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="desktop-nav">
          {navLinks.map(link => (
            <span key={link.id} onClick={() => scrollTo(link.id)} style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer", color: active === link.id ? "var(--crimson)" : "#ccc",
              transition: "color 0.3s",
              borderBottom: active === link.id ? "1px solid var(--crimson)" : "1px solid transparent",
              paddingBottom: 2,
            }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = active === link.id ? "var(--crimson)" : "#ccc"}
            >{link.label}</span>
          ))}
          <a href="tel:8123823193" style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--crimson)", color: "white", padding: "8px 18px",
            borderRadius: 4, fontSize: 12, fontWeight: 700, letterSpacing: 1,
            textDecoration: "none", transition: "all 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--crimson-light)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--crimson)"}
          >
            📞 CALL NOW
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer",
          display: "none"
        }} className="hamburger">☰</button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 70, left: 0, right: 0, zIndex: 999,
          background: "rgba(5,5,5,0.98)", backdropFilter: "blur(20px)",
          padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.2rem",
          borderBottom: "1px solid var(--border)"
        }}>
          {navLinks.map(link => (
            <span key={link.id} onClick={() => scrollTo(link.id)} style={{
              fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer", color: active === link.id ? "var(--crimson)" : "#ccc",
              padding: "8px 0", borderBottom: "1px solid var(--border)"
            }}>{link.label}</span>
          ))}
          <a href="tel:8123823193" style={{
            textAlign: "center", background: "var(--crimson)", color: "white",
            padding: "12px", borderRadius: 4, fontWeight: 700, letterSpacing: 2,
            textDecoration: "none", fontSize: 13
          }}>📞 CALL NOW</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}
