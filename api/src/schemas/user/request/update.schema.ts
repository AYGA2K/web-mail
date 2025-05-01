import { z } from 'zod';
import 'zod-openapi/extend';
export const updateUserSchema = z.object({
  email: z.string().email().optional().openapi({
    example: 'user@example.com',
  }),
  first_name: z.string().optional().openapi({
    example: 'John',
  }),
  last_name: z.string().optional().openapi({
    example: 'Doe',
  }),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
