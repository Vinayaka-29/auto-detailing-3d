import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/client'
import { formatPrice, formatDate, statusColor } from '../utils/helpers'

export default function BookingHistory() {
  const navigate          = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    api.get('/bookings')
      .then(r => setBookings(r.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await api.put(`/bookings/${id}/cancel`, { reason: 'Customer cancelled' })
      setBookings(bks => bks.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch (e) { alert(e.message) }
  }

  const handleReview = (b) => {
    const rating  = prompt('Rate (1-5):')
    const comment = prompt('Leave a comment (optional):')
    if (!rating) return
    api.post('/reviews', { booking_id: b.id, rating: +rating, comment })
      .then(() => alert('Review submitted!'))
      .catch(e => alert(e.message))
  }

  return (
    <div className="pt-24 min-h-screen max-w-3xl mx-auto px-4 pb-10">
      <h1 className="font-display text-2xl font-bold text-white mb-6">My Bookings</h1>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all','pending','confirmed','in_progress','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
              filter === f ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/50 hover:border-white/25'
            }`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-5xl mb-4">📋</div>
          <p>No bookings yet.</p>
          <button onClick={() => navigate('/vendors')} className="btn-primary mt-4 text-sm">
            Book a Wash →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-display font-semibold text-white">{b.business_name}</p>
                  <p className="text-white/40 text-sm">{b.service_name}</p>
                </div>
                <span className={`badge text-xs ${statusColor(b.status)}`}>
                  {b.status.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div><p className="text-white/30 mb-0.5">Date</p><p className="text-white">{formatDate(b.booking_date)}</p></div>
                <div><p className="text-white/30 mb-0.5">Time</p><p className="text-white">{String(b.booking_time || '').slice(0,5)}</p></div>
                <div><p className="text-white/30 mb-0.5">Ref</p><p className="text-white font-mono">{b.booking_ref}</p></div>
                <div><p className="text-white/30 mb-0.5">Amount</p><p className="text-primary font-semibold">{formatPrice(b.total_amount)}</p></div>
              </div>
              <div className="flex gap-2">
                {b.status === 'pending' && (
                  <button onClick={() => handleCancel(b.id)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
                    Cancel
                  </button>
                )}
                {b.status === 'pending' && !b.payment_status && (
                  <button onClick={() => navigate(`/payment/${b.id}`, { state: { booking: b } })}
                    className="text-xs btn-primary py-1.5 px-3">
                    Pay Now
                  </button>
                )}
                {b.status === 'completed' && b.payment_status !== 'reviewed' && (
                  <button onClick={() => handleReview(b)}
                    className="text-xs border border-yellow-500/30 text-yellow-400 hover:border-yellow-400/60 px-3 py-1.5 rounded-lg transition-colors">
                    ★ Write Review
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
