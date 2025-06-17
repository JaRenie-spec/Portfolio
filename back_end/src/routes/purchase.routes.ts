import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/purchase.controller';

const router = Router();

/**
 * @openapi
 * /purchases:
 *   post:
 *     summary: Créer un achat
 *     tags:
 *       - Purchases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               authorId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Achat créé avec succès
 */
router.post('/', create);

/**
 * @openapi
 * /purchases:
 *   get:
 *     summary: Obtenir tous les achats
 *     tags:
 *       - Purchases
 *     responses:
 *       200:
 *         description: Liste des achats
 */
router.get('/', getAll);

/**
 * @openapi
 * /purchases/{id}:
 *   get:
 *     summary: Obtenir un achat par ID
 *     tags:
 *       - Purchases
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'achat
 */
router.get('/:id', getById);

/**
 * @openapi
 * /purchases/{id}:
 *   put:
 *     summary: Mettre à jour un achat
 *     tags:
 *       - Purchases
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
 *               bookId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               authorId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Achat mis à jour
 */
router.put('/:id', update);

/**
 * @openapi
 * /purchases/{id}:
 *   delete:
 *     summary: Supprimer un achat
 *     tags:
 *       - Purchases
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Achat supprimé
 */
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
