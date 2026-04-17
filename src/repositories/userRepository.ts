import { Model, Types } from 'mongoose';
import { IUser, CreateUserDto, UserModel } from '../interfaces/user.interface';
import User from '../models/User';

export class UserRepository {
  private userModel: Model<UserModel>;

  constructor() {
    this.userModel = User;
  }

  async create(userData: CreateUserDto): Promise<UserModel> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async findById(id: string): Promise<UserModel | null> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserModel | null> {
    return await this.userModel.findOne({ email }).select('+password').exec();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ users: UserModel[]; total: number }> {
    const skip = (page - 1) * limit;
    const sort: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      this.userModel
        .find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return { users, total };
  }

  async updateById(id: string, updateData: Partial<IUser>): Promise<UserModel | null> {
    return await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
  }

  async deleteById(id: string): Promise<UserModel | null> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return result !== null;
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.userModel.exists({ _id: new Types.ObjectId(id) });
    return result !== null;
  }
}
