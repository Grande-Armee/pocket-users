export class InvalidEmailOrPasswordError extends Error {
  public constructor() {
    super(`Invalid email or password.`);
  }
}
