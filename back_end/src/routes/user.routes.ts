import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import {
  findAll,
  findOne,
  me,
  updateMe,
  becomeAuthor,
  remove,
} from '../controllers/user.controller';

const router = Router();
/**
 * Routes pour la gestion des utilisateurs
 * - GET /api/users : Liste tous les utilisateurs (superadmin uniquement)
 * - GET /api/users/:id : Récupère un utilisateur par son ID (admin & superadmin uniquement)
 * - GET /api/users/me : Récupère les informations de l'utilisateur authentifié
 * - PUT /api/users/me : Met à jour les informations de l'utilisateur authentifié
 * - POST /api/users/become-author : Permet à un client de devenir auteur
 * - DELETE /api/users/:id : Supprime un utilisateur (admin & superadmin uniquement)
 */
router.get('/', protect, requireRole(['superadmin']), findAll);
router.get('/:id', protect, requireRole(['admin','superadmin']), findOne);
router.get('/me', protect, me);

router.put('/me', protect, updateMe);

router.post('/become-author', protect, requireRole(['client']), becomeAuthor);

router.delete('/:id', protect, requireRole(['admin','superadmin']), remove);

export default router;
