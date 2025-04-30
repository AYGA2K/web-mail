
import { z } from 'zod';
import 'zod-openapi/extend';

// export const userResponseSchema = z.object({
//   id: z.string(),
//   email: z.string().email(),
//   first_name: z.string(),
//   last_name: z.string(),
//   created_at: z.date().nullable(),
//   updated_at: z.date().nullable(),
// })
export const createUserResponseSchema = z.object({
  id: z.string().openapi({
    example: 'clvq3yv4e000008l49y3f5q2a',
  }),
  email: z.string().email().openapi({
    example: 'user@example.com',
  }),
  first_name: z.string().openapi({
    example: 'John',
  }),
  last_name: z.string().openapi({
    example: 'Doe',
  }),
}).openapi({
  ref: 'UserResponse',
});

export type CreateUserResponseDto = z.infer<typeof createUserResponseSchema>
