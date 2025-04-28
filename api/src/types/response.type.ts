export interface ResponseData<T = undefined> {
  success: boolean
  data?: T
  error?: string
}
