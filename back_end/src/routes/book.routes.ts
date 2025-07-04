import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import { validateBook } from '../middlewares/book.validator';
import {
	findByPublicInfo,
  findAll as bookFindAll,
  findOne as bookFindOne,
  create as bookCreate,
  update as bookUpdate,
  remove as bookRemove
} from '../controllers/book.controller';

const router = Router();

router.get('/', bookFindAll);

router.get('/search', findByPublicInfo);

router.get('/:id', bookFindOne);

router.post('/', protect, requireRole(['author','admin']), validateBook, bookCreate);

router.put('/:id', protect, requireRole(['author','admin']), validateBook, bookUpdate);

router.delete('/:id', protect, requireRole(['admin', 'author']), bookRemove);

export default router;
