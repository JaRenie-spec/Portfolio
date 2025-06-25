import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import {
  findAll as authorFindAll,
  findOne as authorFindOne,
  create as authorCreate,
  update as authorUpdate,
  remove as authorRemove,
  findByPublicInfo
} from '../controllers/author.controller';

const router = Router();

router.get('/', protect, requireRole(['admin']), authorFindAll);
router.get('/:id', protect, requireRole(['admin']), authorFindOne);

router.post('/', protect, requireRole(['admin']), authorCreate);

router.put('/:id', protect, requireRole(['admin']), authorUpdate);

router.delete('/:id', protect, requireRole(['admin']), authorRemove);

router.get('/authors/search', findByPublicInfo);


export default router;
