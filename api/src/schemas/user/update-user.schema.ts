import { z } from 'zod'
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
