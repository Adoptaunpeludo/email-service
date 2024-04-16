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
exports.QueueService = void 0;
const amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
/**
 * ProducerService class for sending messages to RabbitMQ queues.
 */
class QueueService {
    /**
     * Constructs an instance of ProducerService.
     * @param rabbitmqUrl - URL of the RabbitMQ server.
     * @param exchange - Name of the exchange to publish messages.
     */
    constructor(rabbitmqUrl, exchange) {
        this.rabbitmqUrl = rabbitmqUrl;
        this.exchange = exchange;
        // Establishes connection to RabbitMQ server and creates a channel wrapper.
        const connection = amqp_connection_manager_1.default.connect(this.rabbitmqUrl);
        this.channelWrapper = connection.createChannel({
            // Ensures the exchange is declared upon channel creation.
            setup: (channel) => {
                return channel.assertExchange(this.exchange, 'direct', {
                    durable: true,
                });
            },
        });
        console.log(`${this.exchange} exchange created`);
    }
    /**
     * Adds a message to the specified queue in the exchange.
     * @param payload - Data to be sent in the message.
     * @param queue - Name of the queue to send the message.
     */
    addMessageToQueue(payload, queue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ payload, queue });
                // Publishes the message to the specified queue in the exchange.
                yield this.channelWrapper.publish('email-request', queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
                console.log('Message sent to queue');
            }
            catch (error) {
                console.log('Error sending message to queue', error);
            }
        });
    }
}
exports.QueueService = QueueService;
