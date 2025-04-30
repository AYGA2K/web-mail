import bcrypt from 'bcryptjs'
import { getDB } from '../database/db.js'
import { sign, verify } from 'hono/jwt'
import type { User } from '../entities/user.entity.js';
import type { CreateUserDto } from '../schemas/user/create-user.schema.js';
import type { CreateUserResponseDto } from '../schemas/user/user-response.schema.js';


export class UserModel {
  async create(createUserDto: CreateUserDto)
    : Promise<CreateUserResponseDto | undefined> {
    try {
      const db = getDB()
      const id = crypto.randomUUID()
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
      await db.insertInto('users')
        .values({
          id,
          email: createUserDto.email,
          first_name: createUserDto.first_name,
          last_name: createUserDto.last_name,
          password: hashedPassword,
        })
        .executeTakeFirst()
      return { id: id, email: createUserDto.email, first_name: createUserDto.first_name, last_name: createUserDto.last_name }

    } catch (error) {
      console.error(error)
    }
    return undefined
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const db = getDB()
    const user = await db.selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

    return user ?? undefined
  }

  async verifyCredentials(email: string, password: string): Promise<CreateUserResponseDto | void> {
    const user = await this.findByEmail(email)
    if (!user) return
    if (user.password === undefined) return
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return
    return { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email }
  }

  async generateAuthToken(user: CreateUserResponseDto): Promise<string> {
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
  async verifyToken(token: string): Promise<CreateUserResponseDto | null> {
    try {
      const decoded = await verify(token, process.env.JWT_SECRET!) as CreateUserResponseDto
      return decoded
    } catch (error) {
      console.error(error)
      return null
    }
  }

}

