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

router.post('/', validateBody(CreateUserSchema), createUser);
router.put('/:id', validateBody(UpdateUserSchema), updateUser);
router.put('/me', protect, validateBody(UpdateUserSchema), updateOwnProfile);
router.delete('/:id', deleteUser);
router.delete('/me', protect, deleteOwnAccount);

export default router;
