import { internet, helpers } from 'faker';

export class UserTestFactory {
  public static createEmail(): string {
    return internet.email();
  }

  public static createPassword(): string {
    return internet.password(24);
  }

  public static createLanguage(): string {
    return helpers.randomize(['en']);
  }

  public static createRole(): string {
    return 'USER';
  }
}
