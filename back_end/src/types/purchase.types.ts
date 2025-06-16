import { z } from 'zod';

export const createPurchaseSchema = z.object({
  bookId: z.coerce.string().uuid(),
  userId: z.coerce.string().uuid().optional(),
  authorId: z.coerce.string().uuid().optional(),
});

export const updatePurchaseSchema = z.object({
  bookId: z.coerce.string().uuid().optional(),
  userId: z.coerce.string().uuid().optional(),
  authorId: z.coerce.string().uuid().optional(),
});
