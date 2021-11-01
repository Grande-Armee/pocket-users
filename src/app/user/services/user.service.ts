import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '../../mongo/providers/unit-of-work';
import { UserDTO } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserData } from './interfaces/create-user-data.interface';

@Injectable()
export class UserService {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly userRepository: UserRepository,
  ) {}

  public async createUser(userData: CreateUserData): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const user = await unitOfWork.runInTransaction(async (session) => {
      const { email, password } = userData;

      // TODO: hash password
      // TODO: add salt
      return this.userRepository.createUser(session, {
        email,
        password: `${password} hash`,
        salt: 'hash salt',
      });
    });

    return user;
  }
}
