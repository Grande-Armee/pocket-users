import { TestingModule } from '@nestjs/testing';

import { MongoHelper } from '../../../../integration-tests/helpers/mongo/mongo.helper';
import { TestModuleHelper } from '../../../../integration-tests/helpers/test-module/test-module.helper';
import { UserRepository } from '../../repositories/user/user.repository';
import { UserTestFactory } from '../../tests-factories/user.factory';
import { UserService } from './user.service';

describe('UserService', () => {
  let testingModule: TestingModule;
  let mongoHelper: MongoHelper;

  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    mongoHelper = new MongoHelper(testingModule);

    userService = testingModule.get(UserService);
    userRepository = testingModule.get(UserRepository);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  it('creates a user in the database', async () => {
    await mongoHelper.runInTestTransaction(async (session) => {
      const email = UserTestFactory.createEmail();
      const password = UserTestFactory.createPassword();
      const language = UserTestFactory.createLanguage();

      /* Create the user using interface under test */
      const userDTO = await userService.createUser({
        email,
        password,
        language,
      });

      expect(userDTO.email).toBe(email);
      expect(userDTO.password).not.toBe(password);
      expect(userDTO.language).toBe(language);

      /* Assert user is now present in the database */
      const user = await userRepository.findUserById(session, userDTO.id);

      expect(user).not.toBe(null);
      expect(user?.password).not.toBe(password); // not hashed
      expect(user?.email).toBe(email);
    });
  });

  it('finds a user in the database', async () => {
    await mongoHelper.runInTestTransaction(async (session) => {
      const email = UserTestFactory.createEmail();
      const password = UserTestFactory.createPassword();

      /* Create the user using a tested interface */
      const userDTO = await userRepository.createUser(session, {
        email,
        password,
      });

      /* Find user using the interface under test */
      const user = await userService.findUser(userDTO.id);

      expect(user).not.toBe(null);
    });
  });

  it('updates user data in the database', async () => {
    await mongoHelper.runInTestTransaction(async (session) => {
      const email = UserTestFactory.createEmail();
      const password = UserTestFactory.createPassword();
      const originalLanguage = UserTestFactory.createLanguage();

      /* Create the user using a tested interface */
      const userDTO = await userRepository.createUser(session, {
        email,
        password,
        language: originalLanguage,
      });

      /* Generate a different language */
      let newLanguage;
      do {
        newLanguage = UserTestFactory.createLanguage();
      } while (newLanguage === originalLanguage);

      /* Update the user data using the interface under test */
      await userService.updateUser(userDTO.id, { language: newLanguage });

      /* Assert user data successfully updated */
      const user = await userRepository.findUserById(session, userDTO.id);
      expect(user).not.toBe(null);
      expect(user.language).toBe(newLanguage);
    });
  });

  it('tries updating non-existent user', async () => {
    await mongoHelper.runInTestTransaction(async () => {
      const userId = UserTestFactory.createId();
      const language = UserTestFactory.createLanguage();

      /* Try updating the user data using the interface under test */
      expect.assertions(1);
      try {
        await userService.updateUser(userId, { language });
      } catch (e) {
        expect(e.message).toBe('User not found');
      }
    });
  });

  it('removes a user from the databse', async () => {
    await mongoHelper.runInTestTransaction(async (session) => {
      const email = UserTestFactory.createEmail();
      const password = UserTestFactory.createPassword();

      /* Create the user using a tested interface */
      const userDTO = await userRepository.createUser(session, {
        email,
        password,
      });

      /* Remove the user using the interface under test */
      await userService.removeUser(userDTO.id);

      /* Assert user is no longer in the database */
      const user = await userRepository.findUserById(session, userDTO.id);
      expect(user).toBe(null);
    });
  });

  it('tries removing a user not in the databse', async () => {
    await mongoHelper.runInTestTransaction(async () => {
      const userId = UserTestFactory.createId();

      /* Try removing the user using the interface under test */
      expect.assertions(1);
      try {
        await userService.removeUser(userId);
      } catch (e) {
        expect(e.message).toBe('User not found');
      }
    });
  });
});
