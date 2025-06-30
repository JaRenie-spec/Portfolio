import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  isbn: z.string().min(10, "ISBN requis"),
  price: z.number().positive("Le prix doit être positif"),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  fileUrl: z.string(),
  authorId: z.string().uuid(),
  createdByAdminId: z.string().uuid().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1, "Le titre est requis").optional(),
  isbn: z.string().min(10, "ISBN requis").optional(),
  price: z.number().positive("Le prix doit être positif").optional(),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  fileUrl: z.string().optional(),
  authorId: z.string().uuid().optional(),
  createdByAdminId: z.string().uuid().optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
