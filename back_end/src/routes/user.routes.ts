import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody';
import { CreateUserSchema, UpdateUserSchema } from '../types/user.types';
import { protect } from '../middlewares/protect';
import {
  createUser,
  updateUser,
  updateOwnProfile,
  deleteOwnAccount,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Durand
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice.durand@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', validateBody(CreateUserSchema), createUser);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (admin uniquement)
 *     tags:
 *       - Users
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
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Durand
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice.durand@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: nouveaumdp456
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       400:
 *         description: Données invalides
 */
router.put('/:id', validateBody(UpdateUserSchema), updateUser);

/**
 * @openapi
 * /api/users/me:
 *   put:
 *     summary: Mettre à jour son propre profil
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Durand
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non authentifié
 */
router.put('/me', protect, validateBody(UpdateUserSchema), updateOwnProfile);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin uniquement)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 */
router.delete('/:id', deleteUser);

/**
 * @openapi
 * /api/users/me:
 *   delete:
 *     summary: Supprimer son propre compte
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Compte supprimé
 *       401:
 *         description: Non authentifié
 */
router.delete('/me', protect, deleteOwnAccount);

export default router;
