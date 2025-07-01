"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
exports.createBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Le titre est requis"),
    isbn: zod_1.z.string().min(10, "ISBN requis"),
    price: zod_1.z.number().positive("Le prix doit être positif"),
    description: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    fileUrl: zod_1.z.string(),
    authorId: zod_1.z.string().uuid(),
    createdByAdminId: zod_1.z.string().uuid().optional(),
});
exports.updateBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Le titre est requis").optional(),
    isbn: zod_1.z.string().min(10, "ISBN requis").optional(),
    price: zod_1.z.number().positive("Le prix doit être positif").optional(),
    description: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    fileUrl: zod_1.z.string().optional(),
    authorId: zod_1.z.string().uuid().optional(),
    createdByAdminId: zod_1.z.string().uuid().optional(),
});
