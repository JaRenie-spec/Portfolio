"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findByPublicInfo = exports.findOne = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /authors
 */
const findAll = async (_req, res) => {
    const authors = await prisma.author.findMany();
    res.json(authors);
};
exports.findAll = findAll;
/**
 * GET /authors/:id
 */
const findOne = async (req, res) => {
    const { id } = req.params;
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
        res.status(404).json({ error: 'Auteur non trouvé' });
        return;
    }
    res.json(author);
};
exports.findOne = findOne;
/**GET /authors/search
 *
 */
const findByPublicInfo = async (req, res) => {
    const { pseudo, nom, prenom } = req.query;
    const authors = await prisma.author.findMany({
        where: {
            AND: [
                pseudo ? { pseudo: { contains: String(pseudo), mode: 'insensitive' } } : {},
                nom ? { lastName: { contains: String(nom), mode: 'insensitive' } } : {},
                prenom ? { firstName: { contains: String(prenom), mode: 'insensitive' } } : {},
            ],
        },
    });
    if (!authors.length) {
        res.status(404).json({ error: 'Aucun auteur trouvé' });
        return;
    }
    res.json(authors);
};
exports.findByPublicInfo = findByPublicInfo;
/**
 * PUT /authors/:id
 */
const update = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    if (!isAdmin && id !== sub) {
        res.status(403).json({ error: 'Accès refusé : vous devez agir sur votre propre profil' });
        return;
    }
    const { firstName, lastName, pseudo, email, bio, link } = req.body;
    const updated = await prisma.author.update({
        where: { id },
        data: { firstName, lastName, pseudo, email, bio, link }
    });
    res.json(updated);
};
exports.update = update;
/**
 * DELETE /authors/:id
 */
const remove = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    if (!isAdmin && id !== sub) {
        res.status(403).json({ error: 'Vous pouvez uniquement supprimer votre profil !' });
        return;
    }
    await prisma.author.delete({ where: { id } });
    res.sendStatus(204);
};
exports.remove = remove;
