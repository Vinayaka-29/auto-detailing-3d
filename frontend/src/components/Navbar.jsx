import React from "react";

export default function Navbar() {
  const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        zIndex: 1000,
        color: "white",
      }}
    >
      <h3 style={{ margin: 0 }}>Auto Detailing</h3>

      <div style={{ display: "flex", gap: "1.5rem", cursor: "pointer" }}>
        <span onClick={() => scrollTo("home")}>Home</span>
        <span onClick={() => scrollTo("services")}>Services</span>
        <span onClick={() => scrollTo("booking")}>Booking</span>
        <span onClick={() => scrollTo("reviews")}>Reviews</span>
        <span onClick={() => scrollTo("contact")}>Contact</span>
      </div>
    </nav>
  );
}