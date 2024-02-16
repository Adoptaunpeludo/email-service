import amqp from 'amqplib';
import 'dotenv/config';
import { EmailService } from './services/email.service';
import { envs } from './config/envs';
import { ConsumerService } from './services/consumer.service';

const VERIFY_QUEUE = 'verify-email';
const PASSWORD_QUEUE = 'change-password';
const NOTIFICATION_QUEUE = 'animal-changed-notification';

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

  const verifyEmailConsumer = new ConsumerService(
    emailService,
    envs.RABBITMQ_URL,
    VERIFY_QUEUE
  );

  await verifyEmailConsumer.consume();

  const animalChangedNotificationConsumer = new ConsumerService(
    emailService,
    envs.RABBITMQ_URL,
    NOTIFICATION_QUEUE
  );

  await animalChangedNotificationConsumer.consume();

  const changePasswordConsumer = new ConsumerService(
    emailService,
    envs.RABBITMQ_URL,
    PASSWORD_QUEUE
  );

  await changePasswordConsumer.consume();
}
