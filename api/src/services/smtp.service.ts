import { SMTPServer } from 'smtp-server';
import { MailModel } from '../models/mail.model.js';
import { UserModel } from '../models/user.model.js';

export class SMTPService {
  private server: SMTPServer;
  private mailModel: MailModel;
  private userModel: UserModel;
  constructor() {
    this.mailModel = new MailModel();
    this.userModel = new UserModel();

    this.server = new SMTPServer({
      onConnect(session, callback) {
        console.log('New connection from:', session.remoteAddress);
        callback();
      },
      authOptional: false,
      secure: false,
      disabledCommands: ['STARTTLS'],
      onAuth: (auth, session, callback) => {
        this.handleAuth(auth, session, callback)
      },
      onMailFrom(address, session, callback) {
        console.log('MAIL FROM:', address.address);
        callback();
      },
      onData: (stream, session, callback) => {
        this.handleEmail(stream, session)
          .then(() => callback())
          .catch(err => callback(err));
      }
    });
  }
  private async handleAuth(auth: any, session: any, callback: Function) {
    const { username, password } = auth

    try {
      const email = username.includes('@') ? username : username + '@' + process.env.DOMAINE_NAME
      const user = await this.userModel.verifyCredentials(email, password)

      if (!user) {
        return callback(new Error('Invalid username or password'))
      }
      console.log('User authenticated:', user.email)
      session.user = user
      return callback(null, { user: user })
    } catch (error) {
      console.error('Auth error:', error)
      return callback(new Error('Authentication failed'))
    }
  }

  private async handleEmail(stream: NodeJS.ReadableStream, session: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let raw = ''
      stream.on('data', chunk => raw += chunk.toString())
      stream.on('end', async () => {
        try {
          const from = session.user.email
          const toList = session.envelope.rcptTo.map((r: any) => r.address)
          const subject = this.getHeader(raw, 'Subject')
          const body = this.getEmailBody(raw)

          const dto = {
            from,
            to: toList,
            subject,
            body,
            user_id: session.user.id,
          }

          const results = await this.mailModel.createForMultipleRecipients(dto)
          console.log(`Saved ${results.length} emails for user ${session.user.email}`)

          resolve()
        } catch (err) {
          reject(err)
        }
      })
      stream.on('error', reject)
    })
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
