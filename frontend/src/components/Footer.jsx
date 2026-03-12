import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111', color: '#fff', padding: '4rem 2rem', borderTop: '3px solid #d32f2f' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
        
        {/* Brand & Location */}
        <div style={{ flex: '1 1 250px' }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '1rem', marginTop: 0 }}>Premium Auto Detailing</h2>
          <p style={{ color: '#aaa', marginBottom: '0.5rem', fontWeight: 'bold' }}>Virtual Detailing Studio</p>
          <p style={{ color: '#aaa', lineHeight: '1.5' }}>We bring the showroom finish to you. Top-tier car care without the hassle of a waiting room.</p>
        </div>

        {/* Contact Info & Hours */}
        <div style={{ flex: '1 1 250px' }}>
          <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Contact & Hours</h3>
          <p style={{ margin: '0.8rem 0' }}>
            📞 <a href="tel:8123823193" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color='#d32f2f'} onMouseOut={(e) => e.target.style.color='#fff'}>8123823193</a>
          </p>
          <p style={{ margin: '0.8rem 0' }}>
            ✉️ <a href="mailto:vinayakaj29@gmail.com" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color='#d32f2f'} onMouseOut={(e) => e.target.style.color='#fff'}>vinayakaj29@gmail.com</a>
          </p>
          <p style={{ margin: '0.8rem 0', color: '#aaa' }}>
            🕒 Mon-Sat: 9 AM - 6 PM
          </p>
        </div>

        {/* Social Links */}
        <div style={{ flex: '1 1 250px' }}>
          <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Connect With Us</h3>
          <p style={{ margin: '0.8rem 0' }}>
            📸 Instagram:{' '}
            <a href="https://instagram.com/its_vinu29" target="_blank" rel="noreferrer" style={{ color: '#d32f2f', textDecoration: 'none', fontWeight: 'bold' }}>
              @its_vinu29
            </a>
          </p>
          <p style={{ margin: '0.8rem 0' }}>
            💼 LinkedIn:{' '}
            <a href="https://linkedin.com/in/vinayaka-j" target="_blank" rel="noreferrer" style={{ color: '#0077b5', textDecoration: 'none', fontWeight: 'bold' }}>
              VINAYAKA J
            </a>
          </p>
        </div>
        
      </div>
      
      {/* Copyright Bar */}
      <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #333', color: '#666', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Premium Auto Detailing. All Rights Reserved.
      </div>
    </footer>
  );
}