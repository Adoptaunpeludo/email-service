"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerService = void 0;
const amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
/**
 * Creates an instance of ConsumerService.
 * @param emailService The email service used to send emails.
 * @param errorLogsService The queue service used to log error messages.
 * @param rabbitmqUrl The URL of the RabbitMQ server.
 * @param queue The name of the queue to consume messages from.
 */
class ConsumerService {
    constructor(emailService, errorLogsService, rabbitmqUrl, queue) {
        this.emailService = emailService;
        this.errorLogsService = errorLogsService;
        this.rabbitmqUrl = rabbitmqUrl;
        this.queue = queue;
        this.channelWrapper = undefined;
        this.EXCHANGE = 'email-request';
        try {
            const connection = amqp_connection_manager_1.default.connect(this.rabbitmqUrl);
            this.channelWrapper = connection.createChannel();
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * Starts consuming messages from the specified queue.
     */
    consume() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.channelWrapper.addSetup((channel) => __awaiter(this, void 0, void 0, function* () {
                    yield channel.assertQueue(this.queue, { durable: true });
                    yield channel.bindQueue(this.queue, this.EXCHANGE, this.queue);
                    yield channel.consume(this.queue, (message) => __awaiter(this, void 0, void 0, function* () {
                        if (message) {
                            const content = JSON.parse(message.content.toString());
                            switch (this.queue) {
                                case 'animal-changed-notification': {
                                    yield this.emailService.sendAnimalChangedNotification(content);
                                    break;
                                }
                                case 'verify-email': {
                                    yield this.emailService.sendEmailValidationLink(content);
                                    break;
                                }
                                case 'change-password': {
                                    yield this.emailService.sendEmailValidationLink(content);
                                    break;
                                }
                                case 'chat-message': {
                                    yield this.emailService.sendUnreadChatMessage(content);
                                }
                                default: {
                                    ('Unknown queue');
                                }
                            }
                            channel.ack(message);
                        }
                    }));
                }));
                console.log(`${this.queue} consumer service started and listening for messages`);
            }
            catch (err) {
                console.log('Error starting the consumer: ', err);
                this.errorLogsService.addMessageToQueue({
                    message: `Error starting the ${this.queue} consumer: ${err}`,
                    level: 'high',
                    origin: 'WebSocket Server',
                }, 'error-logs');
            }
        });
    }
}
exports.ConsumerService = ConsumerService;
