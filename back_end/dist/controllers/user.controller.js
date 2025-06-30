"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.updateMe = exports.me = exports.findOne = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /api/users
 * (superadmin uniquement)
 */
const findAll = async (_req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
};
exports.findAll = findAll;
/**
 * GET /api/users/:id
 * (admin & superadmin uniquement)
 */
const findOne = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    res.json(user);
};
exports.findOne = findOne;
/**
 * GET /api/users/me
 * (utilisateur authentifié)
 */
const me = async (req, res) => {
    const sub = req.user.sub;
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }
    res.json(user);
};
exports.me = me;
/**
 * PUT /api/users/me
 * (utilisateur authentifié)
 */
const updateMe = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const { firstName, lastName } = req.body;
    const isAdmin = roles.includes('admin');
    if (!isAdmin && id !== sub) {
        res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que votre propre compte' });
        return;
    }
    const user = await prisma.user.update({
        where: { id },
        data: { firstName, lastName },
    });
    res.json(user);
};
exports.updateMe = updateMe;
/**
 * DELETE /api/users/:id
 * (admin & superadmin uniquement)
 */
const remove = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    if (!isAdmin && id !== sub) {
        res.status(403).json({ error: 'Accès refusé : vous ne pouvez supprimer que votre propre compte' });
        return;
    }
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
};
exports.remove = remove;
