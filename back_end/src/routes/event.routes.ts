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

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Créer un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dateEvent
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dateEvent:
 *                 type: string
 *                 format: date-time
 *               authorId:
 *                 type: string
 *                 format: uuid
 *               createdByAdminId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 */
router.post('/', protect, validateBody(createEventSchema), createEvent);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     summary: Mettre à jour un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dateEvent:
 *                 type: string
 *                 format: date-time
 *               authorId:
 *                 type: string
 *                 format: uuid
 *               createdByAdminId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Événement mis à jour
 */
router.put('/:id', protect, validateBody(updateEventSchema), updateEvent);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Événement supprimé
 */
router.delete('/:id', protect, deleteEvent);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Obtenir un événement par ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l’événement
 */
router.get('/:id', getEventById);

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Obtenir tous les événements
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Liste des événements
 */
router.get('/', getAllEvents);

export default router;
