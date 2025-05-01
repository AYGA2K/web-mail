import { z } from 'zod';
import 'zod-openapi/extend';

export const createUserSchema = z.object({
  email: z.string().email().openapi({
    example: 'user@example.com',
  }),
  first_name: z.string().openapi({
    example: 'John',
  }),
  last_name: z.string().openapi({
    example: 'Doe',
  }),
  password: z.string().min(8).openapi({
    example: 'password123',
  }),
})

export type CreateUserDto = z.infer<typeof createUserSchema>

