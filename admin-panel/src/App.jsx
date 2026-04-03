import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ADashboard from './pages/Dashboard'
import AVendors   from './pages/Vendors'
import ABookings  from './pages/Bookings'
import AUsers     from './pages/Users'
import AReports   from './pages/Reports'
import Login      from './pages/Login'

const NAV = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/vendors',   icon: '🏪', label: 'Vendors'   },
  { to: '/bookings',  icon: '📋', label: 'Bookings'  },
  { to: '/users',     icon: '👥', label: 'Users'     },
  { to: '/reports',   icon: '📈', label: 'Reports'   },
]

function Shell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <aside className="w-56 bg-surface border-r border-white/8 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-display font-bold text-white text-xs">CW</div>
            <div>
              <p className="font-display font-bold text-white text-sm">Admin Panel</p>
              <p className="text-white/30 text-xs">CarWash Connect</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive ? 'bg-primary/15 text-primary' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/8">
          <div className="px-3 py-2 mb-1">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <span className="text-xs text-primary">Admin</span>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            className="w-full text-xs text-white/30 hover:text-red-400 transition-colors text-left px-3 py-1.5">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-white/40">Loading…</div>
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"     element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Shell><ADashboard /></Shell></PrivateRoute>} />
      <Route path="/vendors"   element={<PrivateRoute><Shell><AVendors /></Shell></PrivateRoute>} />
      <Route path="/bookings"  element={<PrivateRoute><Shell><ABookings /></Shell></PrivateRoute>} />
      <Route path="/users"     element={<PrivateRoute><Shell><AUsers /></Shell></PrivateRoute>} />
      <Route path="/reports"   element={<PrivateRoute><Shell><AReports /></Shell></PrivateRoute>} />
      <Route path="*"          element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>
}
