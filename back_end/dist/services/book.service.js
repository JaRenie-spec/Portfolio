"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookFileUrl = exports.searchBooksByAuthor = exports.searchBooksByTitle = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Création
const createBook = async (data) => {
    if (!data.fileUrl) {
        throw new Error("Le champ fileUrl est obligatoire pour créer un livre.");
    }
    return await prisma.book.create({
        data: {
            ...data,
            fileUrl: data.fileUrl, // Ensures fileUrl is always a string
            description: data.description ?? null,
            rating: data.rating ?? null,
            createdByAdminId: data.createdByAdminId ?? null,
        },
        include: {
            author: true,
            reviews: true,
            purchases: true,
            favorites: true,
            stat: true,
            createdByAdmin: true,
        },
    });
};
exports.createBook = createBook;
const getAllBooks = async (filters = {}) => {
    const { page = 1, limit = 10, minPrice, maxPrice, minRating } = filters;
    const skip = (page - 1) * limit;
    const where = { deletedAt: null };
    if (minPrice || maxPrice) {
        where.price = {
            ...(minPrice != null && { gte: minPrice }),
            ...(maxPrice != null && { lte: maxPrice }),
        };
    }
    if (minRating != null) {
        where.rating = { gte: minRating };
    }
    return prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            reviews: true,
            purchases: true,
            favorites: true,
            stat: true,
            createdByAdmin: true,
        },
    });
};
exports.getAllBooks = getAllBooks;
// Récupération simple
const getBookById = async (id) => {
    try {
        const book = await prisma.book.findFirst({
            where: { id, deletedAt: null },
            include: {
                author: true,
                reviews: true,
                purchases: true,
                favorites: true,
                stat: true,
                createdByAdmin: true,
            },
        });
        if (!book)
            throw new Error("Livre non trouvé");
        return book;
    }
    catch (err) {
        console.error("Erreur getBookById:", err);
        throw new Error("Erreur lors de la récupération du livre");
    }
};
exports.getBookById = getBookById;
// Mise à jour
const updateBook = async (id, data) => {
    try {
        return await prisma.book.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                author: true,
                reviews: true,
                purchases: true,
                favorites: true,
                stat: true,
                createdByAdmin: true,
            },
        });
    }
    catch (err) {
        console.error("Erreur updateBook:", err);
        throw new Error("Erreur lors de la mise à jour du livre");
    }
};
exports.updateBook = updateBook;
// Soft delete
const deleteBook = async (id) => {
    try {
        return prisma.book.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    catch (err) {
        console.error("Erreur deleteBook:", err);
        throw new Error("Erreur lors de la suppression du livre");
    }
};
exports.deleteBook = deleteBook;
// Recherche
const searchBooksByTitle = async (title) => {
    try {
        return prisma.book.findMany({
            where: {
                deletedAt: null,
                title: { contains: title, mode: "insensitive" },
            },
            include: {
                author: true,
                reviews: true,
                purchases: true,
                favorites: true,
                stat: true,
                createdByAdmin: true,
            },
        });
    }
    catch (err) {
        console.error("Erreur searchBooksByTitle:", err);
        throw new Error("Erreur lors de la recherche par titre");
    }
};
exports.searchBooksByTitle = searchBooksByTitle;
const searchBooksByAuthor = async (authorId) => {
    try {
        return prisma.book.findMany({
            where: { deletedAt: null, authorId },
            include: {
                author: true,
                reviews: true,
                purchases: true,
                favorites: true,
                stat: true,
                createdByAdmin: true,
            },
        });
    }
    catch (err) {
        console.error("Erreur searchBooksByAuthor:", err);
        throw new Error("Erreur lors de la recherche par auteur");
    }
};
exports.searchBooksByAuthor = searchBooksByAuthor;
// Mise à jour du fileUrl
const updateBookFileUrl = async (id, fileUrl) => {
    try {
        return prisma.book.update({
            where: { id },
            data: { fileUrl, updatedAt: new Date() },
        });
    }
    catch (err) {
        console.error("Erreur updateBookFileUrl:", err);
        throw new Error("Erreur lors de la mise à jour du fichier");
    }
};
exports.updateBookFileUrl = updateBookFileUrl;
