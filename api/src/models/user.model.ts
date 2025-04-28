import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDB } from '../database/db.js'
import type { User } from '../types/user.type.js';


export class UserModel {
  async create({ email, password }: { email: string; password: string }): Promise<User> {
    const db = getDB()
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.insertInto('users')
      .values({
        id,
        email,
        password: hashedPassword,
        createdAt
      })
      .execute()

    return { id, email, createdAt }
  }

  async findByEmail(email: string): Promise<{ id: string, password: string, email: string, createdAt: string } | undefined> {
    const db = getDB()
    const user = await db.selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

    return user ?? undefined
  }

  async verifyCredentials(email: string, password: string): Promise<User | void> {
    const user = await this.findByEmail(email)
    if (!user) return
    if (user.password === undefined) return
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return
    return { id: user.id, email: user.email, createdAt: user.createdAt }
  }

  generateAuthToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )
  }
  verifyToken(token: string): User | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
      return { id: decoded.userId, email: decoded.email, createdAt: '' }
    } catch (error) {
      return null
    }
  }

}

