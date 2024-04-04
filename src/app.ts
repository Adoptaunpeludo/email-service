import amqp from 'amqplib';
import 'dotenv/config';
import { EmailService } from './services/email.service';
import { envs } from './config/envs';
import { ConsumerService } from './services/consumer.service';
import { QueueService } from './services/queue.service';

const VERIFY_QUEUE = 'verify-email';
const PASSWORD_QUEUE = 'change-password';
const NOTIFICATION_QUEUE = 'animal-changed-notification';
const CHAT_MESSAGE_QUEUE = 'chat-message';

(async () => {
  await main();
})();

async function main() {
  const errorLogsService = new QueueService(
    envs.RABBITMQ_URL,
    'error-notification'
  );

  const emailService = new EmailService(
    {
      mailerService: envs.MAIL_SERVICE,
      mailerEmail: envs.MAILER_EMAIL,
      senderEmailPassword: envs.MAILER_SECRET_KEY,
    },
    errorLogsService,
    envs.WEBSERVICE_URL
  );

  const verifyEmailConsumer = new ConsumerService(
    emailService,
    errorLogsService,
    envs.RABBITMQ_URL,
    VERIFY_QUEUE
  );

  await verifyEmailConsumer.consume();

  const animalChangedNotificationConsumer = new ConsumerService(
    emailService,
    errorLogsService,
    envs.RABBITMQ_URL,
    NOTIFICATION_QUEUE
  );

  await animalChangedNotificationConsumer.consume();

  const changePasswordConsumer = new ConsumerService(
    emailService,
    errorLogsService,
    envs.RABBITMQ_URL,
    PASSWORD_QUEUE
  );

  await changePasswordConsumer.consume();

  const unreadMessagesConsumer = new ConsumerService(
    emailService,
    errorLogsService,
    envs.RABBITMQ_URL,
    CHAT_MESSAGE_QUEUE
  );

  await unreadMessagesConsumer.consume();
}
