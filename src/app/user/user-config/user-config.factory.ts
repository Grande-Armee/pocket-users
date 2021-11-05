import { ConfigService, Joi } from '@grande-armee/pocket-common';

import { UserConfig } from './interfaces';

export const userConfigFactory = async (configService: ConfigService, joi: Joi): Promise<UserConfig> => {
  return configService.validateConfig<UserConfig>(
    (envVariables) => ({
      hashSaltRounds: envVariables.AUTH_HASH_SALT_ROUNDS,
      jwt: {
        jwtSecret: envVariables.AUTH_JWT_SECRET,
        jwtExpiresIn: envVariables.AUTH_JWT_EXPIRES_IN,
      },
    }),
    joi.object({
      hashSaltRounds: joi.string().min(12).max(20).required(),
      jwt: {
        jwtSecret: joi.string().min(24).required(),
        jwtExpiresIn: joi.number().required(),
      },
    }),
  );
};
