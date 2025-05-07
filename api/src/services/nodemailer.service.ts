import nodemailer from 'nodemailer';

export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {

    this.transporter = nodemailer.createTransport({
      // host: 'smtp.example.com',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: 'your-email@example.com',
      //   pass: 'your-password'
      // },
      // For testing purposes, ethereal.email is used
      // It provides a fake SMTP service that doesn't actually send emails
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ashlee10@ethereal.email',
        pass: 'qdf4XhPXSAdWH5VMjP'
      }
    });
  }

  async sendEmail(
    from: string,
    to: string | string[],
    subject: string,
    body: string,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      // Send the email
      const info = await this.transporter.sendMail({
        from: from,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        text: body,
        // html: '<b>Hello world?</b>' 
      });

      console.log('Message sent: %s', info.messageId);

      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Verify the SMTP connection
  async verifyConnection(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.transporter.verify((error) => {
        if (error) {
          console.error('SMTP connection verification failed:', error);
          reject(false);
        } else {
          console.log('SMTP connection verified');
          resolve(true);
        }
      });
    });
  }

  // Close the SMTP connection pool
  close(): void {
    this.transporter.close();
  }
}
