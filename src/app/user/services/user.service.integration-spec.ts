import { TestingModule } from '@nestjs/testing';

import { MongoHelper } from '../../../integration-tests/helpers/mongo/mongo.helper';
import { TestModuleHelper } from '../../../integration-tests/helpers/test-module/test-module.helper';
import { UserRepository } from '../repositories/user.repository';
import { UserTestFactory } from '../tests-factories/user.factory';
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

      const userDTO = await userService.createUser({
        email,
        password,
        language,
      });

      expect(userDTO.email).toBe(email);
      expect(userDTO.password).not.toBe(password);
      expect(userDTO.language).toBe(language);

      const user = await userRepository.findByUserId(session, userDTO.id);

      expect(user).not.toBe(null);
      expect(user?.password).not.toBe(password); // not hashed
      expect(user?.email).toBe(email);
    });
  });
});
