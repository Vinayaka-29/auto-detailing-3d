import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [copied, setCopied] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="pt-24 min-h-screen max-w-md mx-auto px-4 pb-10">
      <h1 className="font-display text-2xl font-bold text-white mb-6">Profile</h1>

      {/* Avatar card */}
      <div className="glass rounded-2xl p-6 mb-4 text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center font-display font-bold text-2xl text-primary mx-auto mb-3">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <h2 className="font-display text-xl font-bold text-white">{user?.name}</h2>
        <p className="text-white/40 text-sm mt-1">{user?.email}</p>
        {user?.phone && <p className="text-white/30 text-sm mt-0.5">{user.phone}</p>}
        <span className="badge bg-primary/15 text-primary mt-3 inline-flex capitalize">{user?.role}</span>
      </div>

      {/* Quick links */}
      <div className="glass rounded-2xl overflow-hidden mb-4">
        {[
          { icon: '📋', label: 'My Bookings',  onClick: () => navigate('/bookings') },
          { icon: '🔍', label: 'Find Wash Centers', onClick: () => navigate('/vendors') },
          { icon: '🏪', label: 'Register Your Center', onClick: () => navigate('/vendor') },
        ].map(item => (
          <button key={item.label} onClick={item.onClick}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 text-left border-b border-white/5 last:border-0 transition-colors">
            <span className="text-xl">{item.icon}</span>
            <span className="text-white/80 text-sm">{item.label}</span>
            <span className="ml-auto text-white/20">›</span>
          </button>
        ))}
      </div>

      <button onClick={handleLogout}
        className="w-full border border-red-500/20 text-red-400 hover:bg-red-500/10 py-3 rounded-xl transition-all text-sm font-medium">
        Sign Out
      </button>
    </div>
  )
}
