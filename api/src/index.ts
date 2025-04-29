import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from './config.js'
import authRoutes from './routes/auth.routes.js'
import mailRoutes from './routes/mail.routes.js'
import { authMiddleware } from './middlewares/auth.middleware.js'

const basePath = process.env.BASE_PATH ? process.env.BASE_PATH : '/api/v1'
const app = new Hono().basePath(basePath)

// Middleware
app.use(logger())
app.use('*', cors({
  origin: config.CORS_ORIGINS,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use('*', authMiddleware)


// Routes
app.route('/auth', authRoutes)
app.route('/mail', mailRoutes)

// Health check
app.get('/', (c) => c.json({ message: 'Webmail API' }))

// Error handling
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

// Not found
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// Start server
serve({
  fetch: app.fetch,
  port: config.PORT
}, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`)
})
