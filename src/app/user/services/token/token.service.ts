import { Inject, Injectable } from '@nestjs/common';

import { Jwt, JWT } from '../../providers/jwt';

@Injectable()
export class TokenService {
  public constructor(@Inject(JWT) private readonly jwt: Jwt) {}

  public async signAccessToken(data: Record<string, string>): Promise<string> {
    // TODO: get secret from config, has to be at least 24 char long
    // JWT_SECRET=asdjaslkdjasda
    // JWT_EXPIRES_IN_SECONDS=86400 # 1 day

    return this.jwt.sign(data, 'SECRET', {
      expiresIn: 86400,
    });
  }

  public async verifyAccessToken<R>(token: string): Promise<R> {
    const data = this.jwt.verify(token, 'SECRET') as R;

    return data;
  }
}
