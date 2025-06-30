"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminHandler = exports.updateAdminHandler = exports.getAdminByIdHandler = exports.getAllAdminsHandler = void 0;
const adminService = __importStar(require("../services/admin.service"));
// Récupérer tous les admins
const getAllAdminsHandler = async (_req, res) => {
    try {
        const list = await adminService.findAllAdmins();
        res.json({ success: true, data: list });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ success: false, error: message });
        return;
    }
};
exports.getAllAdminsHandler = getAllAdminsHandler;
// Récupérer un admin par ID
const getAdminByIdHandler = async (req, res) => {
    try {
        const admin = await adminService.findAdminById(req.params.id); // id est string (UUID)
        if (!admin) {
            res.status(404).json({ success: false, error: "Non trouvé" });
            return;
        }
        res.json({ success: true, data: admin });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ success: false, error: message });
        return;
    }
};
exports.getAdminByIdHandler = getAdminByIdHandler;
// Mettre à jour un admin
const updateAdminHandler = async (req, res) => {
    try {
        const updated = await adminService.updateAdmin(req.params.id, req.body);
        res.json({ success: true, data: updated });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ success: false, error: message });
        return;
    }
};
exports.updateAdminHandler = updateAdminHandler;
// Supprimer un admin
const deleteAdminHandler = async (req, res) => {
    try {
        await adminService.deleteAdmin(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ success: false, error: message });
        return;
    }
};
exports.deleteAdminHandler = deleteAdminHandler;
