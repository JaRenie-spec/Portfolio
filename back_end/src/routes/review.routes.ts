import { Router } from 'express';
import { createReview } from '..controllers/review.controller';
import { validateBody } from 'middlewares/validateBody';
import { CreateReviewSchema } from 'types/review.types';
import { protect } from 'middlewares/protect';

const router = Router();

router.post('/', protect, validateBody(CreateReviewSchema), createReview);

export default router;
