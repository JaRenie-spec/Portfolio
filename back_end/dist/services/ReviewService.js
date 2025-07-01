"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ReviewService {
    async create(data) {
        const bookExists = await prisma.book.findUnique({
            where: { id: data.bookId },
        });
        if (!bookExists) {
            throw new Error('Book not found');
        }
        const authorExists = await prisma.author.findUnique({
            where: { id: data.authorId },
        });
        if (!authorExists) {
            throw new Error('Author not found');
        }
        return prisma.review.create({
            data: {
                comment: data.comment,
                rating: data.rating,
                bookId: data.bookId,
                authorId: data.authorId,
                userId: data.userId,
            },
        });
    }
}
exports.ReviewService = ReviewService;
