import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/constants';
import { TransactionService } from '../services/transactionService';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  issueBook = asyncHandler(async (req: Request, res: Response) => {
    const { memberId, bookId } = req.body;
    const result = await this.transactionService.issueBook(memberId, bookId);
    return sendSuccess(res, result, 'Book issued successfully', HTTP_STATUS.CREATED);
  });

  returnBook = asyncHandler(async (req: Request, res: Response) => {
    const { transactionId } = req.body;
    const result = await this.transactionService.returnBook(transactionId);
    return sendSuccess(res, result, 'Book returned successfully', HTTP_STATUS.OK);
  });

  listTransactions = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query as any;
    const result = await this.transactionService.listTransactions(page, limit);
    return sendSuccess(res, result, 'Transactions retrieved successfully', HTTP_STATUS.OK);
  });

  listMemberTransactions = asyncHandler(async (req: Request, res: Response) => {
    const memberId = req.params.memberId as string;
    const { page, limit } = req.query as any;
    const result = await this.transactionService.listMemberTransactions(memberId, page, limit);
    return sendSuccess(res, result, 'Transactions retrieved successfully', HTTP_STATUS.OK);
  });
}

