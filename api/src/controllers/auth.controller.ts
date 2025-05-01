import type { Context } from "hono"
import { UserModel } from "../models/user.model.js"
import type { CreateUserDto } from "../schemas/user/request/create.schema.js"
import { ApiResponse } from "../utils/response.util.js"

export class AuthController {
  private userModel: UserModel

  constructor() {
    this.userModel = new UserModel()
  }

  register = async (c: Context) => {
    try {
      const createUserDto: CreateUserDto = await c.req.json()

      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(createUserDto.email)
      if (existingUser) {
        return ApiResponse.error(c, {
          status: 400,
          message: 'Email already in use',
        })
      }

      // Create new user
      const user = await this.userModel.create(createUserDto)
      if (!user) {
        return ApiResponse.internalServerError(c, 'Registration failed')
      }

      return ApiResponse.success(c, {
        data: { user },
        message: 'User registered successfully',
        status: 201
      })
    } catch (error) {
      console.error(error)
      return ApiResponse.internalServerError(c, 'Registration failed')
    }
  }

  login = async (c: Context) => {
    try {
      const { email, password } = await c.req.json()
      const user = await this.userModel.verifyCredentials(email, password)

      if (!user) {
        return ApiResponse.unauthorized(c, 'Invalid credentials')
      }

      const token = await this.userModel.generateAuthToken(user)
      return ApiResponse.success(c, {
        data: {
          user: {
            id: user.id,
            email: user.email
          },
          token
        },
        message: 'Login successful'
      })
    } catch (error) {
      console.error(error)
      return ApiResponse.error(c, {
        status: 400,
        message: 'Login failed',
      })
    }
  }

  me = async (c: Context) => {
    try {
      const authHeader = c.req.header('Authorization')
      if (!authHeader) {
        return ApiResponse.unauthorized(c)
      }

      const token = authHeader.split(' ')[1]
      const user = await this.userModel.verifyToken(token)

      if (!user) {
        return ApiResponse.unauthorized(c)
      }

      return ApiResponse.success(c, {
        data: { user },
        message: 'User profile retrieved successfully'
      })
    } catch (error) {
      console.error(error)
      return ApiResponse.unauthorized(c)
    }
  }
}
