import { z } from "zod";
import "zod-openapi/extend";

export const updateUserResponseSchema = z
  .object({
    id: z.string().openapi({
      example: "clvq3yv4e000008l49y3f5q2a",
    }),
    email: z.string().email().openapi({
      example: "user@example.com",
    }),
    first_name: z.string().openapi({
      example: "John",
    }),
    last_name: z.string().openapi({
      example: "Doe",
    }),
    created_at: z.string().openapi({
      example: "2023-03-01T12:00:00.000Z",
    }),
    updated_at: z.string().openapi({
      example: "2023-03-01T12:00:00.000Z",
    }),
  })
  .openapi({
    ref: "UserResponse",
  });

export type UpdateUserResponseDto = z.infer<typeof updateUserResponseSchema>;
