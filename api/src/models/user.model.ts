import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  createdAt: z.date().default(() => new Date())
})

export type User = z.infer<typeof UserSchema>

// In-memory database simulation
const users: User[] = []

export const UserModel = {
  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      password: hashedPassword,
      createdAt: new Date()
    }
    users.push(newUser)
    return newUser
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return users.find(u => u.email === email)
  },

  async verifyCredentials(email: string, password: string): Promise<User | undefined> {
    const user = await this.findByEmail(email)
    if (!user) return undefined

    const isValid = await bcrypt.compare(password, user.password)
    return isValid ? user : undefined
  },

  generateAuthToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )
  },

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
    } catch {
      return null
    }
  }
}
