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
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.post(
  "/",
  requireRole(["admin", "superAdmin"]),
  validateCreateAdmin,
  createAdminHandler
);
router.get(
  "/",
  requireRole(["admin", "superAdmin"]),
  getAllAdminsHandler
);
router.get(
  "/:id",
  requireRole(["admin", "superAdmin"]),
  getAdminByIdHandler
);
router.put(
  "/:id",
  requireRole(["admin", "superAdmin"]),
  validateUpdateAdmin,
  updateAdminHandler
);
router.delete(
  "/:id",
  requireRole(["admin", "superAdmin"]),
  deleteAdminHandler
);

export default router;
