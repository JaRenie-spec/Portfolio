import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/event.controller';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
