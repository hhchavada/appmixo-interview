import { Document, Types } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  publishedDate?: Date;
  genre?: string;
  availableCopies: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookModel = Document<Types.ObjectId> & IBook;

export type CreateBookDto = {
  title: string;
  author: string;
  publishedDate?: Date;
  genre?: string;
  availableCopies?: number;
};

export type UpdateBookDto = Partial<CreateBookDto>;

