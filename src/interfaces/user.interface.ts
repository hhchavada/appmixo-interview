import { Document, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Document<Types.ObjectId> & IUser & IUserMethods;

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: Omit<IUser, 'password'>;
  token: string;
};
