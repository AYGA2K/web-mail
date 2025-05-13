import type { Context } from "hono"
import { MailModel } from "../models/email.model.js"
import { UserModel } from "../models/user.model.js"
import type { CreateEmailDto } from "../schemas/emails/request/create.schema.js"
import { ApiResponse } from "../utils/response.util.js"
import { NodemailerService } from "../services/nodemailer.service.js"

export class MailController {
  private mailModel: MailModel
  private userModel: UserModel
  private nodemailerService: NodemailerService

  constructor() {
    this.mailModel = new MailModel()
    this.userModel = new UserModel()
    this.nodemailerService = new NodemailerService()
  }

  async send(c: Context) {
    const createEmailDto: CreateEmailDto = await c.req.json()

    try {
      // Ensure the sender user exists
      const user = await this.userModel.findByEmail(createEmailDto.from)
      if (!user) {
        return ApiResponse.error(c, {
          status: 400,
          message: 'Sender user not found',
        })
      }

      // Test Sending emials to external domains
      await this.nodemailerService.sendEmail(
        createEmailDto.from,
        createEmailDto.to,
        createEmailDto.subject,
        createEmailDto.body
      )


      // Create new email
      const email = await this.mailModel.create(createEmailDto)


      return ApiResponse.success(c, {
        data: { email },
        message: 'Email sent successfully',
        status: 201
      })
    } catch (error) {
      return ApiResponse.error(c, {
        status: 400,
        message: 'Email sending failed',
      })
    }
  }

  async getEmailsByUser(c: Context) {
    const userId = c.req.param('userId')
    try {
      // Fetch all emails for the user
      const emails = await this.mailModel.findByUser(userId)

      return ApiResponse.success(c, {
        data: { emails },
        message: 'Emails retrieved successfully',
        status: 200
      })
    } catch (error) {
      return ApiResponse.error(c, {
        status: 400,
        message: 'Failed to retrieve emails',
      })
    }
  }

  async getInbox(c: Context) {
    const userId = c.req.param('userId');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');

    try {
      const emails = await this.mailModel.findWhere({
        conditions: [{ column: 'to', operator: '=', value: userId }],
        orderBy: [{ column: 'created_at', direction: 'desc' }],
        limit,
        offset: (page - 1) * limit
      });

      return ApiResponse.success(c, {
        data: { emails },
        message: 'Inbox emails retrieved successfully',
        status: 200
      });
    } catch (error) {
      return ApiResponse.error(c, {
        status: 400,
        message: 'Failed to retrieve inbox emails',
      });
    }
  }


  async getEmail(c: Context) {
    //  TODO: Grab the user ID from the JWT token
    const userId = c.req.param('userId')
    const emailId = c.req.param('emailId')

    try {
      // Fetch a specific email for the user
      const email = await this.mailModel.findById(emailId, userId)

      if (!email) {
        return ApiResponse.error(c, {
          status: 404,
          message: 'Email not found',
        })
      }

      return ApiResponse.success(c, {
        data: { email },
        message: 'Email retrieved successfully',
        status: 200
      })
    } catch (error) {
      return ApiResponse.error(c, {
        status: 400,
        message: 'Failed to retrieve email',
      })
    }
  }

  async markAsRead(c: Context) {
    const userId = c.req.param('userId')
    const emailId = c.req.param('emailId')

    try {
      const email = await this.mailModel.markAsRead(emailId, userId)

      if (!email) {
        return ApiResponse.error(c, {
          status: 404,
          message: 'Email not found',
        })
      }

      return c.json({ email })
    } catch (error) {
      return ApiResponse.error(c, {
        status: 400,
        message: 'Failed to mark email as read',
      })
    }
  }

  async deleteEmail(c: Context) {
    //  TODO: Grab the user ID from the JWT token
    const userId = c.req.param('userId')
    const emailId = c.req.param('emailId')

    try {
      const deleted = await this.mailModel.delete(emailId, userId)

      if (!deleted) {
        return ApiResponse.error(c, {
          status: 404,
          message: 'Email not found',
        })
      }

      return ApiResponse.success(c, {
        message: 'Email deleted successfully',
        status: 200
      })
    } catch (error) {
      return ApiResponse.error(c, {
        status: 400,
        message: 'Failed to delete email',
      })
    }
  }
}
