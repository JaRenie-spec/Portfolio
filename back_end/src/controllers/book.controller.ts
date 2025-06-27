import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect'

const prisma = new PrismaClient();

// Type local pour éviter les erreurs de typage avec l'author inclus
type BookWithAuthor = {
  title: string;
  isbn: string;
  price: number;
  rating: number | null;
  fileUrl: string;
  author: {
    pseudo: string | null;
    firstName: string;
    lastName: string;
  } | null;
};

/**
 * GET /books
 */
export const findAll: RequestHandler = async (_req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
};

/**
 * GET /books/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    res.status(404).json({ error: 'Livre non trouvé' });
    return;
  }
  res.json(book);
};

/**
 * POST /books
 */
export const create: RequestHandler = async (req, res) => {
  const { sub, roles } = (req as AuthenticatedRequest).user;
  const isAdmin = roles.includes('admin');

  // 1️⃣ Empêcher un author de spécifier un other authorId
  if (!isAdmin && req.body.authorId && req.body.authorId !== sub) {
    res.status(403).json({ error: 'Impossible de créer un livre pour un autre auteur' });
		return;
  }

  // 2️⃣ Déterminer l’auteur final
  const finalAuthorId = isAdmin
    ? req.body.authorId     // admin peut choisir
    : sub;                  // author forcé à lui-même

  const { title, isbn, price, description, rating, fileUrl } = req.body;
  try {
    const newBook = await prisma.book.create({
      data: { title, isbn, price, description, rating, fileUrl, authorId: finalAuthorId }
    });
    res.status(201).json(newBook);
  } catch (err: any) {
    console.error('Erreur création livre:', err);
    res.status(500).json({ error: 'Erreur lors de la création du livre.' });
  }
};

/**
 * GET /books/search
 */
export const findByPublicInfo: RequestHandler = async (req, res) => {
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

    const publicBooks = (books as BookWithAuthor[]).map((book) => ({
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
  } catch (error) {
    console.error('Erreur recherche livres :', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des livres' });
  }
};

/**
 * PUT /books/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { sub, roles } = (req as AuthenticatedRequest).user;
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
    ? req.body.authorId ?? book.authorId  // admin peut changer ou conserver
    : sub;                                 // author reste lui-même

  const { title, isbn, price, description, rating, fileUrl } = req.body;
  try {
    const updated = await prisma.book.update({
      where: { id },
      data: { title, isbn, price, description, rating, fileUrl, authorId: finalAuthorId }
    });
    res.json(updated);
  } catch (err: any) {
    console.error('Erreur mise à jour livre :', err);
    res.status(500).json({ error: 'Impossible de mettre à jour le livre.' });
  }
};

/**
 * DELETE /books/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { sub, roles } = (req as AuthenticatedRequest).user;
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
  } catch (err: any) {
    console.error('Erreur suppression livre :', err);
    res.status(500).json({ error: 'Impossible de supprimer le livre.' });
  }
};
