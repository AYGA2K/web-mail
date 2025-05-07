export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  isRead: boolean;
  userId: string;
  created_at: string;
  updated_at: string | null;
}
