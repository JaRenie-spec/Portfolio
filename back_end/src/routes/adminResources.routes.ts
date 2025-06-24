import { Router } from "express";
import { getAllResourcesHandler } from "../controllers/adminResources.controller";
import { requireRole } from "../middlewares/requireRole";
const router = Router();

/**
 * GET /api/admins/:id/resources
 * Renvoie en une seule payload toutes les ressources du système.
 * Accessible par :
 *  - l’Admin dont l’ID est :id
 *  - tout SuperAdmin
 */
router.get( "/:id/resources", requireRole(["admin", "superAdmin"]), getAllResourcesHandler);

export default router;
