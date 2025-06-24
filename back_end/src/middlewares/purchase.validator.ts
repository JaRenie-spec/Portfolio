import { z } from 'zod';
import { RequestHandler } from 'express';
import { validateBody } from './validateBody';

// Schéma pour la création d’un achat
export const createPurchaseSchema = z.object({
	bookId: z.string().uuid('L’ID du livre doit être un UUID valide'),
});

export const validateCreatePurchase: RequestHandler = validateBody(createPurchaseSchema);
