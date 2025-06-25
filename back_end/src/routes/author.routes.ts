import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import {
  findAll as authorFindAll,
  findOne as authorFindOne,
  update as authorUpdate,
  remove as authorRemove,
  findByPublicInfo
} from '../controllers/author.controller';

const router = Router();

router.get('/', authorFindAll);

router.get('/search', findByPublicInfo);

router.get('/:id', protect, requireRole(['admin']), authorFindOne);

router.put('/:id', protect, requireRole(['author','admin']), authorUpdate);

router.delete('/:id', protect, requireRole(['author','admin']), authorRemove);



export default router;
