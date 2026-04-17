import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { registerSchema, loginSchema } from '../validators/authValidator';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
