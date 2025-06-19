import { Router } from 'express';
import { createReview } from '../controllers/review.controller';
import { protect } from '../middlewares/protect';
import { validateBody } from '../middlewares/validateBody';
import { CreateReviewSchema } from '../types/review.types';

const router = Router();

router.post(
  '/',
  protect,
  validateBody(CreateReviewSchema),
  createReview
);

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     summary: Créer un avis (review)
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *               - bookId
 *               - authorId
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Excellent livre, très bien écrit !"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               bookId:
 *                 type: string
 *                 format: uuid
 *                 example: "b4d5463e-8f87-4a9e-8324-8f4d91a8b999"
 *               authorId:
 *                 type: string
 *                 format: uuid
 *                 example: "c7e13d5a-e63c-4de3-9ed3-19373450e6c0"
 *     responses:
 *       201:
 *         description: Avis créé avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié
 */

export default router;
