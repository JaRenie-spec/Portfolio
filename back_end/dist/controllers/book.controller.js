"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findByPublicInfo = exports.create = exports.findOne = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /books
 */
const findAll = async (_req, res) => {
    const books = await prisma.book.findMany();
    res.json(books);
};
exports.findAll = findAll;
/**
 * GET /books/:id
 */
const findOne = async (req, res) => {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
        res.status(404).json({ error: 'Livre non trouvé' });
        return;
    }
    res.json(book);
};
exports.findOne = findOne;
/**
 * POST /books
 */
const create = async (req, res) => {
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    // 1️⃣ Empêcher un author de spécifier un other authorId
    if (!isAdmin && req.body.authorId && req.body.authorId !== sub) {
        res.status(403).json({ error: 'Impossible de créer un livre pour un autre auteur' });
        return;
    }
    // 2️⃣ Déterminer l’auteur final
    const finalAuthorId = isAdmin
        ? req.body.authorId // admin peut choisir
        : sub; // author forcé à lui-même
    const { title, isbn, price, description, rating, fileUrl } = req.body;
    try {
        const newBook = await prisma.book.create({
            data: { title, isbn, price, description, rating, fileUrl, authorId: finalAuthorId }
        });
        res.status(201).json(newBook);
    }
    catch (err) {
        console.error('Erreur création livre:', err);
        res.status(500).json({ error: 'Erreur lors de la création du livre.' });
    }
};
exports.create = create;
/**
 * GET /books/search
 */
const findByPublicInfo = async (req, res) => {
    const { title, isbn, pseudo, firstName, lastName } = req.query;
    try {
        const books = await prisma.book.findMany({
            where: {
                AND: [
                    title ? { title: { contains: String(title), mode: 'insensitive' } } : {},
                    isbn ? { isbn: { contains: String(isbn), mode: 'insensitive' } } : {},
                    {
                        author: {
                            AND: [
                                pseudo ? { pseudo: { contains: String(pseudo), mode: 'insensitive' } } : {},
                                firstName ? { firstName: { contains: String(firstName), mode: 'insensitive' } } : {},
                                lastName ? { lastName: { contains: String(lastName), mode: 'insensitive' } } : {},
                            ],
                        },
                    },
                ],
            },
            include: {
                author: {
                    select: {
                        pseudo: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!books.length) {
            res.status(404).json({ error: 'Aucun livre trouvé' });
            return;
        }
        const publicBooks = books.map((book) => ({
            title: book.title,
            isbn: book.isbn,
            price: book.price,
            rating: book.rating,
            fileUrl: book.fileUrl,
            author: {
                pseudo: book.author?.pseudo,
                firstName: book.author?.firstName,
                lastName: book.author?.lastName,
            },
        }));
        res.json(publicBooks);
    }
    catch (error) {
        console.error('Erreur recherche livres :', error);
        res.status(500).json({ error: 'Erreur lors de la recherche des livres' });
    }
};
exports.findByPublicInfo = findByPublicInfo;
/**
 * PUT /books/:id
 */
const update = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    // Récupérer le livre et vérifier existence
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
        res.status(404).json({ error: 'Livre non trouvé' });
        return;
    }
    // 1️⃣ Empêcher un author de toucher un livre qui n'est pas le sien
    if (!isAdmin && book.authorId !== sub) {
        res.status(403).json({ error: 'Impossible de modifier ce livre' });
        return;
    }
    // 2️⃣ Empêcher un author de réassigner le livre à un autre auteur
    if (!isAdmin && req.body.authorId && req.body.authorId !== sub) {
        res.status(403).json({ error: 'Impossible de changer l’auteur du livre' });
        return;
    }
    // 3️⃣ Déterminer l’auteur final pour l’update
    const finalAuthorId = isAdmin
        ? req.body.authorId ?? book.authorId // admin peut changer ou conserver
        : sub; // author reste lui-même
    const { title, isbn, price, description, rating, fileUrl } = req.body;
    try {
        const updated = await prisma.book.update({
            where: { id },
            data: { title, isbn, price, description, rating, fileUrl, authorId: finalAuthorId }
        });
        res.json(updated);
    }
    catch (err) {
        console.error('Erreur mise à jour livre :', err);
        res.status(500).json({ error: 'Impossible de mettre à jour le livre.' });
    }
};
exports.update = update;
/**
 * DELETE /books/:id
 */
const remove = async (req, res) => {
    const { id } = req.params;
    const { sub, roles } = req.user;
    const isAdmin = roles.includes('admin');
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
        res.status(404).json({ error: 'Livre non trouvé' });
        return;
    }
    // Seul l’admin ou le propriétaire peut supprimer
    if (!isAdmin && book.authorId !== sub) {
        res.status(403).json({ error: 'Impossible de supprimer ce livre' });
        return;
    }
    try {
        await prisma.book.delete({ where: { id } });
        res.sendStatus(204);
    }
    catch (err) {
        console.error('Erreur suppression livre :', err);
        res.status(500).json({ error: 'Impossible de supprimer le livre.' });
    }
};
exports.remove = remove;
