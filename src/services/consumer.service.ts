import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { EmailService } from './email.service';
import { ConfirmChannel } from 'amqplib';

export class ConsumerService {
  private channelWrapper: ChannelWrapper | undefined = undefined;
  private EXCHANGE: string;
  constructor(
    private emailService: EmailService,
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

  public async consume() {
    try {
      await this.channelWrapper!.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queue, { durable: true });
        await channel.bindQueue(this.queue, this.EXCHANGE, this.queue);
        await channel.consume(this.queue, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());

            switch (this.queue) {
              case 'animal-changed-notification': {
                const { email, ...changes } = content;
                await this.emailService.sendAnimalChangedNotification({
                  changes,
                  email,
                });
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
    }
  }
}
