export interface UserConfig {
  readonly hashSaltRounds: string;
  readonly jwt: JwtConfig;
}

interface JwtConfig {
  readonly jwtSecret: string;
  readonly jwtExpiresIn: number;
}
