"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findOne = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /reviews
 */
const findAll = async (_req, res) => {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
};
exports.findAll = findAll;
/**
 * GET /reviews/:id
 */
const findOne = async (req, res) => {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
        res.status(404).json({ error: 'Avis non trouvé' });
        return;
    }
    res.json(review);
};
exports.findOne = findOne;
/**
 * POST /reviews
 */
const create = async (req, res) => {
    const userId = req.user.sub;
    const { comment, rating, bookId, authorId } = req.body;
    const newReview = await prisma.review.create({
        data: { comment, rating, bookId, userId, authorId }
    });
    res.status(201).json(newReview);
};
exports.create = create;
/**
 * PUT /reviews/:id
 */
const update = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    // 1️⃣ récupérer l’avis
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
        res.status(404).json({ error: 'Avis non trouvé' });
        return;
    }
    // 2️⃣ contrôle d’autorisation
    if (!isAdmin && review.userId !== sub) {
        res.status(403).json({ error: 'Impossible de modifier cet avis' });
        return;
    }
    // 3️⃣ mise à jour
    const updated = await prisma.review.update({
        where: { id },
        data: req.body
    });
    res.json(updated);
};
exports.update = update;
/**
 * DELETE /reviews/:id
 */
const remove = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
        res.status(404).json({ error: 'Avis non trouvé' });
        return;
    }
    if (!isAdmin && review.userId !== sub) {
        res.status(403).json({ error: 'Impossible de supprimer cet avis' });
        return;
    }
    await prisma.review.delete({ where: { id } });
    res.sendStatus(204);
};
exports.remove = remove;
