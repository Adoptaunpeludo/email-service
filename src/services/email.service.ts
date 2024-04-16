import nodemailer, { Transporter } from 'nodemailer';
import { QueueService } from './queue.service';
import { petChanged } from '../templates/petChanged';
import { chatMessages } from '../templates/chatMessages';
import { mailValidation } from '../templates/mailValidation';

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

/**
 * Service for sending emails.
 */
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

  /**
   * Sends an email notification for unread chat messages.
   * @param options Options for sending unread chat message notification.
   * @returns A boolean indicating whether the email was sent successfully.
   */
  public async sendUnreadChatMessage({ chat, email }: UnreadMessageOptions) {
    const title = 'Tienes mensajes de chat sin leer';
    const endPoint = 'private/chat';
    const link = `${this.webServiceUrl}/${endPoint}/${chat}`;

    // const html = `
    //     <h1>${title}</h1>
    //     <p>Por favor haz click en el siguiente link para acceder al chat</p>
    //     <a href="${link}">${title}</a>
    // `;

    const html = chatMessages(link);

    const options = {
      to: email,
      subject: title,
      htmlBody: html,
    };

    const isSent = await this.sendEmail(options);

    if (!isSent) return false;

    return true;
  }

  /**
   * Sends a notification when an animal of interest changes.
   * @param options Options for sending animal changed notification.
   * @returns A boolean indicating whether the email was sent successfully.
   */
  public async sendAnimalChangedNotification({
    link,
    email,
  }: NotificationOptions) {
    const title = 'Un animal de tus favoritos ha cambiado!';

    // const html = `
    //     <h1>${title}</h1>
    //     <p>Por favor haz click en el siguiente link para ver el animal</p>
    //     <a href=${this.webServiceUrl}/${link}>${title}</a>
    // `;

    const html = petChanged(this.webServiceUrl!, link);

    const options = {
      to: email,
      subject: title,
      htmlBody: html,
    };

    const isSent = await this.sendEmail(options);

    if (!isSent) return false;

    return true;
  }

  /**
   * Sends an email validation link.
   * @param options Options for sending email validation link.
   * @returns A boolean indicating whether the email was sent successfully.
   */
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

  /**
   * Generates email content based on the type of email and token provided.
   * @param type The type of email (either 'email' or 'reset-password').
   * @param token The token to include in the email link.
   * @param email The recipient's email address.
   * @returns An object containing the HTML content of the email and its title.
   */
  private generateEmailContent(type: string, token: string, email: string) {
    const endPoint = type === 'email' ? 'verify-email' : 'reset-password';
    const title = type === 'email' ? 'Valida tu Email' : 'Cambia tu password';
    const action =
      type === 'email' ? 'validar tu email' : 'cambiar tu password';

    const link = `${this.webServiceUrl}/${endPoint}/${token}`;

    // const html = `
    //     <h1>${title}</h1>
    //     <p>Por favor haz click en el siguiente link para ${action}</p>
    //     <a href="${link}">${title}</a>
    // `;
    const html = mailValidation(title, action, link);

    return { html, title };
  }

  /**
   * Sends an email based on the provided options.
   * @param options The options for sending the email.
   * @returns A boolean indicating whether the email was sent successfully.
   */
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
