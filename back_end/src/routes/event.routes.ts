import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody';
import { createEventSchema, updateEventSchema } from '../types/event.types';
import { protect } from '../middlewares/protect';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
} from '../controllers/event.controller';

const router = Router();

// Routes pour les événements
router.post('/', protect, validateBody(createEventSchema), createEvent);
router.put('/:id', protect, validateBody(updateEventSchema), updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/:id', getEventById);
router.get('/', getAllEvents);

export default router;
