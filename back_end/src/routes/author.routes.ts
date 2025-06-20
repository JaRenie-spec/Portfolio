import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import {
  findAll as authorFindAll,
  findOne as authorFindOne,
  create as authorCreate,
  update as authorUpdate,
  remove as authorRemove
} from '../controllers/author.controller';

const router = Router();

router.get('/', protect, requireRole(['admin', 'superadmin']), authorFindAll);
router.get('/:id', authorFindOne);

router.post('/', protect, requireRole(['admin', 'superadmin']), authorCreate);

router.put('/:id', protect, requireRole(['admin', 'superadmin']), authorUpdate);

router.delete('/:id', protect, requireRole(['admin', 'superadmin']), authorRemove);

export default router;
