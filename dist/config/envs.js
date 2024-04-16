"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    //* Email Service
    MAIL_SERVICE: (0, env_var_1.get)('MAIL_SERVICE').required().asString(),
    MAILER_EMAIL: (0, env_var_1.get)('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: (0, env_var_1.get)('MAILER_SECRET_KEY').required().asString(),
    //* FRONTEND URL
    WEBSERVICE_URL: (0, env_var_1.get)('WEBSERVICE_URL').required().asString(),
    //* RABBITMQ
    RABBITMQ_USER: (0, env_var_1.get)('RABBITMQ_USER').required().asString(),
    RABBITMQ_PASS: (0, env_var_1.get)('RABBITMQ_PASS').required().asString(),
    RABBITMQ_URL: (0, env_var_1.get)('RABBITMQ_URL').required().asString(),
};
