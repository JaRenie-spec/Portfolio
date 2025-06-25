import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import { validateEvent } from '../middlewares/event.validator';
import {
  findAll as eventFindAll,
  findOne as eventFindOne,
  create as eventCreate,
  update as eventUpdate,
  remove as eventRemove
} from '../controllers/event.controller';

const router = Router();

router.get('/', eventFindAll);
router.get('/:id', eventFindOne);

router.post('/', protect, requireRole(['author','admin']), validateEvent, eventCreate);

router.put('/:id', protect, requireRole(['author','admin']), validateEvent, eventUpdate);

router.delete('/:id', protect, requireRole(['admin']), eventRemove);

export default router;
