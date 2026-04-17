import { Model } from 'mongoose';
import Member from '../models/Member';
import { CreateMemberDto, IMember, MemberModel, UpdateMemberDto } from '../interfaces/member.interface';

export class MemberRepository {
  private memberModel: Model<MemberModel>;

  constructor() {
    this.memberModel = Member;
  }

  async create(data: CreateMemberDto): Promise<MemberModel> {
    const member = new this.memberModel({
      ...data,
      membershipDate: data.membershipDate ?? new Date(),
    });
    return await member.save();
  }

  async findById(id: string): Promise<MemberModel | null> {
    return await this.memberModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<MemberModel | null> {
    return await this.memberModel.findOne({ email }).exec();
  }

  async findAll(skip: number, limit: number): Promise<{ members: MemberModel[]; total: number }> {
    const [members, total] = await Promise.all([
      this.memberModel.find().skip(skip).limit(limit).exec(),
      this.memberModel.countDocuments().exec(),
    ]);
    return { members, total };
  }

  async updateById(id: string, updateData: UpdateMemberDto): Promise<MemberModel | null> {
    return await this.memberModel
      .findByIdAndUpdate(id, updateData as Partial<IMember>, { new: true, runValidators: true })
      .exec();
  }

  async deleteById(id: string): Promise<MemberModel | null> {
    return await this.memberModel.findByIdAndDelete(id).exec();
  }
}

