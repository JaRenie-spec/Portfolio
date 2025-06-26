import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

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
  const { title, isbn, price, description, rating, fileUrl } = req.body;
  const { sub, roles } = (req as any).user;

  let finalAuthorId = req.body.authorId;
  if (roles.includes('author')) {
    finalAuthorId = sub;
  }

  try {
    const newBook = await prisma.book.create({
      data: { title, isbn, price, description, rating, fileUrl, authorId: finalAuthorId }
    });
    res.status(201).json(newBook);
  } catch (err: any) {
    console.error('Erreur lors de la création du livre:', err);
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
  const { title, isbn, price, description, rating, fileUrl } = req.body;
  const { sub, roles } = (req as any).user;

  let finalAuthorId = req.body.authorId;
  if (roles.includes('author')) {
    finalAuthorId = sub;
  }

  try {
    const updated = await prisma.book.update({
      where: { id },
      data: { title, isbn, price, description, rating, fileUrl, authorId: finalAuthorId }
    });
    res.json(updated);
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour', err);
    res.status(500).json({ error: 'Impossible de mettre à jour le livre ' });
  }
};

/**
 * DELETE /books/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { sub, roles } = (req as any).user;

  try {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      res.status(404).json({ error: 'Livre non trouvé' });
      return;
    }
    if (roles.includes('author') && book.authorId !== sub) {
      res.status(403).json({ error: 'Impossible de supprimer ce livre' });
      return;
    }
    await prisma.book.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err: any) {
    console.error('Erreur suppression livre :', err);
    res.status(500).json({ error: 'Impossible de supprimer le livre' });
  }
};
