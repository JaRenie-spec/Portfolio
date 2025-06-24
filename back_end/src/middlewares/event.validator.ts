import { z } from 'zod';
import { RequestHandler } from 'express';
import { validateBody } from './validateBody';

// Schéma de validation pour Event
export const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  dateEvent: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Date invalide' })
    .transform((s) => new Date(s)),
  authorId: z.string().uuid('L’identifiant de l’auteur est invalide'),
});

export const validateEvent: RequestHandler = validateBody(eventSchema);
