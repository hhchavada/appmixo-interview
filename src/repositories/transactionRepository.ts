import { ClientSession, Model, Types } from 'mongoose';
import Transaction from '../models/Transaction';
import { TransactionModel } from '../interfaces/transaction.interface';

export class TransactionRepository {
  private transactionModel: Model<TransactionModel>;

  constructor() {
    this.transactionModel = Transaction;
  }

  async create(
    data: { memberId: Types.ObjectId; bookId: Types.ObjectId },
    session?: ClientSession
  ): Promise<TransactionModel> {
    const tx = new this.transactionModel({
      memberId: data.memberId,
      bookId: data.bookId,
      issueDate: new Date(),
      status: 'issued',
    });

    return (await tx.save({ session: session ?? null })) as any;
  }

  async findById(id: string): Promise<TransactionModel | null> {
    return await this.transactionModel.findById(id).exec();
  }

  async findAll(skip: number, limit: number): Promise<{ transactions: TransactionModel[]; total: number }> {
    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find()
        .populate('memberId')
        .populate('bookId')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments().exec(),
    ]);

    return { transactions, total };
  }

  async findByMemberId(
    memberId: string,
    skip: number,
    limit: number
  ): Promise<{ transactions: TransactionModel[]; total: number }> {
    const filter = { memberId };
    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .populate('memberId')
        .populate('bookId')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(filter).exec(),
    ]);

    return { transactions, total };
  }

  async markReturned(id: string, session?: ClientSession): Promise<TransactionModel | null> {
    return (await this.transactionModel
      .findOneAndUpdate(
        { _id: id, status: 'issued' },
        { status: 'returned', returnDate: new Date() },
        { new: true, runValidators: true, session: session ?? null }
      )
      .exec()) as any;
  }
}

