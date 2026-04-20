'use client';

import { useState, useEffect } from 'react';

export default function FloatingBookBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a href="tel:8123823193" style={{
      position: 'fixed', bottom: 90, left: 24, zIndex: 8998,
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#25D366', color: 'white', padding: '10px 16px',
      borderRadius: 24, textDecoration: 'none', fontSize: 13, fontWeight: 700,
      boxShadow: '0 8px 25px rgba(37,211,102,0.4)', transition: 'all 0.3s',
      animation: 'slideInLeft 0.4s ease'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
      📱 WhatsApp Us
    </a>
  );
}
