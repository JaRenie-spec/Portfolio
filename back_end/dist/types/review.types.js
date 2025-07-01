"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReviewSchema = void 0;
const zod_1 = require("zod");
// Schema for creating a new review (userId is injected in the controller)
exports.CreateReviewSchema = zod_1.z.object({
    comment: zod_1.z.string().min(1).max(1000),
    rating: zod_1.z.number().min(1).max(5),
    bookId: zod_1.z.string().uuid(),
    authorId: zod_1.z.string().uuid(),
});
