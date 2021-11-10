import { Inject, Injectable } from '@nestjs/common';

import { Jwt, JWT } from '../../providers/jwt';
import { UserConfig, USER_CONFIG } from '../../providers/user-config';

@Injectable()
export class TokenService {
  public constructor(
    @Inject(JWT) private readonly jwt: Jwt,
    @Inject(USER_CONFIG) private readonly userConfig: UserConfig,
  ) {}

  public async signAccessToken(data: Record<string, string>): Promise<string> {
    const { secret, expiresIn } = this.userConfig.jwt;

    return this.jwt.sign(data, secret, { expiresIn });
  }

  public async verifyAccessToken<R>(token: string): Promise<R> {
    const data = this.jwt.verify(token, this.userConfig.jwt.secret) as R;

    return data;
  }
}
