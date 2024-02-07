import amqp from 'amqplib';
import 'dotenv/config';
import { EmailService } from './services/email.service';

interface Payload {
  email: string;
  verificationToken: string;
  type: string;
}

const queue = 'email-service';

(async () => {
  await main();
})();

async function main() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    const emailService = new EmailService(
      process.env.MAIL_SERVICE!,
      process.env.MAILER_EMAIL!,
      process.env.MAILER_SECRET_KEY!,
      process.env.WEBSERVICE_URL!
    );

    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(
      queue,
      (message) => {
        if (message) {
          const mail = JSON.parse(message.content.toString()) as Payload;

          emailService.sendEmailValidationLink(
            mail.email,
            mail.verificationToken,
            mail.type
          );

          console.log('[x] Email sent to ' + mail.email);
        }
      },
      { noAck: true }
    );

    console.log(' [*] Waiting for Emails. To exit press CTRL+C');
  } catch (error) {
    console.log(error);
  }
}
