"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.create = exports.findOne = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /purchases
 */
const findAll = async (_req, res) => {
    const purchases = await prisma.purchase.findMany();
    res.json(purchases);
};
exports.findAll = findAll;
/**
 * GET /purchases/:id
 */
const findOne = async (req, res) => {
    const { id } = req.params;
    const purchase = await prisma.purchase.findUnique({ where: { id } });
    if (!purchase) {
        res.status(404).json({ error: 'Achat non trouvé' });
        return;
    }
    res.json(purchase);
};
exports.findOne = findOne;
/**
 * POST /purchases
 */
const create = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.sub; // ID Keycloak du client
    const newPurchase = await prisma.purchase.create({
        data: { bookId, userId },
    });
    res.status(201).json(newPurchase);
};
exports.create = create;
/**
 * DELETE /purchases/:id
 */
const remove = async (req, res) => {
    const { id } = req.params;
    await prisma.purchase.delete({ where: { id } });
    res.sendStatus(204);
};
exports.remove = remove;
