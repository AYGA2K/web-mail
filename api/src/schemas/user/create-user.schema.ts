import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  password: z.string().min(8),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
