import { z } from 'zod';

// Schema for creating a new review (userId is injected in the controller)
export const CreateReviewSchema = z.object({
  comment: z.string().min(1).max(1000),
  rating: z.number().min(1).max(5),
  bookId: z.string().uuid(),
  authorId: z.string().uuid(),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;
