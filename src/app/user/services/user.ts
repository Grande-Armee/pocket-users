import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SerializedUser, UserModel, USER_MODEL_TOKEN } from '../models/user';

@Injectable()
export class UserService {
  public constructor(@InjectModel(USER_MODEL_TOKEN) private readonly userModel: UserModel) {}

  public async createUser(): Promise<SerializedUser> {
    const user = new this.userModel({
      email: 'test',
      password: 'test',
      role: 'test',
      language: 'test',
    });

    const savedUser = await user.save();

    return savedUser.toJSON();
  }
}
