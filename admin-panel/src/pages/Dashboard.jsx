import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../api/client'
import { formatPrice, statusColor } from '../utils/helpers'

function StatCard({ label, value, sub, color = 'text-white', icon }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function ADashboard() {
  const navigate = useNavigate()
  const [stats,    setStats]    = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/bookings'),
    ]).then(([s, b]) => {
      setStats(s.data)
      setBookings(b.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_,i) => <div key={i} className="h-28 bg-surface-2 rounded-2xl" />)}
    </div>
  )

  // Build chart — bookings by day (last 7)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  const chartData = days.map(date => ({
    date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    Bookings: bookings.filter(b => b.created_at?.startsWith(date)).length,
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-white/40 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Customers"  value={stats?.total_users}    icon="👤" color="text-blue-400"   sub="registered users" />
        <StatCard label="Active Vendors"   value={stats?.total_vendors}  icon="🏪" color="text-primary"    sub="approved centers" />
        <StatCard label="Total Bookings"   value={stats?.total_bookings} icon="📋" color="text-yellow-400" sub="all time" />
        <StatCard label="Platform Revenue" value={formatPrice(stats?.total_revenue || 0)} icon="💰" color="text-green-400" sub="from paid bookings" />
      </div>

      {/* Booking trend */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display font-semibold text-white mb-4">Bookings — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
            <Bar dataKey="Bookings" fill="#E24B4A" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Recent Bookings</h2>
          <button onClick={() => navigate('/bookings')} className="text-xs text-primary hover:underline">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Ref','Customer','Center','Service','Amount','Status','Date'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium pb-3 pr-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.slice(0, 10).map(b => (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-white/50">{b.booking_ref}</td>
                  <td className="py-3 pr-4 text-white">{b.user_name}</td>
                  <td className="py-3 pr-4 text-white/70">{b.business_name}</td>
                  <td className="py-3 pr-4 text-white/50">{b.service_name}</td>
                  <td className="py-3 pr-4 text-primary font-medium">{formatPrice(b.total_amount)}</td>
                  <td className="py-3 pr-4"><span className={`badge text-xs ${statusColor(b.status)}`}>{b.status}</span></td>
                  <td className="py-3 text-white/40">{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
