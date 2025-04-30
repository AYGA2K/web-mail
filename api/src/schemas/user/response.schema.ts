import { z } from '@hono/zod-openapi'

export const baseResponseSchema = z.object({
  success: z.boolean().openapi({
    description: 'Indicates if the request was successful',
    example: true
  }),
  message: z.string().openapi({
    description: 'Human-readable message about the response',
    example: 'Operation completed successfully'
  }),
  data: z.any().optional().openapi({
    description: 'Response payload data'
  }),
})

export type BaseResponse = z.infer<typeof baseResponseSchema>
