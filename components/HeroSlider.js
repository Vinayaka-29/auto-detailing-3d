'use client';

import { useState, useEffect } from 'react';

const slides = [
  {
    title: 'PRECISION\nAUTO DETAILING',
    subtitle: 'Showroom finish — at your doorstep or our center.',
    tag: 'Premium Doorstep Service',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85',
    cta: 'Book Now',
    ctaId: 'booking'
  },
  {
    title: 'CERAMIC\nCOATING',
    subtitle: '9H nano-ceramic armor. Unmatched gloss. Years of protection.',
    tag: 'Industry Leading Protection',
    img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=85',
    cta: 'See Services',
    ctaId: 'services'
  },
  {
    title: 'DEEP\nINTERIOR CARE',
    subtitle: 'From leather restoration to odor elimination — we transform your cabin.',
    tag: 'Complete Interior Detailing',
    img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1600&q=85',
    cta: 'Book Now',
    ctaId: 'booking'
  },
  {
    title: 'PAINT\nPROTECTION',
    subtitle: 'Self-healing PPF shields your investment from the elements.',
    tag: 'Paint Protection Film',
    img: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&q=85',
    cta: 'Explore Services',
    ctaId: 'services'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % slides.length);
        setTransitioning(false);
      }, 600);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => {
    setTransitioning(true);
    setTimeout(() => { setCurrent(i); setTransitioning(false); }, 400);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const slide = slides[current];

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${slide.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transform: transitioning ? 'scale(1.05)' : 'scale(1)',
        opacity: transitioning ? 0 : 1,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />

      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

      {/* Red accent line */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(to bottom, transparent, var(--crimson), transparent)' }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 6vw', paddingTop: '70px',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateX(-30px)' : 'translateX(0)',
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 24,
          background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)',
          padding: '6px 14px', borderRadius: 2, width: 'fit-content'
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--crimson)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--crimson)' }}>{slide.tag}</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 8vw, 7rem)',
          lineHeight: 0.95, letterSpacing: 3,
          textTransform: 'uppercase',
          whiteSpace: 'pre-line',
          color: 'white',
          textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          marginBottom: 24,
        }}>
          {slide.title.split('\n').map((line, i) => (
            <div key={i}>{i === 0 ? line : <span style={{ color: 'var(--crimson)' }}>{line}</span>}</div>
          ))}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.75)', maxWidth: 520, lineHeight: 1.6, marginBottom: 40, fontWeight: 300 }}>
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => scrollTo(slide.ctaId)} className="btn-primary">
            <span>{slide.cta}</span>
            <span>→</span>
          </button>
          <button onClick={() => scrollTo('contact')} className="btn-outline">
            📞 Call Us
          </button>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap' }}>
          {['🏆 500+ Happy Clients', '⭐ 4.9 Star Rating', '🚗 Doorstep Service'].map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{ position: 'absolute', bottom: 40, left: '6vw', display: 'flex', gap: 8, alignItems: 'center' }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 32 : 8, height: 4, borderRadius: 2,
            background: i === current ? 'var(--crimson)' : 'rgba(255,255,255,0.3)',
            border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0,
          }} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 40, right: '6vw', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
      </div>
    </div>
  );
}
