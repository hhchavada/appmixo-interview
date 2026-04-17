import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/constants';
import { BookService } from '../services/bookService';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  createBook = asyncHandler(async (req: Request, res: Response) => {
    const created = await this.bookService.createBook(req.body);
    return sendSuccess(res, created, 'Book created successfully', HTTP_STATUS.CREATED);
  });

  listBooks = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy } = req.query as any;
    const result = await this.bookService.listBooks(page, limit, sortBy);
    return sendSuccess(res, result, 'Books retrieved successfully', HTTP_STATUS.OK);
  });

  searchBooks = asyncHandler(async (req: Request, res: Response) => {
    const { query, page, limit } = req.query as any;
    const result = await this.bookService.searchBooks(query, page, limit);
    return sendSuccess(res, result, 'Books retrieved successfully', HTTP_STATUS.OK);
  });

  updateBook = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updated = await this.bookService.updateBook(id, req.body);
    return sendSuccess(res, updated, 'Book updated successfully', HTTP_STATUS.OK);
  });

  deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await this.bookService.deleteBook(id);
    return sendSuccess(res, deleted, 'Book deleted successfully', HTTP_STATUS.OK);
  });
}

