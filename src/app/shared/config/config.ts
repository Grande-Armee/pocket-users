import { EnvParser } from '@grande-armee/pocket-common';

const envParser = new EnvParser();

const e = envParser.get.bind(envParser);

export const config = {
  appName: 'pocket-users',
  database: {
    uri: e('MONGODB_URI'),
  },
  broker: {
    uri: e('RABBITMQ_URI'),
  },
  logger: {
    prettifyLogs: Boolean(e('LOGGER_SHOULD_PRETTIFY_LOGS')),
    logLevel: e('LOGGER_LOG_LEVEL'),
  },
  auth: {
    jwt: {
      secret: e('AUTH_JWT_SECRET'),
      expiresIn: Number(e('AUTH_JWT_EXPIRES_IN')),
    },
  },
  encryption: {
    hashSaltRounds: Number(e('AUTH_HASH_SALT_ROUNDS')),
  },
};
