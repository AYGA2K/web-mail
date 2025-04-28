export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  userId: string;
}
