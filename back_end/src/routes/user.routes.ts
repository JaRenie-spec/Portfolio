import { Router } from 'express';
import { requireRole } from '../middlewares/requireRole';
import {
  me,
  updateMe,
  becomeAuthor,
  findOne,
  remove,
  findAll,
} from '../controllers/user.controller';

const router = Router();

/**
 * 1️⃣ Self-service (tout utilisateur authentifié peut y accéder)
 *    – protect appliqué globalement dans app.ts
 */
router.get('/me', me);
router.put('/me', updateMe);
router.post('/become-author', requireRole(['client']), becomeAuthor);

/**
 * 2️⃣ Par ID – réservé aux admin & superadmin
 */
router.get('/:id', requireRole(['admin', 'superadmin']), findOne);
router.delete('/:id', requireRole(['admin', 'superadmin']), remove);

/**
 * 3️⃣ Liste complète – réservé au superadmin
 */
router.get('/', requireRole(['superadmin']), findAll);

export default router;
