import { Inject, Injectable } from '@nestjs/common';

import { config } from '@shared/config';

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
    return this.bcrypt.compare(plaintextPassword, hashedPassword);
  }

  public async generateSalt(): Promise<string> {
    return this.bcrypt.genSalt(config.encryption.hashSaltRounds);
  }
}
