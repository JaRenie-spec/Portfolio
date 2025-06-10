import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dateEvent: z.coerce.date(),
  authorId: z.coerce.number().int(),
  createdByAdminId: z.coerce.number().int().optional(),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  dateEvent: z.coerce.date().optional(),
  authorId: z.coerce.number().int().optional(),
  createdByAdminId: z.coerce.number().int().optional(),
});
