"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuthorSchema = exports.createAuthorSchema = void 0;
const zod_1 = require("zod");
exports.createAuthorSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "Le prénom est requis"),
    lastName: zod_1.z.string().min(1, "Le nom est requis"),
    pseudo: zod_1.z.string().min(2, "Le pseudo est requis"),
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    bio: zod_1.z.string().max(2000).optional(),
    createdByAdminId: zod_1.z.string().optional(),
});
exports.updateAuthorSchema = exports.createAuthorSchema.partial();
