import { baseResponseSchema } from '../schemas/user/response.schema.js'
import type { OpenAPIConfigParams } from '../types/openapi-config-params.type.js'

export const buildOpenAPIRoute = ({
  name,
  method,
  path,
  summary,
  description,
  schema,
}: OpenAPIConfigParams) => {
  const config: any = {
    tags: [name],
    security: [{ Bearer: [] }],
    method,
    path,
    summary,
    responses: {
      default: {
        description,
        content: {
          'application/json': {
            schema: baseResponseSchema,
          },
        },
      },
    },
  }

  if (schema) {
    config.request = {
      body: {
        content: {
          'application/json': {
            schema,
          },
        },
      },
    }
  }

  return config
}
