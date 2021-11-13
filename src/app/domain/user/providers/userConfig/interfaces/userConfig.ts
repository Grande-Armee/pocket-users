import { JwtConfig } from './jwtConfig';

export interface UserConfig {
  readonly hashSaltRounds: number;
  readonly jwt: JwtConfig;
}
