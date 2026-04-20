'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const services = [
  'Exterior Wash & Dry', 'Interior Detailing', 'Ceramic Coating',
  'Paint Protection Film', 'Paint Correction', 'Full Detailing Package'
];

const steps = ['Details', 'Service', 'Schedule', 'Confirm'];

export default function BookingSection() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [bookingId, setBookingId] = useState('');

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: 'Full Detailing Package',
    packageTier: 'standard', carModel: '',
    date: '', timeSlot: '', location: 'center', address: '', notes: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__preselectedService) {
      setForm(f => ({ ...f, service: window.__preselectedService }));
      window.__preselectedService = null;
    }
  }, []);

  useEffect(() => {
    if (form.date) {
      axios.get(`${API}/api/slots?date=${form.date}`)
        .then(r => { if (r.data.success) setSlots(r.data.slots); })
        .catch(() => {
          setSlots(['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(s => ({ slot: s, available: true })));
        });
    }
  }, [form.date]);

  const upd = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const nextStep = () => {
    if (step === 0 && (!form.name || !form.phone || !form.email)) {
      setStatus({ type: 'error', message: 'Please fill all required fields.' }); return;
    }
    if (step === 2 && (!form.date || !form.timeSlot)) {
      setStatus({ type: 'error', message: 'Please select a date and time slot.' }); return;
    }
    if (step === 1 && form.location === 'doorstep' && !form.address) {
      setStatus({ type: 'error', message: 'Please enter your address for doorstep service.' }); return;
    }
    setStatus({ type: '', message: '' });
    setStep(s => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await axios.post(`${API}/api/book`, form);
      setBookingId(res.data.bookingId);
      setStatus({ type: 'success', message: `Booking confirmed! ID: ${res.data.bookingId}` });
      setStep(4);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to book. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(0); setBookingId('');
    setForm({ name:'',phone:'',email:'',service:'Full Detailing Package',packageTier:'standard',carModel:'',date:'',timeSlot:'',location:'center',address:'',notes:'' });
    setStatus({ type:'',message:'' });
  };

  const today = new Date().toISOString().split('T')[0];

  const inputStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'white', padding:'12px 16px', borderRadius:6, width:'100%', fontSize:14, fontFamily:'var(--font-body)', outline:'none', transition:'border 0.3s' };

  return (
    <section style={{ padding: '6rem 4vw', background: 'var(--dark2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Left — Info */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="section-tag">Book Appointment</div>
          <h2 className="section-title">RESERVE YOUR<br /><span className="accent">SPOT</span></h2>
          <div className="gold-line" />
          <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>
            Choose your service, pick a time, and we&apos;ll take care of the rest. Our team will confirm within 24 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📍', title: 'Doorstep Available', desc: 'We come to your location' },
              { icon: '✅', title: 'Instant Confirmation', desc: 'Email confirmation sent immediately' },
              { icon: '🔒', title: 'Free Rescheduling', desc: 'Cancel or reschedule 24hrs prior' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: 13 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: '1.5rem', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--crimson)', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>TRACK YOUR BOOKING</div>
            <div style={{ fontSize: 13, color: '#888' }}>Call us at <a href="tel:8123823193" style={{ color: 'white', textDecoration: 'none' }}>8123823193</a> or email <a href="mailto:vinayakaj29@gmail.com" style={{ color: 'white', textDecoration: 'none' }}>vinayakaj29@gmail.com</a></div>
          </div>
        </div>

        {/* Right — Form */}
        <div style={{ flex: '1 1 480px' }}>
          {step === 4 ? (
            <div style={{ padding: '3rem', background: 'var(--dark)', border: '1px solid rgba(46,160,67,0.4)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: 2, marginBottom: 8 }}>BOOKING CONFIRMED!</div>
              <div style={{ color: '#888', marginBottom: 16 }}>Your booking ID is:</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--crimson)', letterSpacing: 3, marginBottom: 24 }}>{bookingId}</div>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
                A confirmation email has been sent to <strong style={{ color: 'white' }}>{form.email}</strong>.<br />
                Our team will call you 24 hours before your appointment.
              </div>
              <button onClick={resetForm} className="btn-primary"><span>Book Another</span></button>
            </div>
          ) : (
            <div style={{ background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Progress */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                {steps.map((s, i) => (
                  <div key={i} style={{
                    flex: 1, padding: '1rem', textAlign: 'center',
                    background: i === step ? 'rgba(192,57,43,0.12)' : 'transparent',
                    borderBottom: i === step ? '2px solid var(--crimson)' : '2px solid transparent',
                    cursor: i < step ? 'pointer' : 'default', transition: 'all 0.3s'
                  }} onClick={() => i < step && setStep(i)}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: i <= step ? (i === step ? 'var(--crimson)' : 'white') : '#444' }}>{i + 1}</div>
                    <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: i <= step ? (i === step ? 'var(--crimson)' : '#888') : '#333' }}>{s}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '2rem' }}>
                {status.message && (
                  <div style={{ padding: '12px 16px', borderRadius: 6, marginBottom: 20, fontSize: 13, background: status.type === 'error' ? 'rgba(231,76,60,0.15)' : 'rgba(46,160,67,0.15)', border: `1px solid ${status.type === 'error' ? 'rgba(231,76,60,0.4)' : 'rgba(46,160,67,0.4)'}`, color: status.type === 'error' ? '#e74c3c' : '#2ea043' }}>
                    {status.message}
                  </div>
                )}

                {/* Step 0 */}
                {step === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 8 }}>YOUR DETAILS</h3>
                    <div>
                      <label>Full Name *</label>
                      <input style={inputStyle} placeholder="John Doe" value={form.name} onChange={e => upd('name', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label>Phone Number *</label>
                        <input style={inputStyle} placeholder="98XXXXXXXX" type="tel" value={form.phone} onChange={e => upd('phone', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                      </div>
                      <div>
                        <label>Email Address *</label>
                        <input style={inputStyle} placeholder="you@email.com" type="email" value={form.email} onChange={e => upd('email', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                      </div>
                    </div>
                    <div>
                      <label>Car Model</label>
                      <input style={inputStyle} placeholder="e.g. Honda City 2022" value={form.carModel} onChange={e => upd('carModel', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                    </div>
                  </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 8 }}>SELECT SERVICE</h3>
                    <div>
                      <label>Service *</label>
                      <select style={inputStyle} value={form.service} onChange={e => upd('service', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'}>
                        {services.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Package Tier</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
                        {['basic','standard','premium'].map(t => (
                          <button key={t} onClick={() => upd('packageTier', t)} style={{
                            padding: '12px', borderRadius: 6, border: `1px solid ${form.packageTier === t ? 'var(--crimson)' : 'var(--border)'}`,
                            background: form.packageTier === t ? 'rgba(192,57,43,0.15)' : 'transparent',
                            color: form.packageTier === t ? 'white' : '#888',
                            cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
                            letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.3s'
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label>Service Location *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                        {[{ id:'center', label:'🏢 Service Center', sub:'Drop off your car' }, { id:'doorstep', label:'🏠 Doorstep', sub:'We come to you' }].map(loc => (
                          <button key={loc.id} onClick={() => upd('location', loc.id)} style={{
                            padding: '12px', borderRadius: 6, border: `1px solid ${form.location === loc.id ? 'var(--crimson)' : 'var(--border)'}`,
                            background: form.location === loc.id ? 'rgba(192,57,43,0.15)' : 'transparent',
                            color: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'center', transition: 'all 0.3s'
                          }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{loc.label}</div>
                            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{loc.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.location === 'doorstep' && (
                      <div>
                        <label>Your Address *</label>
                        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} placeholder="Full address including landmark..." value={form.address} onChange={e => upd('address', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 8 }}>PICK DATE & TIME</h3>
                    <div>
                      <label>Preferred Date *</label>
                      <input type="date" style={inputStyle} min={today} value={form.date} onChange={e => upd('date', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                    </div>
                    {form.date && (
                      <div>
                        <label>Time Slot *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                          {(slots.length ? slots : []).map(({ slot, available }) => (
                            <button key={slot} disabled={!available} onClick={() => upd('timeSlot', slot)} style={{
                              padding: '10px 6px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                              border: `1px solid ${form.timeSlot === slot ? 'var(--crimson)' : available ? 'var(--border)' : 'rgba(255,255,255,0.03)'}`,
                              background: form.timeSlot === slot ? 'rgba(192,57,43,0.2)' : available ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                              color: form.timeSlot === slot ? 'white' : available ? '#aaa' : '#333',
                              cursor: available ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', transition: 'all 0.3s'
                            }}>{slot}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label>Additional Notes</label>
                      <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} placeholder="Any specific concerns or requests..." value={form.notes} onChange={e => upd('notes', e.target.value)} onFocus={e => e.target.style.borderColor='var(--crimson)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: 2, marginBottom: 16 }}>CONFIRM BOOKING</h3>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', marginBottom: 20 }}>
                      {[
                        ['Name', form.name], ['Phone', form.phone], ['Email', form.email],
                        ['Car', form.carModel || 'Not specified'],
                        ['Service', form.service], ['Package', form.packageTier.charAt(0).toUpperCase() + form.packageTier.slice(1)],
                        ['Location', form.location === 'doorstep' ? '🏠 Doorstep' : '🏢 Service Center'],
                        ...(form.address ? [['Address', form.address]] : []),
                        ['Date', form.date ? new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'],
                        ['Time', form.timeSlot],
                      ].map(([label, value], i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                          <span style={{ color: '#666', fontWeight: 600, letterSpacing: 0.5 }}>{label}</span>
                          <span style={{ color: 'white', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>By confirming, you agree to our terms. A confirmation email will be sent to {form.email}.</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)} style={{
                      flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)',
                      color: 'white', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600
                    }}>← Back</button>
                  )}
                  {step < 3 ? (
                    <button onClick={nextStep} style={{
                      flex: 2, padding: '12px', background: 'var(--crimson)', border: 'none',
                      color: 'white', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, letterSpacing: 1
                    }}>Continue →</button>
                  ) : (
                    <button onClick={handleSubmit} disabled={loading} style={{
                      flex: 2, padding: '14px', background: loading ? '#333' : 'var(--crimson)', border: 'none',
                      color: 'white', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, letterSpacing: 1
                    }}>{loading ? 'Confirming...' : '✅ Confirm Booking'}</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
