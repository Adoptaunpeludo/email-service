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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const petChanged_1 = require("../templates/petChanged");
const chatMessages_1 = require("../templates/chatMessages");
const mailValidation_1 = require("../templates/mailValidation");
/**
 * Service for sending emails.
 */
class EmailService {
    constructor({ mailerService, mailerEmail, senderEmailPassword }, errorLogsService, webServiceUrl) {
        this.errorLogsService = errorLogsService;
        this.webServiceUrl = webServiceUrl;
        this.transporter = nodemailer_1.default.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: senderEmailPassword,
            },
        });
    }
    /**
     * Sends an email notification for unread chat messages.
     * @param options Options for sending unread chat message notification.
     * @returns A boolean indicating whether the email was sent successfully.
     */
    sendUnreadChatMessage({ chat, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = 'Tienes mensajes de chat sin leer';
            const endPoint = 'private/chat';
            const link = `${this.webServiceUrl}/${endPoint}/${chat}`;
            // const html = `
            //     <h1>${title}</h1>
            //     <p>Por favor haz click en el siguiente link para acceder al chat</p>
            //     <a href="${link}">${title}</a>
            // `;
            const html = (0, chatMessages_1.chatMessages)(link);
            const options = {
                to: email,
                subject: title,
                htmlBody: html,
            };
            const isSent = yield this.sendEmail(options);
            if (!isSent)
                return false;
            return true;
        });
    }
    /**
     * Sends a notification when an animal of interest changes.
     * @param options Options for sending animal changed notification.
     * @returns A boolean indicating whether the email was sent successfully.
     */
    sendAnimalChangedNotification({ link, email, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = 'Un animal de tus favoritos ha cambiado!';
            // const html = `
            //     <h1>${title}</h1>
            //     <p>Por favor haz click en el siguiente link para ver el animal</p>
            //     <a href=${this.webServiceUrl}/${link}>${title}</a>
            // `;
            const html = (0, petChanged_1.petChanged)(this.webServiceUrl, link);
            const options = {
                to: email,
                subject: title,
                htmlBody: html,
            };
            const isSent = yield this.sendEmail(options);
            if (!isSent)
                return false;
            return true;
        });
    }
    /**
     * Sends an email validation link.
     * @param options Options for sending email validation link.
     * @returns A boolean indicating whether the email was sent successfully.
     */
    sendEmailValidationLink({ email, verificationToken, type, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { html, title } = this.generateEmailContent(type, verificationToken, email);
            const options = {
                to: email,
                subject: title,
                htmlBody: html,
            };
            const isSent = yield this.sendEmail(options);
            if (!isSent)
                return false;
            return true;
        });
    }
    /**
     * Generates email content based on the type of email and token provided.
     * @param type The type of email (either 'email' or 'reset-password').
     * @param token The token to include in the email link.
     * @param email The recipient's email address.
     * @returns An object containing the HTML content of the email and its title.
     */
    generateEmailContent(type, token, email) {
        const endPoint = type === 'email' ? 'verify-email' : 'reset-password';
        const title = type === 'email' ? 'Valida tu Email' : 'Cambia tu password';
        const action = type === 'email' ? 'validar tu email' : 'cambiar tu password';
        const link = `${this.webServiceUrl}/${endPoint}/${token}`;
        // const html = `
        //     <h1>${title}</h1>
        //     <p>Por favor haz click en el siguiente link para ${action}</p>
        //     <a href="${link}">${title}</a>
        // `;
        const html = (0, mailValidation_1.mailValidation)(title, action, link);
        return { html, title };
    }
    /**
     * Sends an email based on the provided options.
     * @param options The options for sending the email.
     * @returns A boolean indicating whether the email was sent successfully.
     */
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { to, subject, htmlBody, attachments: attachments = [] } = options;
            if ((typeof to === 'string' && to === 'test@test.com') ||
                to.includes('test@test.com'))
                return false;
            try {
                const sentInformation = yield this.transporter.sendMail({
                    to: to,
                    subject: subject,
                    html: htmlBody,
                    attachments: attachments,
                });
                return true;
            }
            catch (error) {
                console.log({ error });
                this.errorLogsService.addMessageToQueue({
                    message: `Error sending email: ${error}`,
                    level: 'high',
                    origin: 'Email Service',
                }, 'error-logs');
                return false;
            }
        });
    }
}
exports.EmailService = EmailService;
