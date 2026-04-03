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
      await login(form.email, form.password)
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
          <h1 className="font-display text-2xl font-bold text-white">Vendor Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage your wash center</p>
        </div>
        <form onSubmit={handle} className="glass rounded-2xl p-6 space-y-4">
          {err && <div className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">{err}</div>}
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" required value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-white/30 text-xs mt-4">
          Not a vendor yet? Register on <a href="http://localhost:5173/register" className="text-primary hover:underline">CarWash Connect</a>
        </p>
      </motion.div>
    </div>
  )
}
