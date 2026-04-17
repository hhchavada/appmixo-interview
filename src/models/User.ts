import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserMethods, UserModel } from '../interfaces/user.interface';
import { VALIDATION_MESSAGES } from '../constants/validationMessages';
import { ROLES } from '../constants/constants';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, VALIDATION_MESSAGES.USER.NAME_REQUIRED],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, VALIDATION_MESSAGES.USER.EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        VALIDATION_MESSAGES.USER.EMAIL_INVALID,
      ],
    },
    password: {
      type: String,
      required: [true, VALIDATION_MESSAGES.USER.PASSWORD_REQUIRED],
      minlength: [6, VALIDATION_MESSAGES.USER.PASSWORD_MIN],
      select: false,
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc: any, ret: any) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema) as any as Model<UserModel>;

export default User;
