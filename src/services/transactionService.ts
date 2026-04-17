import { Types } from 'mongoose';
import { HTTP_STATUS } from '../constants/constants';
import { ApiError } from '../utils/ApiError';
import { getPagination } from '../utils/pagination';
import { TransactionRepository } from '../repositories/transactionRepository';
import { BookRepository } from '../repositories/bookRepository';
import { MemberRepository } from '../repositories/memberRepository';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private bookRepository: BookRepository;
  private memberRepository: MemberRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.bookRepository = new BookRepository();
    this.memberRepository = new MemberRepository();
  }

  async issueBook(memberId: string, bookId: string) {
    const [member, book] = await Promise.all([this.memberRepository.findById(memberId), this.bookRepository.findById(bookId)]);

    if (!member) {
      throw new ApiError('Member not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!book) {
      throw new ApiError('Book not found', HTTP_STATUS.NOT_FOUND);
    }

    if ((book.availableCopies ?? 0) <= 0) {
      throw new ApiError('No available copies to issue', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      const updatedBook = await this.bookRepository.decrementAvailableCopies(bookId);

      if (!updatedBook) {
        throw new ApiError('No available copies to issue', HTTP_STATUS.BAD_REQUEST);
      }

      const tx = await this.transactionRepository.create({
        memberId: new Types.ObjectId(memberId),
        bookId: new Types.ObjectId(bookId),
      });

      return { transaction: tx, book: updatedBook };
    } catch (error) {
      await this.bookRepository.incrementAvailableCopies(bookId).catch(() => undefined);
      throw error;
    }
  }

  async returnBook(transactionId: string) {
    const updatedTx = await this.transactionRepository.markReturned(transactionId);
    if (!updatedTx) {
      const exists = await this.transactionRepository.findById(transactionId);
      if (!exists) throw new ApiError('Transaction not found', HTTP_STATUS.NOT_FOUND);
      throw new ApiError('Transaction is not in issued status', HTTP_STATUS.BAD_REQUEST);
    }

    const updatedBook = await this.bookRepository.incrementAvailableCopies(updatedTx.bookId.toString());
    return { transaction: updatedTx, book: updatedBook };
  }

  async listTransactions(page: number, limit: number) {
    const { page: safePage, limit: safeLimit, skip } = getPagination(page, limit);
    const { transactions, total } = await this.transactionRepository.findAll(skip, safeLimit);
    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: transactions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
    };
  }

  async listMemberTransactions(memberId: string, page: number, limit: number) {
    const { page: safePage, limit: safeLimit, skip } = getPagination(page, limit);
    const { transactions, total } = await this.transactionRepository.findByMemberId(memberId, skip, safeLimit);
    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: transactions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
    };
  }
}

