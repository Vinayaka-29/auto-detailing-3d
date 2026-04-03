import { useState, useEffect } from 'react'
import api from '../api/client'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function VendorProfile() {
  const [vendor,  setVendor]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [err,     setErr]     = useState('')
  const [form,    setForm]    = useState({
    business_name: '', description: '', address: '', city: '', state: '',
    pincode: '', phone: '', email: '', latitude: '', longitude: '',
    opening_time: '08:00', closing_time: '20:00',
    working_days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
    slot_duration_minutes: 60,
  })

  useEffect(() => {
    api.get('/vendors/my/profile').then(r => {
      if (r.data) {
        setVendor(r.data)
        setForm({
          business_name:        r.data.business_name,
          description:          r.data.description || '',
          address:              r.data.address,
          city:                 r.data.city,
          state:                r.data.state,
          pincode:              r.data.pincode || '',
          phone:                r.data.phone || '',
          email:                r.data.email || '',
          latitude:             r.data.latitude || '',
          longitude:            r.data.longitude || '',
          opening_time:         r.data.opening_time?.slice(0,5) || '08:00',
          closing_time:         r.data.closing_time?.slice(0,5) || '20:00',
          working_days:         r.data.working_days || ['Mon','Tue','Wed','Thu','Fri','Sat'],
          slot_duration_minutes:r.data.slot_duration_minutes || 60,
        })
      }
    }).finally(() => setLoading(false))
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggleDay = d => setForm(f => ({
    ...f,
    working_days: f.working_days.includes(d) ? f.working_days.filter(x => x !== d) : [...f.working_days, d],
  }))

  const detectLocation = () => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }))
    })
  }

  const handleSave = async () => {
    setErr(''); setSaving(true); setSaved(false)
    try {
      if (vendor) {
        const res = await api.put(`/vendors/${vendor.id}`, form)
        setVendor(res.data)
      } else {
        const res = await api.post('/vendors/register', form)
        setVendor(res.data)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { setErr(e.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="p-6 animate-pulse space-y-4">{[...Array(5)].map((_,i)=><div key={i} className="h-12 bg-surface-2 rounded-xl"/>)}</div>

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {vendor ? 'My Profile' : 'Register Your Center'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {vendor
              ? vendor.is_approved
                ? '✅ Approved — visible to customers'
                : '⏳ Pending admin approval'
              : 'Fill in your details to get listed on the platform'}
          </p>
        </div>
      </div>

      {err   && <div className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">{err}</div>}
      {saved && <div className="bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl p-3 text-sm">✓ Profile saved successfully!</div>}

      {/* Business Info */}
      <section className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Business Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Business Name *</label>
            <input className="input" placeholder="Speed Car Wash" value={form.business_name} onChange={set('business_name')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input resize-none h-24" placeholder="Tell customers about your services…" value={form.description} onChange={set('description')} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="label">Business Email</label>
            <input type="email" className="input" placeholder="hello@yourwash.in" value={form.email} onChange={set('email')} />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Street Address *</label>
            <input className="input" placeholder="15, MG Road, Shanthala Nagar" value={form.address} onChange={set('address')} />
          </div>
          <div>
            <label className="label">City *</label>
            <input className="input" placeholder="Bangalore" value={form.city} onChange={set('city')} />
          </div>
          <div>
            <label className="label">State *</label>
            <input className="input" placeholder="Karnataka" value={form.state} onChange={set('state')} />
          </div>
          <div>
            <label className="label">Pincode</label>
            <input className="input" placeholder="560001" value={form.pincode} onChange={set('pincode')} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Latitude</label>
            <input type="number" className="input" placeholder="12.9716" value={form.latitude} onChange={set('latitude')} />
          </div>
          <div>
            <label className="label">Longitude</label>
            <input type="number" className="input" placeholder="77.5946" value={form.longitude} onChange={set('longitude')} />
          </div>
        </div>
        <button onClick={detectLocation} className="text-xs text-primary hover:underline flex items-center gap-1">
          📍 Auto-detect my coordinates
        </button>
      </section>

      {/* Schedule */}
      <section className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Schedule</h2>
        <div>
          <label className="label">Working Days</label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map(d => (
              <button key={d} onClick={() => toggleDay(d)}
                className={`w-12 h-10 text-sm rounded-xl border transition-all ${
                  form.working_days.includes(d)
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'border-white/10 text-white/40 hover:border-white/25'
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Opening Time</label>
            <input type="time" className="input" value={form.opening_time} onChange={set('opening_time')} />
          </div>
          <div>
            <label className="label">Closing Time</label>
            <input type="time" className="input" value={form.closing_time} onChange={set('closing_time')} />
          </div>
          <div>
            <label className="label">Slot Duration (min)</label>
            <select className="input" value={form.slot_duration_minutes} onChange={set('slot_duration_minutes')}>
              {[30,45,60,90,120].map(v => <option key={v} value={v}>{v} min</option>)}
            </select>
          </div>
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 text-base">
        {saving ? 'Saving…' : vendor ? 'Save Changes' : 'Register Business'}
      </button>
    </div>
  )
}
