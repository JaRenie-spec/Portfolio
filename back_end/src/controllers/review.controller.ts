import { Response, NextFunction, RequestHandler } from 'express';
import { ReviewService } from '../services/ReviewService';
import { AuthenticatedRequest } from '../middlewares/protect';

const reviewService = new ReviewService();

export const createReview: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const { user } = req as AuthenticatedRequest;
  const userId = user?.sub;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const review = await reviewService.create({
      ...(req.body as any),
      userId,
    });
    res.status(201).json(review);
  } catch (err) {
    console.error('Review creation failed:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};
