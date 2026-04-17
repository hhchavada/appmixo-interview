import { Document, Types } from 'mongoose';

export interface IMember {
  name: string;
  email: string;
  membershipDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MemberModel = Document<Types.ObjectId> & IMember;

export type CreateMemberDto = {
  name: string;
  email: string;
  membershipDate?: Date;
};

export type UpdateMemberDto = Partial<CreateMemberDto>;

