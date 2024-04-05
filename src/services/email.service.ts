import nodemailer, { Transporter } from 'nodemailer';
import { QueueService } from './queue.service';

interface Options {
  email: string;
  verificationToken: string;
  type: string;
}

interface NotificationOptions {
  link: string;
  email: string;
}

interface UnreadMessageOptions {
  chat: string;
  email: string;
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

interface ServiceOptions {
  mailerService: string;
  mailerEmail: string;
  senderEmailPassword: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    { mailerService, mailerEmail, senderEmailPassword }: ServiceOptions,
    private readonly errorLogsService: QueueService,
    private readonly webServiceUrl?: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      },
    });
  }

  public async sendUnreadChatMessage({ chat, email }: UnreadMessageOptions) {
    const title = 'Tienes mensajes de chat sin leer';
    const endPoint = 'private/chat';
    const link = `${this.webServiceUrl}/${endPoint}/${chat}`;

    const html = `
        <h1>${title}</h1>
        <p>Por favor haz click en el siguiente link para acceder al chat</p>
        <a href="${link}">${title}</a>
    `;

    const options = {
      to: email,
      subject: title,
      htmlBody: html,
    };

    const isSent = await this.sendEmail(options);

    if (!isSent) return false;

    return true;
  }

  public async sendAnimalChangedNotification({
    link,
    email,
  }: NotificationOptions) {
    const title = 'Un animal de tus favoritos ha cambiado!';

    const html = `
        <h1>${title}</h1>
        <p>Por favor haz click en el siguiente link para ver el animal</p>
        <a href=${this.webServiceUrl}/${link}>${title}</a>
    `;

    const options = {
      to: email,
      subject: title,
      htmlBody: html,
    };

    const isSent = await this.sendEmail(options);

    if (!isSent) return false;

    return true;
  }

  public async sendEmailValidationLink({
    email,
    verificationToken,
    type,
  }: Options) {
    const { html, title } = this.generateEmailContent(
      type,
      verificationToken,
      email
    );

    const options = {
      to: email,
      subject: title,
      htmlBody: html,
    };

    const isSent = await this.sendEmail(options);

    if (!isSent) return false;

    return true;
  }

  private generateEmailContent(type: string, token: string, email: string) {
    const endPoint = type === 'email' ? 'verify-email' : 'reset-password';
    const title = type === 'email' ? 'Valida tu Email' : 'Cambia tu password';
    const action =
      type === 'email' ? 'validar tu email' : 'cambiar tu password';

    const link = `${this.webServiceUrl}/${endPoint}/${token}`;

    const html = `
        <h1>${title}</h1>
        <p>Por favor haz click en el siguiente link para ${action}</p>
        <a href="${link}">${title}</a>
    `;

    return { html, title };
  }

  private async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments: attachments = [] } = options;

    if (
      (typeof to === 'string' && to === 'test@test.com') ||
      to.includes('test@test.com')
    )
      return false;

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      return true;
    } catch (error) {
      console.log({ error });
      this.errorLogsService.addMessageToQueue(
        {
          message: `Error sending email: ${error}`,

          level: 'high',
          origin: 'Email Service',
        },
        'error-logs'
      );
      return false;
    }
  }
}
