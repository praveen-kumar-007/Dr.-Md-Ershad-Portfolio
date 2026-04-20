import { useState } from 'react'
import '../styles/admin.css'

function AdminLogin({ onLogin, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await onLogin({ username, password })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-shell admin-login-shell">
      <section className="admin-content admin-login-panel">
        <div className="admin-hero">
          <h1>Admin Login</h1>
          <p>Enter your admin ID and password to access the portfolio editor.</p>
        </div>
        <form className="admin-form-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-username">Admin ID</label>
            <input
              id="admin-username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {error ? <p className="admin-error-message">{error}</p> : null}
          <button type="submit" className="admin-button" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLogin
