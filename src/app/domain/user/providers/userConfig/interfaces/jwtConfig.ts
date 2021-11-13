export interface JwtConfig {
  readonly secret: string;
  readonly expiresIn: number;
}
