import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AdminNav from './AdminNav'
import AdminLogin from './AdminLogin'
import { loginAdmin } from '../services/api'
import '../styles/admin.css'

function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('adminAuth') === 'true'
  )
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('adminAuth', 'true')
    }
  }, [isAuthenticated])

  const handleLogin = async (credentials) => {
    try {
      await loginAdmin(credentials)
      setError('')
      setIsAuthenticated(true)
    } catch (loginError) {
      setError(loginError.message || 'Invalid admin ID or password')
      setIsAuthenticated(false)
      throw loginError
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={error} />
  }

  return (
    <main className="admin-shell">
      <AdminNav onLogout={handleLogout} />
      <section className="admin-content">
        <Outlet />
      </section>
    </main>
  )
}

export default AdminLayout
