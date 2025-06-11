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

/** Création d’un Admin : réservé aux SuperAdmin */
router.post(
  "/",
  requireAuth,
  requireRole(["superAdmin"]),
  validateCreateAdmin,
  createAdminHandler
);

/** Liste : SuperAdmin uniquement */
router.get("/", requireAuth, requireRole(["superAdmin"]), getAllAdminsHandler);

/** Détail : self ou SuperAdmin */
router.get(
  "/:id",
  requireAuth,
  authorizeSelfOrRole(["superAdmin"]),
  getAdminByIdHandler
);

/** Mise à jour : self ou SuperAdmin */
router.put(
  "/:id",
  requireAuth,
  authorizeSelfOrRole(["superAdmin"]),
  validateUpdateAdmin,
  updateAdminHandler
);

/** Suppression : SuperAdmin uniquement */
router.delete(
  "/:id",
  requireAuth,
  requireRole(["superAdmin"]),
  deleteAdminHandler
);

export default router;
