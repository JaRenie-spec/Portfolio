import { z } from 'zod';

export const createPurchaseSchema = z.object({
  bookId: z.coerce.number().int(),
  userId: z.coerce.number().int().optional(),
  authorId: z.coerce.number().int().optional(),
});

export const updatePurchaseSchema = z.object({
  bookId: z.coerce.number().int().optional(),
  userId: z.coerce.number().int().optional(),
  authorId: z.coerce.number().int().optional(),
});
