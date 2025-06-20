import { z } from 'zod';
import { RequestHandler } from 'express';
import { validateBody } from './validateBody';

// Schéma de validation pour Book
export const bookSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  isbn: z.string().min(1, "L’ISBN est requis"),
  price: z.number().positive('Le prix doit être un nombre positif'),
  description: z.string().optional(),
  rating: z.number().min(0, 'Note minimale = 0').max(5, 'Note maximale = 5').optional(),
  fileUrl: z.string().url('L’URL du fichier est invalide'),
  authorId: z.string().uuid('L’identifiant de l’auteur est invalide'),
});

export const validateBook: RequestHandler = validateBody(bookSchema);
