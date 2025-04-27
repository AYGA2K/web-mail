import { z } from 'zod'

// Zod schema for email validation
export const EmailSchema = z.object({
  id: z.string().uuid().optional(),
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  createdAt: z.date().default(() => new Date()),
  isRead: z.boolean().default(false),
  userId: z.string().uuid()
})

export type Email = z.infer<typeof EmailSchema>

// In-memory database simulation 
const emails: Email[] = []

export const MailModel = {
  async create(email: Omit<Email, 'id' | 'createdAt' | 'isRead'>): Promise<Email> {
    const newEmail: Email = {
      ...email,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      isRead: false
    }
    emails.push(newEmail)
    return newEmail
  },

  async findByUser(userId: string): Promise<Email[]> {
    return emails.filter(e => e.userId === userId)
  },

  async findById(id: string, userId: string): Promise<Email | undefined> {
    return emails.find(e => e.id === id && e.userId === userId)
  },

  async markAsRead(id: string, userId: string): Promise<Email | undefined> {
    const email = emails.find(e => e.id === id && e.userId === userId)
    if (email) {
      email.isRead = true
    }
    return email
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const index = emails.findIndex(e => e.id === id && e.userId === userId)
    if (index !== -1) {
      emails.splice(index, 1)
      return true
    }
    return false
  }
}
