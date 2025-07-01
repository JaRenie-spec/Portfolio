"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBook = exports.bookSchema = void 0;
const zod_1 = require("zod");
const validateBody_1 = require("./validateBody");
// Schéma de validation pour Book
exports.bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Le titre est requis'),
    isbn: zod_1.z.string().min(1, "L’ISBN est requis"),
    price: zod_1.z.number().positive('Le prix doit être un nombre positif'),
    description: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(0, 'Note minimale = 0').max(5, 'Note maximale = 5').optional(),
    fileUrl: zod_1.z.string().url('L’URL du fichier est invalide'),
    authorId: zod_1.z.string().uuid('L’identifiant de l’auteur est invalide'),
});
exports.validateBook = (0, validateBody_1.validateBody)(exports.bookSchema);
