import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import {
  validateCreateReview,
  validateUpdateReview
} from '../middlewares/review.validator';
import {
  findAll as reviewFindAll,
  findOne as reviewFindOne,
  create as reviewCreate,
  update as reviewUpdate,
  remove as reviewRemove
} from '../controllers/review.controller';

const router = Router();

router.get('/', reviewFindAll);
router.get('/:id', reviewFindOne);

router.post('/', protect, requireRole(['client']), validateCreateReview, reviewCreate);

router.put('/:id', protect, requireRole(['client','admin','superadmin']), validateUpdateReview, reviewUpdate);

router.delete( '/:id', protect, requireRole(['admin','superadmin']), reviewRemove);

export default router;
