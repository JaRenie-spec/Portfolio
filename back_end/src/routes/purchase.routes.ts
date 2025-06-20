import { Router } from 'express';
import { protect } from '../middlewares/protect';
import { requireRole } from '../middlewares/requireRole';
import { validateCreatePurchase } from '../middlewares/purchase.validator';
import {
  findAll as purchaseFindAll,
  findOne as purchaseFindOne,
  create as purchaseCreate,
  remove as purchaseRemove,
} from '../controllers/purchase.controller';

const router = Router();


router.get('/', protect, requireRole(['admin','superadmin']), purchaseFindAll);
router.get('/:id', protect, requireRole(['admin','superadmin']), purchaseFindOne);

router.post('/', protect, requireRole(['client']), validateCreatePurchase, purchaseCreate);

router.delete('/:id', protect, requireRole(['admin','superadmin']), purchaseRemove);

export default router;
