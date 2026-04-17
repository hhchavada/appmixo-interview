import { Router } from 'express';
import { MemberController } from '../controllers/memberController';
import { validateRequest } from '../middlewares/zodValidation';
import { idParamSchema, memberCreateSchema, memberUpdateSchema, paginationQuerySchema } from '../validators/libraryValidators';

const router = Router();
const controller = new MemberController();

router.post('/', validateRequest({ body: memberCreateSchema }), controller.createMember);

router.get('/', validateRequest({ query: paginationQuerySchema }), controller.listMembers);

router.put('/:id', validateRequest({ params: idParamSchema, body: memberUpdateSchema }), controller.updateMember);

router.delete('/:id', validateRequest({ params: idParamSchema }), controller.deleteMember);

export default router;

