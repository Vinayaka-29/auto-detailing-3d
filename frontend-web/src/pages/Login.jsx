import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const from        = location.state?.from?.pathname || '/'
  const [form, setForm]     = useState({ email:'', password:'' })
  const [err,  setErr]      = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try   { await login(form.email, form.password); navigate(from, { replace:true }) }
    catch (e) { setErr(e.message || 'Invalid email or password') }
    finally   { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'#0a0a0a' }}>
      {/* BG glow */}
      <div style={{ position:'fixed', top:'-20%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(226,75,74,0.08),transparent 70%)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:'1.5rem' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#E24B4A,#ff6b6b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚗</div>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:'1.05rem' }}>CarWash<span style={{color:'#E24B4A'}}> Connect</span></span>
          </Link>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.75rem', fontWeight:800, color:'#fff', margin:0 }}>Welcome back</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:6 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handle} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'2rem' }}>
          {err && (
            <div style={{ background:'rgba(226,75,74,0.12)', border:'1px solid rgba(226,75,74,0.3)', color:'#ff8a80', borderRadius:10, padding:'12px 14px', fontSize:13, marginBottom:16 }}>{err}</div>
          )}
          <div style={{ marginBottom:16 }}>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="you@email.com" required
              value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label className="label">Password</label>
            <input type="password" className="input" placeholder="••••••••" required
              value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
          </div>
          <button type="submit" disabled={loading} className="btn-glow" style={{
            width:'100%', padding:14,
            background: loading ? 'rgba(226,75,74,0.4)' : '#E24B4A',
            border:'none', color:'#fff', borderRadius:12, fontSize:15, fontWeight:700,
            cursor: loading ? 'not-allowed' : 'pointer', transition:'background 0.15s',
          }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:'1.25rem' }}>
          No account?{' '}
          <Link to="/register" style={{ color:'#E24B4A', textDecoration:'none', fontWeight:600 }}>Create one free →</Link>
        </p>
      </motion.div>
    </div>
  )
}
