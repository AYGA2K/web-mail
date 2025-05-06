import { SMTPServer } from 'smtp-server';
import { MailModel } from '../models/email.model.js';

export class SMTPService {
  private server: SMTPServer;
  private mailModel: MailModel;
  constructor() {
    this.mailModel = new MailModel();

    this.server = new SMTPServer({
      onConnect(session, callback) {
        console.log('New connection from:', session.remoteAddress);
        callback();
      },
      onMailFrom(address, session, callback) {
        console.log('MAIL FROM:', address.address);
        callback();
      },
      authOptional: true,
      onData: (stream, session, callback) => {
        this.handleEmail(stream, session)
          .then(() => callback())
          .catch(err => callback(err));
      }
    });
  }

  private async handleEmail(stream: NodeJS.ReadableStream, session: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let email = '';
      stream.on('data', (chunk) => email += chunk.toString());
      stream.on('end', async () => {
        try {
          console.log('From:', session.envelope.mailFrom?.address);
          console.log('To:', session.envelope.rcptTo.map((r: any) => r.address)[0]);
          console.log('Subject:', this.getHeader(email, 'Subject'));
          console.log('Body:', this.getEmailBody(email));
          await this.mailModel.create({
            from: session.envelope.mailFrom?.address || 'unknown@example.com',
            to: session.envelope.rcptTo.map((r: any) => r.address),
            subject: this.getHeader(email, 'Subject'),
            body: this.getEmailBody(email),
            isRead: false,
            userId: "aa3f70ca-d78e-4d6f-a773-0339bdcd526d"
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      stream.on('error', reject);
    });
  }

  private getHeader(email: string, header: string): string {
    const regex = new RegExp(`^${header}:\\s*(.*)$`, 'm');
    const match = email.match(regex);
    return match ? match[1].trim() : '';
  }

  private getEmailBody(email: string): string {
    return email.split('\n\n').slice(1).join('\n\n');
  }

  start(port: number = 3025) {
    this.server.listen(port);
    console.log(`SMTP server running on port ${port}`);
  }

  stop() {
    this.server.close();
  }
}
