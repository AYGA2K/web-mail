export interface User {
  id: string
  email: string
  user_name: string
  first_name: string
  last_name: string
  password: string
  created_at: Date;
  updated_at: Date | null;
}
