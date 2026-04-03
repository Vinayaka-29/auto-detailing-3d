import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err,  setErr]  = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const res = await login(form.email, form.password)
      if (res.user.role !== 'admin') { setErr('Admin access only'); return }
      navigate('/dashboard')
    } catch (e) { setErr(e.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-display font-bold text-white text-base mx-auto mb-4">CW</div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">CarWash Connect Platform Admin</p>
        </div>
        <form onSubmit={handle} className="glass rounded-2xl p-6 space-y-4">
          {err && <div className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">{err}</div>}
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required value={form.email}
              onChange={e => setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" required value={form.password}
              onChange={e => setForm(f=>({...f,password:e.target.value}))} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign In as Admin'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
