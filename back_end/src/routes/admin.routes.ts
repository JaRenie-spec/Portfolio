import { Router } from "express";
import {
  createAdminHandler,
  getAllAdminsHandler,
  getAdminByIdHandler,
  updateAdminHandler,
  deleteAdminHandler,
} from "../controllers/admin.controller";
import {
  validateCreateAdmin,
  validateUpdateAdmin,
} from "../middlewares/admin.validator";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";
import { authorizeSelfOrRole } from "../middlewares/authorizeSelfOrRole";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole(["superAdmin"]),
  validateCreateAdmin,
  createAdminHandler
);
router.get(
  "/",
  requireAuth,
  requireRole(["superAdmin"]),
  getAllAdminsHandler
);
router.get(
  "/:id",
  requireAuth,
  authorizeSelfOrRole(["superAdmin"]),
  getAdminByIdHandler
);
router.put(
  "/:id",
  requireAuth,
  authorizeSelfOrRole(["superAdmin"]),
  validateUpdateAdmin,
  updateAdminHandler
);
router.delete(
  "/:id",
  requireAuth,
  requireRole(["superAdmin"]),
  deleteAdminHandler
);

export default router;
