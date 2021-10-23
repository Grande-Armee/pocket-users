import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument, Model } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
  })
  public email: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    default: 'USER',
  })
  public role: string;

  @Prop({
    default: 'en',
  })
  public language: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserModel = Model<UserDocument>;

export type SerializedUser = LeanDocument<UserDocument>;

export const USER_MODEL_TOKEN = User.name;
