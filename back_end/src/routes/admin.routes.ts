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
import { requireRole } from "middlewares/requireRole";

const router = Router();

router.post(
  "/",
  requireRole(["admin"]),
  requireRole(["superAdmin"]),
  validateCreateAdmin,
  createAdminHandler
);
router.get(
  "/",
  requireRole(["admin"]),
  requireRole(["superAdmin"]),
  getAllAdminsHandler
);
router.get(
  "/:id",
  requireRole(["admin"]),
  requireRole(["superAdmin"]),
  getAdminByIdHandler
);
router.put(
  "/:id",
  requireRole(["admin"]),
  requireRole(["superAdmin"]),
  validateUpdateAdmin,
  updateAdminHandler
);
router.delete(
  "/:id",
  requireRole(["admin"]),
  requireRole(["superAdmin"]),
  deleteAdminHandler
);

export default router;
