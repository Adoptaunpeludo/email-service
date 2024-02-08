import amqp from 'amqplib';
import 'dotenv/config';
import { EmailService } from './services/email.service';
import { envs } from './config/envs';
import { ConsumerService } from './services/consumer.service';

const QUEUE = 'email-service';

(async () => {
  await main();
})();

async function main() {
  const emailService = new EmailService(
    envs.MAIL_SERVICE,
    envs.MAILER_EMAIL,
    envs.MAILER_SECRET_KEY,
    envs.WEBSERVICE_URL
  );

  const consumer = new ConsumerService(emailService, envs.RABBITMQ_URL, QUEUE);

  await consumer.consume();
}
