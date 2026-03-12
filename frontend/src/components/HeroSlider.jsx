import React, { useState, useEffect } from "react";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Premium Auto Detailing",
      desc: "Showroom finish, every single time.",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    },
    {
      title: "Deep Washing & Cleaning",
      desc: "Meticulous interior and exterior care.",
      img: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9"
    },
    {
      title: "Paint Protection Film",
      desc: "Shield your investment from the elements.",
      img: "https://images.unsplash.com/photo-1493238792000-8113da705763"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        height: "90vh",
        width: "100%",
        position: "relative",
        backgroundImage: `url(${slides[currentSlide].img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85))"
        }}
      />

      <div style={{ textAlign: "center", color: "white", zIndex: 2 }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>
          {slides[currentSlide].title}
        </h1>

        <p style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>
          {slides[currentSlide].desc}
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>

          <button
            onClick={() => scrollTo("booking")}
            style={{
              padding: "12px 25px",
              background: "#d32f2f",
              border: "none",
              color: "white",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Book Now
          </button>

          <button
            onClick={() => scrollTo("services")}
            style={{
              padding: "12px 25px",
              border: "1px solid white",
              background: "transparent",
              color: "white",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Explore Services
          </button>

        </div>
      </div>
    </div>
  );
}