export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  isRead: boolean;
  userId: string;
  replyTo: string | null;
  created_at: Date;
  updated_at: Date | null;
}
