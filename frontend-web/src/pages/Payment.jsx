import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/client'
import { formatPrice } from '../utils/helpers'

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function Payment() {
  const { bookingId } = useParams()
  const { state }     = useLocation()
  const navigate      = useNavigate()
  const [status,   setStatus]   = useState('idle')  // idle | loading | success | failed
  const [booking,  setBooking]  = useState(state?.booking || null)
  const vendor  = state?.vendor
  const service = state?.service

  useEffect(() => {
    if (!booking) {
      // If navigated directly, fetch booking info
      api.get('/bookings').then(r => {
        const b = r.data.find(b => b.id === bookingId)
        if (b) setBooking(b)
        else navigate('/bookings')
      })
    }
  }, [bookingId])

  const handlePay = async () => {
    setStatus('loading')
    const ok = await loadRazorpay()
    if (!ok) { alert('Razorpay failed to load'); setStatus('idle'); return }

    try {
      const order = await api.post('/payments/create-order', { booking_id: bookingId })
      const { order_id, amount, currency, key, booking_ref } = order.data

      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        name:        'CarWash Connect',
        description: service?.name || 'Car Wash Service',
        order_id,
        prefill: {
          name:    booking?.user_name  || '',
          contact: booking?.user_phone || '',
        },
        theme: { color: '#E24B4A' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              booking_id:          bookingId,
            })
            setStatus('success')
          } catch {
            setStatus('failed')
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      })
      rzp.open()
    } catch (e) {
      alert(e.message || 'Could not create order')
      setStatus('idle')
    }
  }

  if (status === 'success') return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-sm">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">✅</div>
        <h2 className="font-display text-2xl font-bold text-white mb-3">Booking Confirmed!</h2>
        <p className="text-white/50 mb-6">Your car wash is booked. You'll receive a confirmation shortly.</p>
        <div className="glass rounded-xl p-4 mb-6 text-sm space-y-2">
          {vendor && <div className="flex justify-between"><span className="text-white/40">Center</span><span className="text-white">{vendor.business_name}</span></div>}
          {service && <div className="flex justify-between"><span className="text-white/40">Service</span><span className="text-white">{service.name}</span></div>}
          {booking?.booking_date && <div className="flex justify-between"><span className="text-white/40">Date</span><span className="text-white">{booking.booking_date}</span></div>}
          {booking?.booking_time && <div className="flex justify-between"><span className="text-white/40">Time</span><span className="text-white">{String(booking.booking_time).slice(0,5)}</span></div>}
        </div>
        <button onClick={() => navigate('/bookings')} className="btn-primary w-full">View My Bookings</button>
      </motion.div>
    </div>
  )

  return (
    <div className="pt-24 min-h-screen max-w-md mx-auto px-4 pb-10">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Complete Payment</h1>

      {/* Order summary */}
      <div className="glass rounded-2xl p-5 mb-6 space-y-3">
        <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium">Order Summary</h3>
        {vendor && (
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Wash Center</span>
            <span className="text-white">{vendor.business_name}</span>
          </div>
        )}
        {service && (
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Service</span>
            <span className="text-white">{service.name}</span>
          </div>
        )}
        {booking?.booking_date && (
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Date & Time</span>
            <span className="text-white">{booking.booking_date} · {String(booking.booking_time || '').slice(0,5)}</span>
          </div>
        )}
        <div className="border-t border-white/8 pt-3 flex justify-between font-display">
          <span className="text-white">Total</span>
          <span className="text-primary text-2xl font-bold">
            {service ? formatPrice(service.price) : booking?.total_amount ? formatPrice(booking.total_amount) : '—'}
          </span>
        </div>
      </div>

      {/* Payment options info */}
      <div className="glass rounded-xl p-4 mb-6">
        <p className="text-white/50 text-xs mb-3">Accepted payment methods</p>
        <div className="flex gap-3 flex-wrap">
          {['UPI', 'Cards', 'Net Banking', 'Wallets'].map(m => (
            <span key={m} className="text-xs bg-white/5 border border-white/10 text-white/50 px-3 py-1 rounded-full">{m}</span>
          ))}
        </div>
      </div>

      {status === 'failed' && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
          Payment failed. Please try again.
        </div>
      )}

      <button onClick={handlePay} disabled={status === 'loading'}
        className="btn-primary w-full py-4 text-base font-semibold">
        {status === 'loading' ? 'Opening payment…' : 'Pay with Razorpay →'}
      </button>
      <p className="text-white/20 text-xs text-center mt-3">Secured by Razorpay · 256-bit SSL</p>
    </div>
  )
}
