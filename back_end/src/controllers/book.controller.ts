import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
		res.status(500).json({ error: 'Impossible de mettre à jour le livre '});
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
			res.status(403).json({ error: 'Impossible de supprimer ce livre'});
			return;
		}
		await prisma.book.delete({ where: { id } });
		res.sendStatus(204);
	} catch (err: any) {
		console.error('Erreur suppression livre :', err);
		res.status(500).json({ error: 'Impossible de supprimer le livre' });
	}
};
