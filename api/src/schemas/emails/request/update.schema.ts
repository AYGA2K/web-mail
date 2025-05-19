import { z } from "zod";
import "zod-openapi/extend";

export const updateEmailSchema = z.object({
  from: z.string().email().openapi({
    example: "user@example.com",
  }),
  to: z.string().email().openapi({
    example: "user@example.com",
  }),
  subject: z.string().openapi({
    example: "Hello",
  }),
  body: z.string().openapi({
    example: "Hello",
  }),
  is_read: z.boolean().openapi({
    example: false,
  }),
});

export type UpdateEmailDto = z.infer<typeof updateEmailSchema>;
