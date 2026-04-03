import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import api from '../api/client'
import { formatPrice } from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-2 border border-white/10 rounded-xl p-3 text-sm">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name === 'Revenue' ? formatPrice(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function VAnalytics() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/bookings/vendor').then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 bg-surface-2 rounded w-1/3" />
      <div className="h-64 bg-surface-2 rounded-2xl" />
      <div className="h-64 bg-surface-2 rounded-2xl" />
    </div>
  )

  // Build last-7-days daily data
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const dailyData = days.map(date => {
    const dayBks = bookings.filter(b => b.booking_date === date)
    const revenue = dayBks.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.total_amount || 0), 0)
    return {
      date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      Bookings: dayBks.length,
      Revenue:  revenue,
    }
  })

  // Service breakdown
  const serviceMap = {}
  bookings.forEach(b => {
    if (!serviceMap[b.service_name]) serviceMap[b.service_name] = 0
    serviceMap[b.service_name]++
  })
  const serviceData = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  // Summary stats
  const totalRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.total_amount || 0), 0)
  const completed    = bookings.filter(b => b.status === 'completed').length
  const conversion   = bookings.length ? Math.round((completed / bookings.length) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',    value: formatPrice(totalRevenue), color: 'text-green-400' },
          { label: 'Total Bookings',   value: bookings.length,           color: 'text-white' },
          { label: 'Completed',        value: completed,                  color: 'text-primary' },
          { label: 'Completion Rate',  value: `${conversion}%`,           color: 'text-yellow-400' },
        ].map(c => (
          <div key={c.label} className="glass rounded-2xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{c.label}</p>
            <p className={`font-display text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Daily bookings chart */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display font-semibold text-white mb-4">Last 7 Days — Bookings</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Bookings" fill="#E24B4A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue line chart */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display font-semibold text-white mb-4">Last 7 Days — Revenue</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v/100).toFixed(0)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="Revenue" stroke="#1D9E75" strokeWidth={2} dot={{ fill: '#1D9E75', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top services */}
      {serviceData.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-semibold text-white mb-4">Top Services</h2>
          <div className="space-y-3">
            {serviceData.map((s, i) => {
              const pct = Math.round((s.count / bookings.length) * 100)
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{s.name}</span>
                    <span className="text-white/40">{s.count} bookings · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
