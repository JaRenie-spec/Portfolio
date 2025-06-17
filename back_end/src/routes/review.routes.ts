import { Router } from 'express';
import { createReview } from '../controllers/review.controller';
import { protect } from '../middlewares/protect';
import { validateBody } from '../middlewares/validateBody';
import { CreateReviewSchema } from '../types/review.types';

const router = Router();

router.post(
  '/',
  protect,
  validateBody(CreateReviewSchema),
  createReview
);

export default router;
