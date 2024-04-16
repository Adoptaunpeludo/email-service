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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const email_service_1 = require("./services/email.service");
const envs_1 = require("./config/envs");
const consumer_service_1 = require("./services/consumer.service");
const queue_service_1 = require("./services/queue.service");
const VERIFY_QUEUE = 'verify-email';
const PASSWORD_QUEUE = 'change-password';
const NOTIFICATION_QUEUE = 'animal-changed-notification';
const CHAT_MESSAGE_QUEUE = 'chat-message';
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield main();
}))();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const errorLogsService = new queue_service_1.QueueService(envs_1.envs.RABBITMQ_URL, 'error-notification');
        const emailService = new email_service_1.EmailService({
            mailerService: envs_1.envs.MAIL_SERVICE,
            mailerEmail: envs_1.envs.MAILER_EMAIL,
            senderEmailPassword: envs_1.envs.MAILER_SECRET_KEY,
        }, errorLogsService, envs_1.envs.WEBSERVICE_URL);
        const verifyEmailConsumer = new consumer_service_1.ConsumerService(emailService, errorLogsService, envs_1.envs.RABBITMQ_URL, VERIFY_QUEUE);
        yield verifyEmailConsumer.consume();
        const animalChangedNotificationConsumer = new consumer_service_1.ConsumerService(emailService, errorLogsService, envs_1.envs.RABBITMQ_URL, NOTIFICATION_QUEUE);
        yield animalChangedNotificationConsumer.consume();
        const changePasswordConsumer = new consumer_service_1.ConsumerService(emailService, errorLogsService, envs_1.envs.RABBITMQ_URL, PASSWORD_QUEUE);
        yield changePasswordConsumer.consume();
        const unreadMessagesConsumer = new consumer_service_1.ConsumerService(emailService, errorLogsService, envs_1.envs.RABBITMQ_URL, CHAT_MESSAGE_QUEUE);
        yield unreadMessagesConsumer.consume();
    });
}
