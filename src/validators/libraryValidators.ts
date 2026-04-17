import { z } from 'zod';

const objectIdSchema = z
  .string()
  .min(1, 'Required')
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const dateSchema = z.coerce.date();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortBy: z
    .string()
    .optional()
    .default('createdAt:desc')
    .refine(
      (v) => {
        const [field, order] = v.split(':');
        return Boolean(field) && (order === undefined || order === 'asc' || order === 'desc');
      },
      { message: 'sortBy must be like field:asc or field:desc' }
    ),
});

export const bookCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publishedDate: dateSchema.optional(),
  genre: z.string().min(1).optional(),
  availableCopies: z.coerce.number().int().nonnegative().optional().default(1),
});

export const bookUpdateSchema = bookCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'At least one field must be provided' }
);

export const memberCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  membershipDate: dateSchema.optional(),
});

export const memberUpdateSchema = memberCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'At least one field must be provided' }
);

export const issueBookSchema = z.object({
  memberId: objectIdSchema,
  bookId: objectIdSchema,
});

export const returnBookSchema = z.object({
  transactionId: objectIdSchema,
});

export const idParamSchema = z.object({
  id: objectIdSchema,
});

export const memberIdParamSchema = z.object({
  memberId: objectIdSchema,
});

export const bookSearchQuerySchema = z.object({
  query: z.string().min(1, 'query is required'),
});

