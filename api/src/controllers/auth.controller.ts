import type { Context } from "hono"
import { UserModel } from "../models/user.model.js"

export class AuthController {
  static async register(c: Context) {
    const { email, password } = await c.req.json()

    try {
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email)
      if (existingUser) {
        return c.json({ error: 'Email already in use' }, 400)
      }

      // Create new user
      const user = await UserModel.create({ email, password })
      const token = UserModel.generateAuthToken(user)

      return c.json({
        user: {
          id: user.id,
          email: user.email
        },
        token
      }, 201)
    } catch (error) {
      return c.json({ error: 'Registration failed' }, 400)
    }
  }

  static async login(c: Context) {
    const { email, password } = await c.req.json()

    try {
      const user = await UserModel.verifyCredentials(email, password)
      if (!user) {
        return c.json({ error: 'Invalid credentials' }, 401)
      }

      const token = UserModel.generateAuthToken(user)
      return c.json({
        user: {
          id: user.id,
          email: user.email
        },
        token
      })
    } catch (error) {
      return c.json({ error: 'Login failed' }, 400)
    }
  }

  static async me(c: Context) {
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = UserModel.verifyToken(token)

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    return c.json({
      user: {
        id: user.userId,
        email: user.email
      }
    })
  }
}
