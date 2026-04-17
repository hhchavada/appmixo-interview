import { Router } from 'express';
import authRoutes from './auth';
import bookRoutes from './books';
import memberRoutes from './members';
import transactionRoutes from './transactions';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);

router.use(authenticate);

router.use('/books', bookRoutes);
router.use('/members', memberRoutes);
router.use('/transactions', transactionRoutes);

export default router;
