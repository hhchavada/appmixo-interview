import { HTTP_STATUS } from '../constants/constants';
import { ApiError } from '../utils/ApiError';
import { getPagination, parseSort } from '../utils/pagination';
import { BookRepository } from '../repositories/bookRepository';
import { CreateBookDto, UpdateBookDto } from '../interfaces/book.interface';

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async createBook(data: CreateBookDto) {
    const existing = await this.bookRepository.findByTitleAuthor(data.title, data.author);
    if (existing) {
      throw new ApiError('Book already exists', HTTP_STATUS.CONFLICT);
    }

    return await this.bookRepository.create(data);
  }

  async listBooks(page: number, limit: number, sortByRaw?: string) {
    const { page: safePage, limit: safeLimit, skip } = getPagination(page, limit);
    const { sortBy, sortOrder } = parseSort(sortByRaw);

    const { books, total } = await this.bookRepository.findAll(skip, safeLimit, sortBy, sortOrder);
    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: books,
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

  async searchBooks(query: string, page: number, limit: number) {
    const { page: safePage, limit: safeLimit, skip } = getPagination(page, limit);
    const { books, total } = await this.bookRepository.search(query, skip, safeLimit);
    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: books,
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

  async updateBook(id: string, data: UpdateBookDto) {
    const updated = await this.bookRepository.updateById(id, data);
    if (!updated) {
      throw new ApiError('Book not found', HTTP_STATUS.NOT_FOUND);
    }
    return updated;
  }

  async deleteBook(id: string) {
    const deleted = await this.bookRepository.deleteById(id);
    if (!deleted) {
      throw new ApiError('Book not found', HTTP_STATUS.NOT_FOUND);
    }
    return deleted;
  }
}

