import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { formatPrice, statusColor } from '../utils/helpers'

function StatCard({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function VDashboard() {
  const navigate = useNavigate()
  const [vendor,   setVendor]   = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/vendors/my/profile'),
      api.get('/bookings/vendor'),
    ]).then(([v, b]) => {
      setVendor(v.data)
      setBookings(b.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-surface-2 rounded-2xl" />)}
    </div>
  )

  if (!vendor) return (
    <div className="p-8 text-center">
      <div className="text-5xl mb-4">🏪</div>
      <h2 className="font-display text-xl font-bold text-white mb-2">Set up your wash center</h2>
      <p className="text-white/40 mb-6 text-sm">Register your business to start accepting bookings.</p>
      <button onClick={() => navigate('/profile')} className="btn-primary">Set Up Profile →</button>
    </div>
  )

  const today        = new Date().toISOString().split('T')[0]
  const todayBks     = bookings.filter(b => b.booking_date === today)
  const pendingBks   = bookings.filter(b => b.status === 'pending')
  const revenue      = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{vendor.business_name}</h1>
          <p className="text-white/40 text-sm">{vendor.city} · {vendor.is_approved ? '✅ Approved' : '⏳ Pending approval'}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          ★ <span className="text-white font-medium">{Number(vendor.rating).toFixed(1)}</span>
          <span className="text-white/30">({vendor.review_count})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Bookings"  value={todayBks.length}      sub="bookings today"   color="text-primary" />
        <StatCard label="Pending"           value={pendingBks.length}    sub="need attention"   color="text-yellow-400" />
        <StatCard label="Total Bookings"    value={bookings.length}      sub="all time" />
        <StatCard label="Revenue Collected" value={formatPrice(revenue)} sub="from paid bookings" color="text-green-400" />
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Recent Bookings</h2>
          <button onClick={() => navigate('/bookings')} className="text-xs text-primary hover:underline">View all →</button>
        </div>
        <div className="space-y-3">
          {bookings.slice(0, 5).map(b => (
            <div key={b.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{b.customer_name}</p>
                <p className="text-white/40 text-xs">{b.service_name} · {b.booking_date} {String(b.booking_time || '').slice(0,5)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-primary text-sm font-semibold">{formatPrice(b.price || b.total_amount)}</span>
                <span className={`badge text-xs ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">No bookings yet. Share your profile link to get started!</p>
          )}
        </div>
      </div>
    </div>
  )
}
