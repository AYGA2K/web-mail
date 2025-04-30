import type { Context } from 'hono'
import type { BaseResponse } from '../schemas/user/response.schema.js'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class ApiResponse {
  static success<T>(
    c: Context,
    options: {
      data?: T
      message?: string
      meta?: Record<string, unknown>
      status?: ContentfulStatusCode
    } = {}
  ) {
    const { data, message = 'Success', meta, status = 200 } = options
    const response: BaseResponse = {
      success: true,
      message,
      data,
    }

    return c.json(response, status)
  }

  static error(
    c: Context,
    options: {
      status: ContentfulStatusCode
      message: string
    }
  ) {
    const { status, message } = options
    const response: BaseResponse = {
      success: false,
      message,
    }
    return c.json(response, status)
  }

  static validationError(
    c: Context,
    message = 'Validation failed'
  ) {
    return this.error(c, {
      status: 400,
      message,

    })
  }

  static notFound(c: Context, message = 'Resource not found') {
    return this.error(c, {
      status: 404,
      message
    })
  }

  static unauthorized(c: Context, message = 'Unauthorized') {
    return this.error(c, {
      status: 401,
      message
    })
  }

  static internalServerError(c: Context, message = 'Internal server error') {
    return this.error(c, {
      status: 500,
      message
    })
  }
}
