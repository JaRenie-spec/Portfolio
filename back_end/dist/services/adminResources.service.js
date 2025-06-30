"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllResources = exports.getAllResources = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllResources = async () => {
    // On peut lancer en parallèle pour gagner en performances
    const [users, authors, books, events, reviews, purchases, favorites, stats,] = await Promise.all([
        prisma.user.findMany({ where: { deletedAt: null } }),
        prisma.author.findMany({ where: { deletedAt: null } }),
        prisma.book.findMany({ where: { deletedAt: null } }),
        prisma.event.findMany({ where: { deletedAt: null } }),
        prisma.review.findMany({ where: { deletedAt: null } }),
        prisma.purchase.findMany(),
        prisma.favorite.findMany(),
        prisma.stat.findMany(),
    ]);
    return { users, authors, books, events, reviews, purchases, favorites, stats };
};
exports.getAllResources = getAllResources;
const deleteAllResources = async () => {
    // On peut lancer en parallèle pour gagner en performances
    await Promise.all([
        prisma.user.deleteMany({ where: { deletedAt: null } }),
        prisma.author.deleteMany({ where: { deletedAt: null } }),
        prisma.book.deleteMany({ where: { deletedAt: null } }),
        prisma.event.deleteMany({ where: { deletedAt: null } }),
        prisma.review.deleteMany({ where: { deletedAt: null } }),
        prisma.purchase.deleteMany(),
        prisma.favorite.deleteMany(),
        prisma.stat.deleteMany(),
    ]);
};
exports.deleteAllResources = deleteAllResources;
