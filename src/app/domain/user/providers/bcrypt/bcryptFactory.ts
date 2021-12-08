import bcrypt from 'bcrypt';

import { Bcrypt } from './types';

export const bcryptFactory = async (): Promise<Bcrypt> => {
  return bcrypt;
};
