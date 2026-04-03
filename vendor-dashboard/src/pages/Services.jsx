import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/client'
import { formatPrice, categoryLabel } from '../utils/helpers'

const EMPTY = { name: '', description: '', price: '', duration_minutes: 60, category: 'wash' }
const CATS  = ['wash','detailing','coating','ppf']

export default function VServices() {
  const [services, setServices] = useState([])
  const [vendor,   setVendor]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [err,      setErr]      = useState('')

  useEffect(() => {
    api.get('/vendors/my/profile').then(r => {
      setVendor(r.data)
      if (r.data) api.get('/services', { params: { vendor_id: r.data.id } })
        .then(s => setServices(s.data))
    }).finally(() => setLoading(false))
  }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErr(''); setModal(true) }
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, description: s.description||'', price: s.price/100, duration_minutes: s.duration_minutes, category: s.category }); setErr(''); setModal(true) }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || !form.price) { setErr('Name and price are required'); return }
    setSaving(true); setErr('')
    try {
      const payload = { ...form, price: Math.round(+form.price * 100) }
      if (editing) {
        const res = await api.put(`/services/${editing.id}`, payload)
        setServices(ss => ss.map(s => s.id === editing.id ? res.data : s))
      } else {
        const res = await api.post('/services', { ...payload, vendor_id: vendor.id })
        setServices(ss => [...ss, res.data])
      }
      setModal(false)
    } catch (e) { setErr(e.message) }
    finally { setSaving(false) }
  }

  const handleToggle = async (s) => {
    try {
      await api.put(`/services/${s.id}`, { is_active: !s.is_active })
      setServices(ss => ss.map(x => x.id === s.id ? { ...x, is_active: !x.is_active } : x))
    } catch (e) { alert(e.message) }
  }

  if (loading) return <div className="p-6 animate-pulse space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-20 bg-surface-2 rounded-2xl"/>)}</div>

  if (!vendor) return (
    <div className="p-8 text-center text-white/40">
      <p>Complete your vendor profile first to manage services.</p>
    </div>
  )

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Services</h1>
        <button onClick={openAdd} className="btn-primary text-sm py-2 px-4">+ Add Service</button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-5xl mb-3">⚙️</div>
          <p className="mb-4">No services yet. Add your first service.</p>
          <button onClick={openAdd} className="btn-primary text-sm">Add Service</button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass rounded-xl p-4 flex items-center gap-4 ${!s.is_active ? 'opacity-40' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{s.name}</p>
                  <span className="badge bg-white/5 text-white/40 text-xs">{categoryLabel(s.category)}</span>
                </div>
                {s.description && <p className="text-white/40 text-xs truncate">{s.description}</p>}
                <p className="text-white/30 text-xs mt-1">⏱ {s.duration_minutes} min</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-primary font-display font-semibold">{formatPrice(s.price)}</p>
                <div className="flex gap-2 mt-2 justify-end">
                  <button onClick={() => openEdit(s)}
                    className="text-xs text-white/40 hover:text-white px-2 py-1 border border-white/10 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleToggle(s)}
                    className={`text-xs px-2 py-1 border rounded-lg transition-colors ${
                      s.is_active
                        ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                        : 'text-green-400 border-green-500/20 hover:bg-green-500/10'
                    }`}>
                    {s.is_active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-2 border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <h2 className="font-display font-bold text-white text-lg mb-5">
                {editing ? 'Edit Service' : 'Add New Service'}
              </h2>
              {err && <div className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm mb-4">{err}</div>}
              <div className="space-y-4">
                <div>
                  <label className="label">Service Name</label>
                  <input className="input" placeholder="e.g. Full Interior Detailing" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input resize-none h-20" placeholder="What's included…" value={form.description} onChange={set('description')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Price (₹)</label>
                    <input type="number" className="input" placeholder="299" value={form.price} onChange={set('price')} />
                  </div>
                  <div>
                    <label className="label">Duration (min)</label>
                    <input type="number" className="input" placeholder="60" value={form.duration_minutes} onChange={set('duration_minutes')} />
                  </div>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category} onChange={set('category')}>
                    {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
