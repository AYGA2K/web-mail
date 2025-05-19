import { baseResponseSchema } from "../schemas/response.schema.js";
import type { OpenAPIConfigParams } from "../types/openapi-config-params.type.js";

export const buildOpenAPIRoute = ({
  name,
  method,
  path,
  summary,
  description,
  schema,
  params,
}: OpenAPIConfigParams) => {
  const config: any = {
    tags: [name],
    // security: [{ Bearer: [] }],
    method,
    path,
    summary,
    responses: {
      default: {
        description,
        content: {
          "application/json": {
            schema: baseResponseSchema,
          },
        },
      },
    },
    params,
  };

  if (schema) {
    config.request = {
      body: {
        content: {
          "application/json": {
            schema,
          },
        },
      },
    };
  }
  if (params) {
    config.request = {
      params,
    };
  }

  return config;
};
