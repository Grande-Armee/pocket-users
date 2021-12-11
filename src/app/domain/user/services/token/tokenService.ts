import { Inject, Injectable } from '@nestjs/common';

import { config } from '@shared/config';

import { Jwt, JWT } from '../../providers/jwt';

@Injectable()
export class TokenService {
  public constructor(@Inject(JWT) private readonly jwt: Jwt) {}

  public async signAccessToken(data: Record<string, string>): Promise<string> {
    const { secret, expiresIn } = config.auth.jwt;

    return this.jwt.sign(data, secret, { expiresIn });
  }

  public async verifyAccessToken<R>(token: string): Promise<R> {
    const data = this.jwt.verify(token, config.auth.jwt.secret) as R;

    return data;
  }
}
