import { Router } from "express";
import {
  getAllAdminsHandler,
  getAdminByIdHandler,
  updateAdminHandler,
  deleteAdminHandler,
} from "../controllers/admin.controller";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

router.get("/", requireRole(["admin"]), getAllAdminsHandler);

router.get("/:id", requireRole(["admin"]), getAdminByIdHandler);

router.put("/:id", requireRole(["admin"]), updateAdminHandler);

router.delete("/:id", requireRole(["admin"]), deleteAdminHandler);

export default router;
