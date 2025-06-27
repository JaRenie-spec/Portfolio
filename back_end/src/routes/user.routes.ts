import { Router } from 'express';
import { requireRole } from '../middlewares/requireRole';
import {
  me,
  updateMe,
  findOne,
  remove,
  findAll,
} from '../controllers/user.controller';
import { protect } from '../middlewares/protect';

const router = Router();

router.get('/me', protect, me);

router.put('/:id', protect, updateMe);

router.get('/:id', protect, requireRole(['admin']), findOne);

router.delete('/:id', protect, requireRole(['client','admin']), remove);

router.get('/', protect, requireRole(['admin']), findAll);

export default router;
