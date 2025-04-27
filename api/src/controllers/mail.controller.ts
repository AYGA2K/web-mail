import type { Context } from 'hono'
import { MailModel } from '../models/mail.model.js'
import { UserModel } from '../models/user.model.js'

export class MailController {
  static async sendEmail(c: Context) {
    const body = await c.req.json()
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = UserModel.verifyToken(token)

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    try {
      const emailData = {
        from: user.email,
        to: body.to,
        subject: body.subject,
        body: body.body,
        userId: user.userId
      }

      const newEmail = await MailModel.create(emailData)
      return c.json(newEmail, 201)
    } catch (error) {
      return c.json({ error: 'Failed to send email' }, 400)
    }
  }

  static async getInbox(c: Context) {
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = UserModel.verifyToken(token)

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const emails = await MailModel.findByUser(user.userId)
    return c.json(emails)
  }

  static async getEmail(c: Context) {
    const id = c.req.param('id')
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = UserModel.verifyToken(token)

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const email = await MailModel.findById(id, user.userId)
    if (!email) {
      return c.json({ error: 'Email not found' }, 404)
    }

    // Mark as read when fetched
    await MailModel.markAsRead(id, user.userId)
    return c.json(email)
  }

  static async deleteEmail(c: Context) {
    const id = c.req.param('id')
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const user = UserModel.verifyToken(token)

    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const success = await MailModel.delete(id, user.userId)
    if (!success) {
      return c.json({ error: 'Email not found' }, 404)
    }

    return c.json({ message: 'Email deleted successfully' })
  }
}
