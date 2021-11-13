import { Injectable } from '@nestjs/common';

import { UserDTO } from '../../dtos/userDTO';
import { UserEntity } from '../../schemas/userSchema';

@Injectable()
export class UserMapper {
  public mapEntityToDTO(entity: UserEntity): UserDTO {
    return UserDTO.create({
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      language: entity.language,
    });
  }
}
