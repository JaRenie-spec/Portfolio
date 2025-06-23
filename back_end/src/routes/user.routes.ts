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
import { protect } from '../middlewares/protect';

const router = Router();

/**
 * 1️⃣ Self-service (tout utilisateur authentifié peut y accéder)
 *    – protect appliqué globalement dans app.ts
 */
router.get('/me', protect, me);
router.put('/me', protect, updateMe);
router.post('/become-author', protect, requireRole(['client']), becomeAuthor);

/**
 * 2️⃣ Par ID – réservé aux admin & superadmin
 */
router.get('/:id', protect, requireRole(['admin', 'superadmin']), findOne);
router.delete('/:id', protect, requireRole(['admin', 'superadmin']), remove);

/**
 * 3️⃣ Liste complète – réservé au superadmin
 */
router.get('/', protect, requireRole(['superadmin']), findAll);

export default router;
