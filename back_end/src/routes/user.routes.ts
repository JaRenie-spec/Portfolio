import { Router } from 'express';
import {
  createUser,
  updateUser,
  updateOwnProfile,
} from '../controllers/user.controller';
import { validateBody } from '../middlewares/validateBody';
import { CreateUserSchema, UpdateUserSchema } from '../types/user.types';
import { protect } from '../middlewares/protect';

const router = Router();

router.post('/', validateBody(CreateUserSchema), createUser);
router.put('/:id', validateBody(UpdateUserSchema), updateUser);
router.put('/me', protect, validateBody(UpdateUserSchema), updateOwnProfile);

export default router;
