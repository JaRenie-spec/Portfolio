import { z } from 'zod';
import { eventSchema } from '../middlewares/event.validator';

/**
 * Type des données reçues pour créer ou mettre à jour un Event
 */
export type EventInput = z.infer<typeof eventSchema>;

/**
 * Représentation d'un Event tel qu'enregistré en base
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  dateEvent: Date;
  authorId: string;
  createdByAdminId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
