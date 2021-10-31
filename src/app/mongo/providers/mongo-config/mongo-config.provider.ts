import { ConfigService, Joi, JOI_TOKEN } from '@grande-armee/pocket-common';
import { Provider } from '@nestjs/common';

import { MongoConfig } from './interfaces/mongo-config.interface';

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

export const mongoConfigProvider: Partial<Provider> = {
  useFactory: mongoConfigFactory,
  inject: [ConfigService, JOI_TOKEN],
};
