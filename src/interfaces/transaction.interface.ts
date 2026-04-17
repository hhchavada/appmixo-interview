import { Document, Types } from 'mongoose';

export type TransactionStatus = 'issued' | 'returned';

export interface ITransaction {
  memberId: Types.ObjectId;
  bookId: Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionModel = Document<Types.ObjectId> & ITransaction;

export type IssueBookDto = {
  memberId: string;
  bookId: string;
};

export type ReturnBookDto = {
  transactionId: string;
};

