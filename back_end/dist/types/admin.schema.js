"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdminsSchema = exports.deleteAdminSchema = exports.getAdminByIdSchema = exports.updateAdminSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
exports.createAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Le nom d'utilisateur est requis"),
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    superAdminId: zod_1.z.string().optional(), // string car UUID dans Prisma
});
exports.updateAdminSchema = exports.createAdminSchema.partial();
// Les champs sont optionnels pour la mise à jour
exports.getAdminByIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("ID invalide, doit être un UUID"),
});
exports.deleteAdminSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("ID invalide, doit être un UUID"),
});
exports.getAllAdminsSchema = zod_1.z.object({});
