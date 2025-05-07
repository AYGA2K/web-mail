import { z } from 'zod';
import 'zod-openapi/extend';

export const updateEmailResponseSchema = z.object({
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
  created_at: z.string().openapi({
    example: '2023-03-01T12:00:00.000Z',
  }),
  updated_at: z.string().openapi({
    example: '2023-03-01T12:00:00.000Z',
  }),
})

export type updateEmailResponseDto = z.infer<typeof updateEmailResponseSchema>

