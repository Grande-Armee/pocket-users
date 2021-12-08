import { ConfigService, Joi } from '@grande-armee/pocket-common';

import { MongoConfig } from './types';

export const mongoConfigFactory = async (configService: ConfigService, joi: Joi): Promise<MongoConfig> => {
  return configService.validateConfig<MongoConfig>(
    (envVariables) => ({
      uri: envVariables.MONGODB_URI,
      appName: envVariables.APP_NAME,
    }),
    joi.object({
      uri: joi.string().uri().required(),
      appName: joi.string().required(),
    }),
  );
};
