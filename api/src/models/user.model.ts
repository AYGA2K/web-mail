import bcrypt from 'bcryptjs'
import { getDB } from '../database/db.js'
import type { User } from '../types/user.type.js';
import { decode, sign, verify } from 'hono/jwt'


export class UserModel {
  async create({ email, password }: { email: string; password: string })
    : Promise<User | undefined> {
    try {
      const db = getDB()
      const id = crypto.randomUUID()
      const created_at = new Date().toISOString()
      const hashedPassword = await bcrypt.hash(password, 10)
      await db.insertInto('users')
        .values({
          id,
          email,
          password: hashedPassword,
          created_at
        })
        .execute()

      return { id, email, created_at }
    } catch (error) {
      console.error(error)
    }
    return undefined
  }

  async findByEmail(email: string): Promise<{ id: string, password: string, email: string, created_at: string } | undefined> {
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
    return { id: user.id, email: user.email, created_at: user.created_at }
  }

  async generateAuthToken(user: User): Promise<string> {
    if (!user.id || !user.email) return ''
    const payload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
    }
    try {
      const token = await sign(
        payload,
        process.env.JWT_SECRET!,
      )
      return token
    } catch (error) {
      console.error(error)
      return ''
    }
  }
  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = await verify(token, process.env.JWT_SECRET!) as { id: string, email: string, created_at: string }
      return decoded
    } catch (error) {
      console.error(error)
      return null
    }
  }

}

