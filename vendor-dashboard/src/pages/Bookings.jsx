import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'
import { formatPrice, formatDate, statusColor } from '../utils/helpers'

const STATUS_ACTIONS = {
  pending:     [{ label: 'Confirm',     next: 'confirmed',   cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }],
  confirmed:   [{ label: 'Start Job',   next: 'in_progress', cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }],
  in_progress: [{ label: 'Mark Done',   next: 'completed',   cls: 'bg-green-500/20 text-green-400 border-green-500/30' }],
  completed:   [],
  cancelled:   [],
}

export default function VBookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    api.get('/bookings/vendor').then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status })
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b))
    } catch (e) { alert(e.message) }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="p-6 space-y-5">
      <h1 className="font-display text-2xl font-bold text-white">Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all','pending','confirmed','in_progress','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
              filter === f ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/50 hover:border-white/25'
            }`}>
            {f.replace('_',' ')}
            {f !== 'all' && (
              <span className="ml-1.5 text-white/40">
                {bookings.filter(b => b.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-surface-2 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-5xl mb-3">📋</div>
          <p>No {filter !== 'all' ? filter : ''} bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm">{b.customer_name}</p>
                    <span className={`badge text-xs ${statusColor(b.status)}`}>{b.status.replace('_',' ')}</span>
                  </div>
                  <p className="text-white/40 text-xs">{b.customer_phone}</p>
                </div>
                <span className="text-primary font-semibold font-display">{formatPrice(b.price || b.total_amount)}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div><p className="text-white/30 mb-0.5">Service</p><p className="text-white">{b.service_name}</p></div>
                <div><p className="text-white/30 mb-0.5">Date</p><p className="text-white">{formatDate(b.booking_date)}</p></div>
                <div><p className="text-white/30 mb-0.5">Time</p><p className="text-white">{String(b.booking_time||'').slice(0,5)}</p></div>
                <div><p className="text-white/30 mb-0.5">Vehicle</p><p className="text-white capitalize">{b.vehicle_type} {b.vehicle_number && `· ${b.vehicle_number}`}</p></div>
              </div>

              {/* Action buttons */}
              {STATUS_ACTIONS[b.status]?.map(action => (
                <button key={action.next}
                  onClick={() => updateStatus(b.id, action.next)}
                  className={`text-xs px-4 py-1.5 rounded-lg border transition-colors ${action.cls}`}>
                  {action.label}
                </button>
              ))}
              {b.status === 'pending' && (
                <button onClick={() => updateStatus(b.id, 'cancelled')}
                  className="ml-2 text-xs px-4 py-1.5 rounded-lg border border-red-500/20 text-red-400 transition-colors hover:bg-red-500/10">
                  Reject
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
