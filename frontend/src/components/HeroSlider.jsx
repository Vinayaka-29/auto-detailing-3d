import React, { useState, useEffect } from 'react';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: "Premium Auto Detailing", desc: "Showroom finish, every single time.", bg: "#1a1a24" },
    { title: "Deep Washing & Cleaning", desc: "Meticulous interior and exterior care.", bg: "#1e272e" },
    { title: "Paint Protection Film (PPF)", desc: "Shield your investment from the elements.", bg: "#2f3542" }
  ];

  // Auto-play the slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ height: '70vh', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: slides[currentSlide].bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.8s ease' }}>
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>{slides[currentSlide].title}</h1>
        <p style={{ fontSize: '1.5rem', margin: 0 }}>{slides[currentSlide].desc}</p>
      </div>
      
      {/* Slide Indicators */}
      <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '10px' }}>
        {slides.map((_, index) => (
          <div key={index} style={{ height: '12px', width: '12px', borderRadius: '50%', backgroundColor: currentSlide === index ? '#d32f2f' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => setCurrentSlide(index)} />
        ))}
      </div>
    </div>
  );
}