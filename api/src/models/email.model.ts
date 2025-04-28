import { getDB } from '../database/db.js'
import type { Email } from '../entities/mail.entity.js';

export class MailModel {
  async create({ from, to, subject, body, userId }: { from: string; to: string; subject: string; body: string; userId: string }): Promise<Email> {
    const db = getDB()
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()

    await db.insertInto('emails')
      .values({
        id,
        from,
        to,
        subject,
        body,
        createdAt,
        isRead: false,
        userId
      })
      .execute()

    return { id, from, to, subject, body, createdAt, isRead: false, userId }
  }

  async findByUser(userId: string): Promise<Email[]> {
    const db = getDB()
    const emails = await db.selectFrom('emails')
      .selectAll()
      .where('userId', '=', userId)
      .execute()

    return emails
  }

  async findById(id: string, userId: string): Promise<Email | undefined> {
    const db = getDB()
    const email = await db.selectFrom('emails')
      .selectAll()
      .where('id', '=', id)
      .where('userId', '=', userId)
      .executeTakeFirst()

    return email ?? undefined
  }

  async markAsRead(id: string, userId: string): Promise<Email | undefined> {
    const db = getDB()
    const email = await db.selectFrom('emails')
      .selectAll()
      .where('id', '=', id)
      .where('userId', '=', userId)
      .executeTakeFirst()

    if (email) {
      await db.updateTable('emails')
        .set({ isRead: true })
        .where('id', '=', id)
        .where('userId', '=', userId)
        .execute()

      email.isRead = true
      return email
    }

    return undefined
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const db = getDB()
    const result = await db.deleteFrom('emails')
      .where('id', '=', id)
      .where('userId', '=', userId)
      .execute()

    return result.length > 0
  }
}
