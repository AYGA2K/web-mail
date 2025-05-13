import { z } from 'zod';
import 'zod-openapi/extend';

export const listEmailResponseSchema = z.object({
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
  replyTo: z.string().nullable().optional().openapi({
    example: 'hdchw2dhdd092989218313131',
  }),
  created_at: z.string().nullable().openapi({
    example: '2023-03-01T12:00:00.000Z',
  }),
  updated_at: z.string().nullable().openapi({
    example: '2023-03-01T12:00:00.000Z',
  }),
})

export type listEmailResponseDto = z.infer<typeof listEmailResponseSchema>

