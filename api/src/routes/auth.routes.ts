import { Hono } from 'hono'
import { AuthController } from '../controllers/auth.controller.js'

const authRoutes = new Hono()

authRoutes.post('/register', AuthController.register)
authRoutes.post('/login', AuthController.login)
authRoutes.get('/me', AuthController.me)

export default authRoutes
