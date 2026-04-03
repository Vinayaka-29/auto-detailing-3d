import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import { formatPrice } from '../utils/helpers'

const VEHICLE_TYPES = [
  { value: 'hatchback', label: 'Hatchback',  icon: '🚗' },
  { value: 'sedan',     label: 'Sedan',      icon: '🚙' },
  { value: 'suv',       label: 'SUV/MUV',    icon: '🚐' },
  { value: 'luxury',    label: 'Luxury',     icon: '🏎️' },
]

const STEPS = ['Vehicle', 'Service', 'Slot', 'Confirm']

export default function Booking() {
  const { vendorId }   = useParams()
  const { state }      = useLocation()
  const navigate       = useNavigate()

  const [step,    setStep]    = useState(0)
  const [vendor,  setVendor]  = useState(state?.vendor || null)
  const [services, setServices] = useState([])
  const [slots,   setSlots]   = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    vehicle_type:   '',
    vehicle_number: '',
    service_id:     state?.service?.id || '',
    booking_date:   '',
    booking_time:   '',
    notes:          '',
  })

  const selectedService = services.find(s => s.id === form.service_id) || state?.service

  // Load vendor + services
  useEffect(() => {
    if (!vendor) {
      api.get(`/vendors/${vendorId}`).then(r => setVendor(r.data))
    }
    api.get('/services', { params: { vendor_id: vendorId } })
      .then(r => setServices(r.data))
  }, [vendorId])

  // Load slots when date changes
  useEffect(() => {
    if (!form.booking_date) return
    setSlots([])
    api.get('/bookings/slots', { params: { vendor_id: vendorId, date: form.booking_date } })
      .then(r => setSlots(r.data))
  }, [form.booking_date, vendorId])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const canNext = () => {
    if (step === 0) return form.vehicle_type
    if (step === 1) return form.service_id
    if (step === 2) return form.booking_date && form.booking_time
    return true
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      const res = await api.post('/bookings', { vendor_id: vendorId, ...form })
      navigate(`/payment/${res.data.id}`, { state: { booking: res.data, vendor, service: selectedService } })
    } catch (e) {
      alert(e.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  // Tomorrow as min date
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    <div className="pt-24 min-h-screen max-w-lg mx-auto px-4 pb-10">
      {/* Vendor summary */}
      {vendor && (
        <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-display font-bold text-primary">
            {vendor.business_name[0]}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{vendor.business_name}</p>
            <p className="text-white/40 text-xs">{vendor.city}</p>
          </div>
        </div>
      )}

      {/* Step progress */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? 'bg-primary text-white' : i === step ? 'bg-primary/30 text-primary border border-primary' : 'bg-surface-3 text-white/30'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs ml-1.5 hidden sm:block ${i === step ? 'text-white' : 'text-white/30'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-primary' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}>

          {/* STEP 0 — Vehicle */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-5">Select Vehicle Type</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {VEHICLE_TYPES.map(v => (
                  <button key={v.value} onClick={() => set('vehicle_type', v.value)}
                    className={`glass rounded-xl p-4 text-center transition-all ${
                      form.vehicle_type === v.value ? 'border-primary bg-primary/10' : 'hover:border-white/20'
                    }`}>
                    <div className="text-3xl mb-2">{v.icon}</div>
                    <div className="text-white text-sm font-medium">{v.label}</div>
                  </button>
                ))}
              </div>
              <div>
                <label className="label">Vehicle Number (optional)</label>
                <input className="input" placeholder="e.g. KA 01 AB 1234"
                  value={form.vehicle_number} onChange={e => set('vehicle_number', e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 1 — Service */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-5">Choose a Service</h2>
              <div className="space-y-3">
                {services.map(s => (
                  <button key={s.id} onClick={() => set('service_id', s.id)}
                    className={`w-full glass rounded-xl p-4 text-left transition-all ${
                      form.service_id === s.id ? 'border-primary bg-primary/10' : 'hover:border-white/20'
                    }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{s.name}</p>
                        <p className="text-white/40 text-xs mt-0.5">{s.description}</p>
                        <p className="text-white/30 text-xs mt-1">⏱ {s.duration_minutes} min</p>
                      </div>
                      <span className="text-primary font-semibold font-display">{formatPrice(s.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Date & Slot */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-5">Pick a Date & Time</h2>
              <div className="mb-5">
                <label className="label">Date</label>
                <input type="date" className="input" min={minDate}
                  value={form.booking_date} onChange={e => { set('booking_date', e.target.value); set('booking_time', '') }} />
              </div>
              {form.booking_date && (
                <div>
                  <label className="label">Available Slots</label>
                  {slots.length === 0
                    ? <p className="text-white/30 text-sm py-4 text-center">Loading slots…</p>
                    : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map(sl => (
                          <button key={sl.time} disabled={!sl.available}
                            onClick={() => set('booking_time', sl.time)}
                            className={`py-2.5 text-sm rounded-xl border transition-all ${
                              !sl.available
                                ? 'border-white/5 text-white/20 cursor-not-allowed line-through'
                                : form.booking_time === sl.time
                                  ? 'bg-primary border-primary text-white font-medium'
                                  : 'border-white/10 text-white/70 hover:border-primary/50'
                            }`}>
                            {sl.time}
                          </button>
                        ))}
                      </div>
                    )
                  }
                </div>
              )}
              <div className="mt-5">
                <label className="label">Notes (optional)</label>
                <textarea className="input resize-none h-20" placeholder="Any special requests…"
                  value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-5">Confirm Booking</h2>
              <div className="glass rounded-2xl p-5 space-y-4">
                {[
                  ['Wash Center',  vendor?.business_name],
                  ['Service',      selectedService?.name],
                  ['Price',        selectedService ? formatPrice(selectedService.price) : '—'],
                  ['Vehicle',      `${VEHICLE_TYPES.find(v=>v.value===form.vehicle_type)?.label} ${form.vehicle_number ? '· ' + form.vehicle_number : ''}`],
                  ['Date',         form.booking_date],
                  ['Time',         form.booking_time],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
                <div className="border-t border-white/8 pt-4 flex justify-between font-display">
                  <span className="text-white">Total</span>
                  <span className="text-primary text-xl font-bold">
                    {selectedService ? formatPrice(selectedService.price) : '—'}
                  </span>
                </div>
              </div>
              <p className="text-white/30 text-xs mt-4 text-center">
                You'll be redirected to payment after confirming.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="btn-outline flex-1">← Back</button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
            className={`btn-primary flex-1 ${!canNext() ? 'opacity-40 cursor-not-allowed' : ''}`}>
            Next →
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={submitting}
            className="btn-primary flex-1">
            {submitting ? 'Creating booking…' : 'Confirm & Pay →'}
          </button>
        )}
      </div>
    </div>
  )
}
