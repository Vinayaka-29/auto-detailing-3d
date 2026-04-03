import { useState, useEffect } from 'react'
import api from '../api/client'

export default function AUsers() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    !search || [u.name, u.email, u.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const roleColor = r => ({
    admin:    'bg-primary/15 text-primary',
    vendor:   'bg-blue-500/15 text-blue-400',
    customer: 'bg-white/5 text-white/50',
  })[r] || 'bg-white/5 text-white/40'

  return (
    <div className="p-6 space-y-5">
      <h1 className="font-display text-2xl font-bold text-white">Users</h1>

      <div className="flex items-center justify-between gap-3">
        <input className="input h-9 text-sm max-w-xs" placeholder="Search name, email, phone…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <p className="text-white/30 text-xs">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_,i)=><div key={i} className="h-14 bg-surface-2 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead className="bg-surface-2">
              <tr>
                {['Name','Email','Phone','Role','Joined','Status'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium py-3 px-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-white/30">No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/60">{u.email}</td>
                  <td className="py-3 px-4 text-white/50">{u.phone || '—'}</td>
                  <td className="py-3 px-4"><span className={`badge text-xs capitalize ${roleColor(u.role)}`}>{u.role}</span></td>
                  <td className="py-3 px-4 text-white/40">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`badge text-xs ${u.is_active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
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
