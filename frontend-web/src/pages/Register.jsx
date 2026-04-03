import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]     = useState({ name:'', email:'', phone:'', password:'' })
  const [err,  setErr]      = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handle = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try   { await register(form); navigate('/') }
    catch (e) { setErr(e.message || 'Registration failed. Try again.') }
    finally   { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'#0a0a0a' }}>
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(226,75,74,0.06),transparent 70%)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:'1.5rem' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#E24B4A,#ff6b6b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚗</div>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:'1.05rem' }}>CarWash<span style={{color:'#E24B4A'}}> Connect</span></span>
          </Link>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.75rem', fontWeight:800, color:'#fff', margin:0 }}>Create account</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:6 }}>Start booking car washes today — free</p>
        </div>

        <form onSubmit={handle} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'2rem' }}>
          {err && (
            <div style={{ background:'rgba(226,75,74,0.12)', border:'1px solid rgba(226,75,74,0.3)', color:'#ff8a80', borderRadius:10, padding:'12px 14px', fontSize:13, marginBottom:16 }}>{err}</div>
          )}
          {[
            { key:'name',     label:'Full Name', type:'text',     placeholder:'Rahul Sharma'    },
            { key:'email',    label:'Email',     type:'email',    placeholder:'you@email.com'   },
            { key:'phone',    label:'Phone',     type:'tel',      placeholder:'9876543210'      },
            { key:'password', label:'Password',  type:'password', placeholder:'Min 6 characters'},
          ].map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <label className="label">{f.label}</label>
              <input type={f.type} className="input" placeholder={f.placeholder} required
                minLength={f.key==='password' ? 6 : undefined}
                value={form[f.key]} onChange={set(f.key)} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-glow" style={{
            width:'100%', padding:14,
            background: loading ? 'rgba(226,75,74,0.4)' : '#E24B4A',
            border:'none', color:'#fff', borderRadius:12, fontSize:15, fontWeight:700,
            cursor: loading ? 'not-allowed' : 'pointer', marginTop:4,
          }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:'1.25rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#E24B4A', textDecoration:'none', fontWeight:600 }}>Sign in →</Link>
        </p>
      </motion.div>
    </div>
  )
}
