import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { EmailService } from './email.service';
import { ConfirmChannel } from 'amqplib';

interface Message {
  email: string;
  verificationToken: string;
  type: string;
}

export class ConsumerService {
  private channelWrapper: ChannelWrapper;
  constructor(
    private emailService: EmailService,
    private readonly rabbitmqUrl: string,
    private readonly queue: string
  ) {
    const connection = amqp.connect(this.rabbitmqUrl);
    this.channelWrapper = connection.createChannel();
  }

  public async consume() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queue, { durable: true });
        await channel.consume(this.queue, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString()) as Message;
            console.log('Received message: ', content);
            await this.emailService.sendEmailValidationLink(content);
            channel.ack(message);
          }
        });
      });
      console.log('Consumer service started and listening for messages');
    } catch (err) {
      console.log('Error starting the consumer: ', err);
    }
  }
}
