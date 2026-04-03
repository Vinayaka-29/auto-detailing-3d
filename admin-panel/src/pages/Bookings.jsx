import { useState, useEffect } from 'react'
import api from '../api/client'
import { formatPrice, formatDate, statusColor } from '../utils/helpers'

export default function ABookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    api.get('/admin/bookings').then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => !search || [b.user_name, b.business_name, b.booking_ref, b.service_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="p-6 space-y-5">
      <h1 className="font-display text-2xl font-bold text-white">All Bookings</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="input h-9 text-sm flex-1 max-w-xs" placeholder="Search customer, center, ref…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {['all','pending','confirmed','in_progress','completed','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
                filter === f ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/50 hover:border-white/20'
              }`}>
              {f.replace('_',' ')}
            </button>
          ))}
        </div>
      </div>

      <p className="text-white/30 text-xs">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_,i)=><div key={i} className="h-14 bg-surface-2 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead className="bg-surface-2">
              <tr>
                {['Ref','Customer','Center','Service','Date','Time','Amount','Status','Payment'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-white/30">No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-white/50 whitespace-nowrap">{b.booking_ref}</td>
                  <td className="py-3 px-4 text-white whitespace-nowrap">{b.user_name}</td>
                  <td className="py-3 px-4 text-white/70 whitespace-nowrap">{b.business_name}</td>
                  <td className="py-3 px-4 text-white/50 whitespace-nowrap">{b.service_name}</td>
                  <td className="py-3 px-4 text-white/50 whitespace-nowrap">{formatDate(b.booking_date)}</td>
                  <td className="py-3 px-4 text-white/50 whitespace-nowrap">{String(b.booking_time||'').slice(0,5)}</td>
                  <td className="py-3 px-4 text-primary font-medium whitespace-nowrap">{formatPrice(b.total_amount)}</td>
                  <td className="py-3 px-4 whitespace-nowrap"><span className={`badge text-xs ${statusColor(b.status)}`}>{b.status.replace('_',' ')}</span></td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`badge text-xs ${b.payment_status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-white/30'}`}>
                      {b.payment_status || 'unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
