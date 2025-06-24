import { z } from 'zod';
import { RequestHandler } from 'express';
import { validateBody } from './validateBody';

// Schéma pour la création d’un review
export const createReviewSchema = z.object({
  comment: z.string().min(1, 'Le commentaire est requis'),
  rating: z
    .number()
    .int('La note doit être un entier')
    .min(0, 'Note minimale = 0')
    .max(5, 'Note maximale = 5'),
  bookId: z.string().uuid('ID de livre invalide'),
  authorId: z.string().uuid('ID d’auteur invalide'),
});

// Schéma pour la mise à jour d’un review (tout optionnel)
export const updateReviewSchema = createReviewSchema.partial();

// Middlewares pour valider req.body
export const validateCreateReview: RequestHandler = validateBody(createReviewSchema);
export const validateUpdateReview: RequestHandler = validateBody(updateReviewSchema);
