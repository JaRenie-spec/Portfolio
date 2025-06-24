import { Router } from "express";
import {
  createAdminHandler,
  getAllAdminsHandler,
  getAdminByIdHandler,
  updateAdminHandler,
  deleteAdminHandler,
} from "../controllers/admin.controller";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get("/", requireRole(["admin", "superAdmin"]), getAllAdminsHandler);
router.get("/:id", requireRole(["admin", "superAdmin"]), getAdminByIdHandler);

router.post("/", requireRole(["admin", "superAdmin"]), createAdminHandler);

router.put("/:id", requireRole(["admin", "superAdmin"]), updateAdminHandler);

router.delete("/:id", requireRole(["admin", "superAdmin"]), deleteAdminHandler);

export default router;
