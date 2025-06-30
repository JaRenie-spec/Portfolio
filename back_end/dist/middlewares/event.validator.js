"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvent = exports.eventSchema = void 0;
const zod_1 = require("zod");
const validateBody_1 = require("./validateBody");
// Schéma de validation pour Event
exports.eventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Le titre est requis'),
    description: zod_1.z.string().min(1, 'La description est requise'),
    dateEvent: zod_1.z
        .string()
        .refine((s) => !isNaN(Date.parse(s)), { message: 'Date invalide' })
        .transform((s) => new Date(s)),
    authorId: zod_1.z.string().uuid('L’identifiant de l’auteur est invalide'),
});
exports.validateEvent = (0, validateBody_1.validateBody)(exports.eventSchema);
