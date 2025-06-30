"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchaseSchema = exports.createPurchaseSchema = void 0;
const zod_1 = require("zod");
exports.createPurchaseSchema = zod_1.z.object({
    bookId: zod_1.z.coerce.string().uuid(),
    userId: zod_1.z.coerce.string().uuid().optional(),
    authorId: zod_1.z.coerce.string().uuid().optional(),
});
exports.updatePurchaseSchema = zod_1.z.object({
    bookId: zod_1.z.coerce.string().uuid().optional(),
    userId: zod_1.z.coerce.string().uuid().optional(),
    authorId: zod_1.z.coerce.string().uuid().optional(),
});
