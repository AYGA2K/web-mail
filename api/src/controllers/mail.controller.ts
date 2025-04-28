import type { Context } from "hono"
import { MailModel } from "../models/email.model.js"
import { UserModel } from "../models/user.model.js"

export class MailController {
  private mailModel: MailModel
  private userModel: UserModel

  constructor() {
    this.mailModel = new MailModel()
    this.userModel = new UserModel()
  }

  async send(c: Context) {
    const { from, to, subject, body, userId } = await c.req.json()

    try {
      // Ensure the sender user exists
      const user = await this.userModel.findByEmail(from)
      if (!user) {
        return c.json({ error: 'Sender not found' }, 404)
      }

      // Create new email
      const email = await this.mailModel.create({
        from,
        to,
        subject,
        body,
        userId
      })

      return c.json({ email }, 201)
    } catch (error) {
      return c.json({ error: 'Failed to send email' }, 400)
    }
  }

  async getEmails(c: Context) {
    const userId = c.req.param('userId')

    try {
      // Fetch all emails for the user
      const emails = await this.mailModel.findByUser(userId)

      return c.json({ emails })
    } catch (error) {
      return c.json({ error: 'Failed to retrieve emails' }, 400)
    }
  }

  async getEmail(c: Context) {
    const userId = c.req.param('userId')
    const emailId = c.req.param('emailId')

    try {
      // Fetch a specific email for the user
      const email = await this.mailModel.findById(emailId, userId)

      if (!email) {
        return c.json({ error: 'Email not found' }, 404)
      }

      return c.json({ email })
    } catch (error) {
      return c.json({ error: 'Failed to retrieve email' }, 400)
    }
  }

  async markAsRead(c: Context) {
    const userId = c.req.param('userId')
    const emailId = c.req.param('emailId')

    try {
      const email = await this.mailModel.markAsRead(emailId, userId)

      if (!email) {
        return c.json({ error: 'Email not found or already marked as read' }, 404)
      }

      return c.json({ email })
    } catch (error) {
      return c.json({ error: 'Failed to mark email as read' }, 400)
    }
  }

  async deleteEmail(c: Context) {
    const userId = c.req.param('userId')
    const emailId = c.req.param('emailId')

    try {
      const deleted = await this.mailModel.delete(emailId, userId)

      if (!deleted) {
        return c.json({ error: 'Email not found or already deleted' }, 404)
      }

      return c.json({ message: 'Email deleted successfully' })
    } catch (error) {
      return c.json({ error: 'Failed to delete email' }, 400)
    }
  }
}
