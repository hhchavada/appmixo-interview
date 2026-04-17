import mongoose, { Schema, Model } from 'mongoose';
import { BookModel } from '../interfaces/book.interface';
import { VALIDATION_MESSAGES } from '../constants/validationMessages';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, VALIDATION_MESSAGES.BOOK.TITLE_REQUIRED],
      trim: true,
    },
    author: {
      type: String,
      required: [true, VALIDATION_MESSAGES.BOOK.AUTHOR_REQUIRED],
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    genre: {
      type: String,
      trim: true,
    },
    availableCopies: {
      type: Number,
      required: [true, VALIDATION_MESSAGES.BOOK.AVAILABLE_COPIES_REQUIRED],
      default: 1,
      min: [0, VALIDATION_MESSAGES.BOOK.AVAILABLE_COPIES_MIN],
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index(
  { title: 1, author: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

const Book = mongoose.model('Book', bookSchema) as any as Model<BookModel>;

export default Book;

