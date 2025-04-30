
export type OpenAPIConfigParams = {
  name: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  path: string
  summary: string
  description: string
  schema?: any
}
