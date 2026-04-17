import mongoose, { Schema, Model } from 'mongoose';
import { MemberModel } from '../interfaces/member.interface';
import { VALIDATION_MESSAGES } from '../constants/validationMessages';

const memberSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, VALIDATION_MESSAGES.MEMBER.NAME_REQUIRED],
      trim: true,
    },
    email: {
      type: String,
      required: [true, VALIDATION_MESSAGES.MEMBER.EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      trim: true,
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model('Member', memberSchema) as any as Model<MemberModel>;

export default Member;

