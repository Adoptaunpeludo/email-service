import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { EmailService } from './email.service';
import { ConfirmChannel } from 'amqplib';
import { QueueService } from './queue.service';

/**
 * Creates an instance of ConsumerService.
 * @param emailService The email service used to send emails.
 * @param errorLogsService The queue service used to log error messages.
 * @param rabbitmqUrl The URL of the RabbitMQ server.
 * @param queue The name of the queue to consume messages from.
 */
export class ConsumerService {
  private channelWrapper: ChannelWrapper | undefined = undefined;
  private EXCHANGE: string;
  constructor(
    private emailService: EmailService,
    private errorLogsService: QueueService,
    private readonly rabbitmqUrl: string,
    private readonly queue: string
  ) {
    this.EXCHANGE = 'email-request';
    try {
      const connection = amqp.connect(this.rabbitmqUrl);
      this.channelWrapper = connection.createChannel();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Starts consuming messages from the specified queue.
   */
  public async consume() {
    try {
      await this.channelWrapper!.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queue, { durable: true });
        await channel.bindQueue(this.queue, this.EXCHANGE, this.queue);
        await channel.consume(this.queue, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());

            switch (this.queue) {
              case 'animal-changed': {
                console.log({ content });
                await this.emailService.sendAnimalChangedNotification(content);
                break;
              }
              case 'verify-email': {
                await this.emailService.sendEmailValidationLink(content);
                break;
              }
              case 'change-password': {
                await this.emailService.sendEmailValidationLink(content);
                break;
              }
              case 'chat-message': {
                await this.emailService.sendUnreadChatMessage(content);
              }
              default: {
                ('Unknown queue');
              }
            }
            channel.ack(message);
          }
        });
      });
      console.log(
        `${this.queue} consumer service started and listening for messages`
      );
    } catch (err) {
      console.log('Error starting the consumer: ', err);
      this.errorLogsService.addMessageToQueue(
        {
          message: `Error starting the ${this.queue} consumer: ${err}`,

          level: 'high',
          origin: 'WebSocket Server',
        },
        'error-logs'
      );
    }
  }
}
