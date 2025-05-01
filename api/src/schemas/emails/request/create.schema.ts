import { z } from 'zod';
import 'zod-openapi/extend';

export const createEmailSchema = z.object({
  from: z.string().email().openapi({
    example: 'user@example.com',
  }),
  to: z.string().email().openapi({
    example: 'user@example.com',
  }),
  subject: z.string().openapi({
    example: 'Hello',
  }),
  body: z.string().openapi({
    example: 'Hello',
  }),
  isRead: z.boolean().openapi({
    example: false,
  }),
  userId: z.string().openapi({
    example: 'clvq3yv4e000008l49y3f5q2a',
  }),
})

export type CreateEmailDto = z.infer<typeof createEmailSchema>

