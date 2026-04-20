export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  const message = err?.message || String(err) || 'Internal Server Error'

  console.error('API error:', err)

  res.status(statusCode)
  res.json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
