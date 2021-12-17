import { Mapper } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UserDto } from '../../dtos/userDto';
import { User } from '../../entities/user';

@Injectable()
export class UserMapper implements Mapper<User, UserDto> {
  public mapEntityToDto(entity: User): UserDto {
    return UserDto.create({
      id: entity._id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      language: entity.language,
    });
  }
}
