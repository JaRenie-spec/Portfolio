import { z } from 'zod';
import { RequestHandler } from 'express';
import { validateBody } from './validateBody';

// Schéma de validation pour Event — plus de authorId
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis'),
  description: z
    .string()
    .min(1, 'La description est requise'),
  dateEvent: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Date invalide (ISO attendu)' }),
});

// Middleware d’express qui rejette en 400 si le body ne matche pas
export const validateEvent: RequestHandler = validateBody(eventSchema);
