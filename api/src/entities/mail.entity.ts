type Bit = 0 | 1
export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  is_read: Bit;
  user_id: string;
  reply_to: string | null;
  created_at: string;
  updated_at: string | null;
}
