import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { validateRequest } from '../middlewares/zodValidation';
import {
  bookCreateSchema,
  bookSearchQuerySchema,
  bookUpdateSchema,
  idParamSchema,
  paginationQuerySchema,
} from '../validators/libraryValidators';

const router = Router();
const controller = new BookController();

router.post('/', validateRequest({ body: bookCreateSchema }), controller.createBook);

router.get('/', validateRequest({ query: paginationQuerySchema }), controller.listBooks);

router.get(
  '/search',
  validateRequest({ query: bookSearchQuerySchema.merge(paginationQuerySchema.partial()) }),
  controller.searchBooks
);

router.put('/:id', validateRequest({ params: idParamSchema, body: bookUpdateSchema }), controller.updateBook);

router.delete('/:id', validateRequest({ params: idParamSchema }), controller.deleteBook);

export default router;

