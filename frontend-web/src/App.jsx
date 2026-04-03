import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import Home            from './pages/Home'
import Vendors         from './pages/Vendors'
import VendorDetail    from './pages/VendorDetail'
import Booking         from './pages/Booking'
import Payment         from './pages/Payment'
import Profile         from './pages/Profile'
import BookingHistory  from './pages/BookingHistory'
import Login           from './pages/Login'
import Register        from './pages/Register'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div style={{ width: 36, height: 36, border: '3px solid rgba(226,75,74,0.2)', borderTopColor: '#E24B4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/vendors"           element={<Vendors />} />
          <Route path="/vendors/:id"       element={<VendorDetail />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/booking/:vendorId" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/payment/:bookingId" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/profile"           element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/bookings"          element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
