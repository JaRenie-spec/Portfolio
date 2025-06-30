"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateReview = exports.validateCreateReview = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
const validateBody_1 = require("./validateBody");
// Schéma pour la création d’un review
exports.createReviewSchema = zod_1.z.object({
    comment: zod_1.z.string().min(1, 'Le commentaire est requis'),
    rating: zod_1.z
        .number()
        .int('La note doit être un entier')
        .min(0, 'Note minimale = 0')
        .max(5, 'Note maximale = 5'),
    bookId: zod_1.z.string().uuid('ID de livre invalide'),
    authorId: zod_1.z.string().uuid('ID d’auteur invalide'),
});
// Schéma pour la mise à jour d’un review (tout optionnel)
exports.updateReviewSchema = exports.createReviewSchema.partial();
// Middlewares pour valider req.body
exports.validateCreateReview = (0, validateBody_1.validateBody)(exports.createReviewSchema);
exports.validateUpdateReview = (0, validateBody_1.validateBody)(exports.updateReviewSchema);
