import React from 'react';

export default function ServicesInfo() {
  const services = [
    { title: "Exterior Detailing", detail: "Foam wash, clay bar treatment, and ceramic spray sealant." },
    { title: "Interior Restoration", detail: "Deep stain extraction, leather conditioning, and odor removal." },
    { title: "PPF & Coatings", detail: "Long-lasting ceramic coatings and self-healing PPF installation." }
  ];

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: '#ffffff', textAlign: 'center' }}>
      <h2 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '2rem' }}>Our Premium Services</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {services.map((srv, index) => (
          <div key={index} style={{ flex: '1 1 300px', padding: '2rem', backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#d32f2f' }}>{srv.title}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{srv.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}