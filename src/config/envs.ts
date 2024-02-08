import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  //* Email Service
  MAIL_SERVICE: get('MAIL_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  //* FRONTEND URL
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),

  //* RABBITMQ
  RABBITMQ_USER: get('RABBITMQ_USER').required().asString(),
  RABBITMQ_PASS: get('RABBITMQ_PASS').required().asString(),
  RABBITMQ_URL: get('RABBITMQ_URL').required().asString(),
};
