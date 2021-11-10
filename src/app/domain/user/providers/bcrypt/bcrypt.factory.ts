import bcrypt from 'bcrypt';

import { Bcrypt } from './interfaces';

export const bcryptFactory = async (): Promise<Bcrypt> => {
  return bcrypt;
};
