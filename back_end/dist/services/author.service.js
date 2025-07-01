"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuthor = exports.updateAuthor = exports.getAuthorById = exports.getAllAuthors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 🔹 Lister tous les auteurs (avec relations)
const getAllAuthors = async () => {
    try {
        return await prisma.author.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            include: {
                books: true,
                events: true,
                reviews: true,
            },
        });
    }
    catch (err) {
        console.error("Erreur récupération auteurs :", err);
        throw new Error("Impossible de récupérer les auteurs.");
    }
};
exports.getAllAuthors = getAllAuthors;
// 🔹 Récupérer un auteur par ID (avec relations)
const getAuthorById = async (id) => {
    try {
        const author = await prisma.author.findFirst({
            where: { id: id, deletedAt: null },
            include: {
                books: true,
                events: true,
                reviews: true,
            },
        });
        if (!author) {
            throw new Error("Auteur non trouvé.");
        }
        return author;
    }
    catch (err) {
        console.error("Erreur récupération auteur par ID :", err);
        if (err instanceof Error) {
            throw new Error(err.message || "Erreur lors de la recherche de l’auteur.");
        }
        throw new Error("Erreur lors de la recherche de l’auteur.");
    }
};
exports.getAuthorById = getAuthorById;
// 🔹 Mettre à jour un auteur
const updateAuthor = async (id, data) => {
    try {
        return await prisma.author.update({
            where: { id: id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }
    catch (err) {
        console.error("Erreur mise à jour auteur :", err);
        throw new Error("Impossible de mettre à jour l’auteur.");
    }
};
exports.updateAuthor = updateAuthor;
// 🔹 Supprimer un auteur (soft delete)
const deleteAuthor = async (id) => {
    try {
        return await prisma.author.update({
            where: { id: id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    catch (err) {
        console.error("Erreur suppression auteur :", err);
        throw new Error("Impossible de supprimer l’auteur.");
    }
};
exports.deleteAuthor = deleteAuthor;
