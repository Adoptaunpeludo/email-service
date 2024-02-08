import nodemailer, { Transporter } from 'nodemailer';

interface Options {
  email: string;
  verificationToken: string;
  type: string;
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

export class EmailService {
  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string,
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

    const link = `${this.webServiceUrl}/user/${endPoint}?token=${token}&email=${email}`;

    const html = `
        <h1>${title}</h1>
        <p>Por favor haz click en el siguiente link para ${action}</p>
        <a href="${link}">${title}</a>
    `;

    return { html, title };
  }

  private async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments: attachments = [] } = options;

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
      return false;
    }
  }
}
