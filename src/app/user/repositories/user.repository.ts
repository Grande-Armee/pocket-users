import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { ClientSession } from '../../mongo/providers/unit-of-work';
import { UserDTO } from '../dtos/user.dto';
import { UserModel, USER_MODEL_TOKEN } from '../schemas/user.schema';
import { UserEntitySerializer } from '../serializers/user-entity.serializer';

@Injectable()
export class UserRepository {
  public constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: UserModel,
    private readonly userEntitySerializer: UserEntitySerializer,
  ) {}

  public async readByUserId(session: ClientSession, userId: string): Promise<UserDTO | null> {
    const entity = await this.userModel.findOne(
      {
        _id: new ObjectId(userId),
      },
      null,
      { session },
    );

    if (!entity) {
      return null;
    }

    return this.userEntitySerializer.serialize(entity);
  }

  public async createTestUser(session: ClientSession): Promise<UserDTO> {
    const entity = new this.userModel({
      email: 'test@email.com',
      password: 'test',
      salt: 'salt',
    });

    await entity.save({ session });

    return this.userEntitySerializer.serialize(entity);
  }
}
