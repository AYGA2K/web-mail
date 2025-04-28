import { Hono } from 'hono'
import { AuthController } from '../controllers/auth.controller.js'

const authRoutes = new Hono()
const authController = new AuthController()

authRoutes.post('/register', authController.register)
authRoutes.post('/login', authController.login)
authRoutes.get('/me', authController.me)

export default authRoutes
