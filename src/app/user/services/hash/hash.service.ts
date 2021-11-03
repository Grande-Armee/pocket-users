import { Inject, Injectable } from '@nestjs/common';

import { BCRYPT, Bcrypt } from '../../providers/bcrypt';

@Injectable()
export class HashService {
  public constructor(@Inject(BCRYPT) private readonly bcrypt: Bcrypt) {}

  public async hashPassword(plaintextPassword: string): Promise<string> {
    const salt = await this.generateSalt();
    const hashedPassword = await this.bcrypt.hash(plaintextPassword, salt);

    return hashedPassword;
  }

  public async comparePasswords(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      await this.bcrypt.compare(plaintextPassword, hashedPassword);

      return true;
    } catch {
      return false;
    }
  }

  public async generateSalt(): Promise<string> {
    // TODO: create config and get salt from env variable HASH_SALT_ROUNDS, has to be more than 12 and less than 20
    return this.bcrypt.genSalt(12);
  }
}
