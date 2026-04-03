import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api/client'

export default function AVendors() {
  const [vendors,  setVendors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('pending') // pending | approved

  useEffect(() => { load() }, [tab])

  const load = () => {
    setLoading(true)
    api.get(`/admin/vendors?approved=${tab === 'approved'}`)
      .then(r => setVendors(r.data))
      .finally(() => setLoading(false))
  }

  const handleApprove = async (id, approved) => {
    try {
      await api.put(`/admin/vendors/${id}/approve`, { approved })
      setVendors(vs => vs.filter(v => v.id !== id))
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="font-display text-2xl font-bold text-white">Vendors</h1>

      <div className="flex gap-2">
        {['pending','approved'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm px-4 py-2 rounded-xl border capitalize transition-all ${
              tab === t ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/50 hover:border-white/25'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-28 bg-surface-2 rounded-2xl animate-pulse"/>)}</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-5xl mb-3">🏪</div>
          <p>No {tab} vendors</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendors.map((v, i) => (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-semibold text-white">{v.business_name}</p>
                    <span className={`badge text-xs ${v.is_approved ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                      {v.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm">{v.address}, {v.city}, {v.state}</p>
                  <div className="flex gap-4 mt-2 text-xs text-white/40">
                    <span>📞 {v.phone || '—'}</span>
                    <span>✉️ {v.owner_email}</span>
                    <span>📅 {new Date(v.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!v.is_approved && (
                    <button onClick={() => handleApprove(v.id, true)}
                      className="text-xs px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                      Approve
                    </button>
                  )}
                  {v.is_approved && (
                    <button onClick={() => handleApprove(v.id, false)}
                      className="text-xs px-3 py-1.5 bg-red-500/15 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
