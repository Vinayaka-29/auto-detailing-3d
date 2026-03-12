import React, { useState } from 'react';
import axios from 'axios';

export default function BookingForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Ceramic Coating', date: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await axios.post('http://localhost:5000/api/book', formData);
      setStatus('Booking Confirmed! We will contact you soon.');
      setFormData({ name: '', phone: '', service: 'Ceramic Coating', date: '' });
    } catch (error) {
      setStatus('Error submitting booking. Make sure backend is running!');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="text" placeholder="Full Name" required style={{ padding: '0.8rem' }}
        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        
      <input type="tel" placeholder="Phone Number" required style={{ padding: '0.8rem' }}
        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        
      <select style={{ padding: '0.8rem' }} value={formData.service} 
        onChange={(e) => setFormData({...formData, service: e.target.value})}>
        <option>Ceramic Coating</option>
        <option>Paint Correction</option>
        <option>Full Interior Detail</option>
      </select>
      
      <input type="date" required style={{ padding: '0.8rem' }}
        value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
        
      <button type="submit" style={{ padding: '1rem', backgroundColor: '#d32f2f', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
        Confirm Booking
      </button>
      
      {status && <p style={{ color: status.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{status}</p>}
    </form>
  );
}