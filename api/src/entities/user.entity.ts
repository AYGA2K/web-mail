export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  password: string
  created_at: Date | null;
  updated_at: Date | null;
}
