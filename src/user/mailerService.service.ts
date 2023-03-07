import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'mosscmoi@gmail.com',
        pass: 'aiywtoueicetjzga',
      },
    });
  }

  async sendMail({ to, subject, context }): Promise<void> {
    const html = await this.renderTemplate(context);
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  }

  private async renderTemplate(context: any): Promise<string> {
    return `Merci pour changer votre mot du passe le noveau mot du passe est ${context.password}`;
  }
}
