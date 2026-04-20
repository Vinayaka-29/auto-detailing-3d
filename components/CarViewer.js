'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D canvas to avoid SSR issues with Three.js
const CarCanvas = dynamic(() => import('./CarCanvas'), { ssr: false });

const FINISHES = ['Showroom Wash', 'Ceramic Coated', 'Paint Corrected', 'Full Detail'];

export default function CarViewer() {
  const [finish, setFinish] = useState('Ceramic Coated');

  return (
    <section style={{
      background: 'radial-gradient(ellipse at center, #1a0a0a 0%, #050505 100%)',
      padding: '5rem 0'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 4vw' }}>
        <div className="section-tag">Interactive 3D Preview</div>
        <h2 className="section-title">EXPLORE THE <span className="accent">FINISH</span></h2>
        <div className="gold-line" style={{ margin: '16px auto' }} />
        <p style={{ color: '#888', fontSize: 14 }}>Drag to rotate · Scroll to zoom · Switch finishes below.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap', padding: '0 1rem' }}>
        {FINISHES.map(f => (
          <button key={f} onClick={() => setFinish(f)} style={{
            padding: '8px 18px', borderRadius: 4,
            background: finish === f ? '#c0392b' : 'transparent',
            border: `1px solid ${finish === f ? '#c0392b' : 'rgba(255,255,255,0.15)'}`,
            color: finish === f ? 'white' : '#888',
            cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 600, letterSpacing: 1, transition: 'all 0.3s'
          }}>{f}</button>
        ))}
      </div>

      <div style={{ height: 500 }}>
        <CarCanvas finish={finish} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: '#444', fontSize: 11, letterSpacing: 2 }}>← DRAG TO ROTATE →</p>
      </div>
    </section>
  );
}
