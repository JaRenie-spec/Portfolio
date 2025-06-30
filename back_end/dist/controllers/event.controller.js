"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findOne = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /events
 */
const findAll = async (_req, res) => {
    const events = await prisma.event.findMany();
    res.json(events);
};
exports.findAll = findAll;
/**
 * GET /events/:id
 */
const findOne = async (req, res) => {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
        res.status(404).json({ error: 'Événement non trouvé' });
        return;
    }
    res.json(event);
};
exports.findOne = findOne;
/**
 * POST /events
 */
const create = async (req, res) => {
    const { title, description, dateEvent, authorId: bodyAuthorId } = req.body;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    // un auteur ne peut pas créer pour un autre auteur
    if (!isAdmin && bodyAuthorId && bodyAuthorId !== sub) {
        res.status(403).json({ error: 'Impossible de créer un événement pour un autre auteur' });
        return;
    }
    const finalAuthorId = isAdmin
        ? bodyAuthorId || sub
        : sub;
    const newEvent = await prisma.event.create({
        data: { title, description, dateEvent, authorId: finalAuthorId }
    });
    res.status(201).json(newEvent);
};
exports.create = create;
/**
 * PUT /events/:id
 */
const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, dateEvent, authorId: bodyAuthorId } = req.body;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    // 1️⃣ récupérer l’événement
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
        res.status(404).json({ error: 'Événement non trouvé' });
        return;
    }
    // 2️⃣ si pas admin, vérifier proprio
    if (!isAdmin && event.authorId !== sub) {
        res.status(403).json({ error: 'Impossible de modifier cet événement' });
        return;
    }
    // 3️⃣ un auteur ne peut pas réassigner à un autre authorId
    if (!isAdmin && bodyAuthorId && bodyAuthorId !== sub) {
        res.status(403).json({ error: 'Impossible de changer l’auteur de l’événement' });
        return;
    }
    const finalAuthorId = isAdmin
        ? bodyAuthorId || event.authorId
        : sub;
    const updated = await prisma.event.update({
        where: { id },
        data: { title, description, dateEvent, authorId: finalAuthorId }
    });
    res.json(updated);
};
exports.update = update;
/**
 * DELETE /events/:id uniquement l'auteur
 */
const remove = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
        res.status(404).json({ error: 'Événement non trouvé' });
        return;
    }
    if (!isAdmin && event.authorId !== sub) {
        res.status(403).json({ error: 'Impossible de supprimer cet événement' });
        return;
    }
    await prisma.event.delete({ where: { id } });
    res.sendStatus(204);
};
exports.remove = remove;
