import type { Context } from "hono"
import { UserModel } from "../models/user.model.js"

export class AuthController {
  private userModel: UserModel

  constructor() {
    this.userModel = new UserModel()
  }

  register = async (c: Context) => {
    try {
      const { email, password } = await c.req.json()
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(email)
      if (existingUser) {
        return c.json({ error: 'Email already in use' }, 400)
      }

      // Create new user
      const user = await this.userModel.create({ email, password })
      if (!user) {
        return c.json({ error: 'Registration failed' }, 500)
      }
      const token = this.userModel.generateAuthToken(user)

      return c.json({
        user: {
          id: user.id,
          email: user.email
        },
        token
      }, 201)
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Registration failed' }, 500)
    }
  }

  login = async (c: Context) => {
    const { email, password } = await c.req.json()

    try {
      const user = await this.userModel.verifyCredentials(email, password)
      if (!user) {
        return c.json({ error: 'Invalid credentials' }, 401)
      }

      const token = await this.userModel.generateAuthToken(user)
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

  me = async (c: Context) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = await this.userModel.verifyToken(token)

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    return c.json({
      user
    })
  }
}
