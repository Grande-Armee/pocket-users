import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '../../../mongo/providers/unit-of-work-factory';
import { UserDTO } from '../../dtos/user.dto';
import { UserRepository } from '../../repositories/user/user.repository';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import { CreateUserData } from './interfaces/create-user-data.interface';

@Injectable()
export class UserService {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  public async loginUser(): Promise<string> {
    // TODO: implement
    const accessToken = await this.tokenService.signAccessToken({});

    return accessToken;
  }

  public async createUser(userData: CreateUserData): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const user = await unitOfWork.runInTransaction(async (session) => {
      const { email, password } = userData;

      return this.userRepository.createUser(session, {
        email,
        password: await this.hashService.hashPassword(password),
      });
    });

    return user;
  }
}
