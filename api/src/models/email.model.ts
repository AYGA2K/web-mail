import { getDB } from '../database/db.js'
import type { CreateEmailMultipleRecipientsDto } from '../schemas/emails/request/create-multiple.schema.js';
import type { CreateEmailDto } from '../schemas/emails/request/create.schema.js';
import type { CreateEmailResponseDto } from '../schemas/emails/response/create.schema.js';
import type { listEmailResponseDto } from '../schemas/emails/response/list.schema.js';

export class MailModel {
  async create(createEmailDto: CreateEmailDto): Promise<CreateEmailResponseDto> {
    const db = getDB()
    const id = crypto.randomUUID()
    const created_at = new Date().toISOString()

    await db.insertInto('emails')
      .values({
        id,
        from: createEmailDto.from,
        to: createEmailDto.to,
        subject: createEmailDto.subject,
        body: createEmailDto.body,
        isRead: false,
        userId: createEmailDto.userId,
        created_at,
      })
      .execute()

    return { id, from: createEmailDto.from, to: createEmailDto.to, subject: createEmailDto.subject, body: createEmailDto.body, created_at, isRead: false, userId: createEmailDto.userId }
  }
  async createForMultipleRecipients(createEmailDto: CreateEmailMultipleRecipientsDto): Promise<CreateEmailResponseDto[]> {
    const db = getDB()
    const created_at = new Date()
    const results: CreateEmailResponseDto[] = []

    for (const recipient of createEmailDto.to) {
      const id = crypto.randomUUID()

      await db.insertInto('emails')
        .values({
          id,
          from: createEmailDto.from,
          to: recipient,
          subject: createEmailDto.subject,
          body: createEmailDto.body,
          isRead: false,
          userId: createEmailDto.userId,
          created_at,
        })
        .execute()

      results.push({
        id,
        from: createEmailDto.from,
        to: recipient,
        subject: createEmailDto.subject,
        body: createEmailDto.body,
        created_at,
        isRead: false,
        userId: createEmailDto.userId
      })
    }

    return results
  }

  async findByUser(userId: string): Promise<listEmailResponseDto[]> {
    const db = getDB()
    const emails = await db.selectFrom('emails')
      .selectAll()
      .where('userId', '=', userId)
      .execute()
    return emails
  }

  async findById(id: string, userId: string): Promise<listEmailResponseDto | undefined> {
    const db = getDB()
    const email = await db.selectFrom('emails')
      .selectAll()
      .where('id', '=', id)
      .where('userId', '=', userId)
      .executeTakeFirst()

    return email ?? undefined
  }

  async markAsRead(id: string, userId: string): Promise<listEmailResponseDto | undefined> {
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
