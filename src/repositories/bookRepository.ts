import { ClientSession, Model, Types } from 'mongoose';
import Book from '../models/Book';
import { BookModel, CreateBookDto, IBook, UpdateBookDto } from '../interfaces/book.interface';

export class BookRepository {
  private bookModel: Model<BookModel>;

  constructor() {
    this.bookModel = Book;
  }

  async create(data: CreateBookDto): Promise<BookModel> {
    const book = new this.bookModel(data);
    return await book.save();
  }

  async findById(id: string): Promise<BookModel | null> {
    return await this.bookModel.findById(id).exec();
  }

  async findByTitleAuthor(title: string, author: string): Promise<BookModel | null> {
    return await this.bookModel
      .findOne({ title: title.trim(), author: author.trim() })
      .collation({ locale: 'en', strength: 2 })
      .exec();
  }

  async findAll(
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<{ books: BookModel[]; total: number }> {
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [books, total] = await Promise.all([
      this.bookModel.find().sort(sort).skip(skip).limit(limit).exec(),
      this.bookModel.countDocuments().exec(),
    ]);

    return { books, total };
  }

  async search(query: string, skip: number, limit: number): Promise<{ books: BookModel[]; total: number }> {
    const regex = new RegExp(query, 'i');
    const filter = {
      $or: [{ title: regex }, { author: regex }, { genre: regex }],
    };

    const [books, total] = await Promise.all([
      this.bookModel.find(filter).skip(skip).limit(limit).exec(),
      this.bookModel.countDocuments(filter).exec(),
    ]);

    return { books, total };
  }

  async updateById(id: string, updateData: UpdateBookDto): Promise<BookModel | null> {
    return await this.bookModel
      .findByIdAndUpdate(id, updateData as Partial<IBook>, { new: true, runValidators: true })
      .exec();
  }

  async deleteById(id: string): Promise<BookModel | null> {
    return await this.bookModel.findByIdAndDelete(id).exec();
  }

  async decrementAvailableCopies(bookId: string, session?: ClientSession): Promise<BookModel | null> {
    return (await this.bookModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(bookId), availableCopies: { $gt: 0 } },
        { $inc: { availableCopies: -1 } },
        { new: true, session: session ?? null }
      )
      .exec()) as any;
  }

  async incrementAvailableCopies(bookId: string, session?: ClientSession): Promise<BookModel | null> {
    return (await this.bookModel
      .findByIdAndUpdate(bookId, { $inc: { availableCopies: 1 } }, { new: true, session: session ?? null })
      .exec()) as any;
  }
}

