import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import api from '../api/client'
import { formatPrice } from '../utils/helpers'

const COLORS = ['#E24B4A','#1D9E75','#EF9F27','#378ADD','#D4537E','#7F77DD']

export default function AReports() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/admin/bookings').then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 animate-pulse space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-64 bg-surface-2 rounded-2xl"/>)}</div>

  // Status breakdown
  const statusMap = {}
  bookings.forEach(b => { statusMap[b.status] = (statusMap[b.status]||0)+1 })
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }))

  // Revenue by city
  const cityMap = {}
  bookings.forEach(b => {
    if (b.payment_status === 'paid') {
      // Note: city not directly on booking — use business_name as proxy
      const key = b.business_name || 'Other'
      cityMap[key] = (cityMap[key]||0) + b.total_amount
    }
  })
  const cityData = Object.entries(cityMap)
    .sort((a,b) => b[1]-a[1]).slice(0,6)
    .map(([name, revenue]) => ({ name: name.length > 14 ? name.slice(0,14)+'…' : name, revenue }))

  // Monthly bookings (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5-i))
    return { key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label: d.toLocaleDateString('en-IN',{month:'short'}) }
  })
  const monthlyData = months.map(m => ({
    month: m.label,
    Bookings: bookings.filter(b => b.created_at?.startsWith(m.key)).length,
    Revenue:  bookings.filter(b => b.created_at?.startsWith(m.key) && b.payment_status==='paid').reduce((s,b)=>s+b.total_amount,0),
  }))

  // Summary
  const totalRevenue  = bookings.filter(b=>b.payment_status==='paid').reduce((s,b)=>s+b.total_amount,0)
  const platformFee   = bookings.filter(b=>b.payment_status==='paid').reduce((s,b)=>s+(b.platform_fee||0),0)
  const vendorPayout  = totalRevenue - platformFee

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Reports</h1>

      {/* Revenue breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Gross Revenue',   value: formatPrice(totalRevenue), color: 'text-green-400' },
          { label: 'Platform Fees',   value: formatPrice(platformFee),  color: 'text-primary' },
          { label: 'Vendor Payouts',  value: formatPrice(vendorPayout), color: 'text-blue-400' },
        ].map(c => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{c.label}</p>
            <p className={`font-display text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly trend */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display font-semibold text-white mb-4">Monthly Bookings (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
            <Bar dataKey="Bookings" fill="#E24B4A" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status pie */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-semibold text-white mb-4">Booking Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-white/60">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i%COLORS.length] }} />
                <span className="capitalize">{s.name.replace('_',' ')}</span>
                <span className="text-white/30">({s.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top centers */}
        {cityData.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display font-semibold text-white mb-4">Revenue by Center</h2>
            <div className="space-y-3">
              {cityData.map((c, i) => {
                const pct = cityData[0].revenue > 0 ? Math.round((c.revenue / cityData[0].revenue) * 100) : 0
                return (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70 truncate">{c.name}</span>
                      <span className="text-white/40 ml-2 flex-shrink-0">{formatPrice(c.revenue)}</span>
                    </div>
                    <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: COLORS[i%COLORS.length] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
