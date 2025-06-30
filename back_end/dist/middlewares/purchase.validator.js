"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreatePurchase = exports.createPurchaseSchema = void 0;
const zod_1 = require("zod");
const validateBody_1 = require("./validateBody");
// Schéma pour la création d’un achat
exports.createPurchaseSchema = zod_1.z.object({
    bookId: zod_1.z.string().uuid('L’ID du livre doit être un UUID valide'),
});
exports.validateCreatePurchase = (0, validateBody_1.validateBody)(exports.createPurchaseSchema);
