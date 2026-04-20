export async function login(req, res) {
  const { username, password } = req.body
  const adminUser = process.env.ADMIN_USER || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'password'

  if (username === adminUser && password === adminPassword) {
    return res.json({ authenticated: true })
  }

  return res.status(401).json({ message: 'Invalid admin ID or password' })
}
