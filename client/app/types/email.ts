export interface Email {
  id: number;
  starred: boolean;
  read: boolean;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  labels: string[];
}