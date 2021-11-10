export interface UserConfig {
  readonly hashSaltRounds: number;
  readonly jwt: JwtConfig;
}

interface JwtConfig {
  readonly secret: string;
  readonly expiresIn: number;
}
