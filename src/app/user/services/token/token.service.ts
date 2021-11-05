import { Inject, Injectable } from '@nestjs/common';

import { Jwt, JWT } from '../../providers/jwt';
import { UserConfig, USER_CONFIG } from '../../user-config';

@Injectable()
export class TokenService {
  public constructor(
    @Inject(JWT) private readonly jwt: Jwt,
    @Inject(USER_CONFIG) private readonly userConfig: UserConfig,
  ) {}

  public async signAccessToken(data: Record<string, string>): Promise<string> {
    return this.jwt.sign(data, this.userConfig.jwt.secret, {
      expiresIn: this.userConfig.jwt.expiresIn,
    });
  }

  public async verifyAccessToken<R>(token: string): Promise<R> {
    const data = this.jwt.verify(token, this.userConfig.jwt.secret) as R;

    return data;
  }
}
