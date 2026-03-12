import React from 'react';

export default function Reviews() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>What Our Clients Say</h2>
      
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <p style={{ fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>"Absolutely incredible work. My 5-year-old car looks like it just rolled off the showroom floor!"</p>
        <strong style={{ color: '#d32f2f' }}>★★★★★ - Rahul S.</strong>
      </div>
      
      <div>
        <p style={{ fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>"The PPF installation was flawless. Great attention to detail and excellent customer service."</p>
        <strong style={{ color: '#d32f2f' }}>★★★★★ - Priya M.</strong>
      </div>
    </div>
  );
}