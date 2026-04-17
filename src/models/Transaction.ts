import mongoose, { Schema, Model } from 'mongoose';
import { TransactionModel } from '../interfaces/transaction.interface';
import { VALIDATION_MESSAGES } from '../constants/validationMessages';

const transactionSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, VALIDATION_MESSAGES.TRANSACTION.MEMBER_ID_REQUIRED],
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, VALIDATION_MESSAGES.TRANSACTION.BOOK_ID_REQUIRED],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['issued', 'returned'],
      default: 'issued',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema) as any as Model<TransactionModel>;

export default Transaction;

