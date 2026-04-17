import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { validateRequest } from '../middlewares/zodValidation';
import {
  issueBookSchema,
  memberIdParamSchema,
  paginationQuerySchema,
  returnBookSchema,
} from '../validators/libraryValidators';

const router = Router();
const controller = new TransactionController();

router.post('/issue', validateRequest({ body: issueBookSchema }), controller.issueBook);
router.post('/return', validateRequest({ body: returnBookSchema }), controller.returnBook);

router.get('/', validateRequest({ query: paginationQuerySchema }), controller.listTransactions);

router.get(
  '/member/:memberId',
  validateRequest({ params: memberIdParamSchema, query: paginationQuerySchema }),
  controller.listMemberTransactions
);

export default router;

