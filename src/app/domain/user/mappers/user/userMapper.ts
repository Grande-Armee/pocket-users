import { Injectable } from '@nestjs/common';

import { UserDTO } from '../../dtos/userDTO';
import { User } from '../../schemas/user';

@Injectable()
export class UserMapper {
  public mapEntityToDTO(entity: User): UserDTO {
    return UserDTO.create({
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
