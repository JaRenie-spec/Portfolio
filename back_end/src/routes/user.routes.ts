import { Router } from 'express';
import { createUser } from '../controllers/user.controller';
import { validateBody } from '../middlewares/validateBody';
import { CreateUserSchema } from '../types/user.types';

const router = Router();

router.post('/', validateBody(CreateUserSchema), createUser);

export default router;
