import { z } from 'zod';
import 'zod-openapi/extend';

const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9.]{6,30}$/;

export const createUserSchema = z.object({
  first_name: z.string().openapi({
    example: 'John',
  }),
  last_name: z.string().openapi({
    example: 'Doe',
  }),
  user_name: z.string().regex(usernameRegex, {
    message: 'Username must be 6–30 characters, only lowercase letters, numbers, and periods; no spaces or consecutive periods; cannot start or end with a period.',
  }).openapi({
    example: 'john.doe123',
  }),
  password: z.string().min(8).openapi({
    example: 'password123',
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
