"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminResources_controller_1 = require("../controllers/adminResources.controller");
const requireRole_1 = require("../middlewares/requireRole");
const router = (0, express_1.Router)();
/**
 * GET /api/admins/:id/resources
 * Renvoie en une seule payload toutes les ressources du système.
 * Accessible par :
 *  - l’Admin dont l’ID est :id
 *  - tout SuperAdmin
 */
router.get("/:id/resources", (0, requireRole_1.requireRole)(["admin"]), adminResources_controller_1.getAllResourcesHandler);
exports.default = router;
