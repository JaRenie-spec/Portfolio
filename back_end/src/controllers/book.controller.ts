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
  const { title, isbn, price, description, rating, fileUrl, authorId } = req.body;
  const newBook = await prisma.book.create({
    data: { title, isbn, price, description, rating, fileUrl, authorId }
  });
  res.status(201).json(newBook);
};

/**
 * PUT /books/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, isbn, price, description, rating, fileUrl, authorId } = req.body;
  const updated = await prisma.book.update({
    where: { id },
    data: { title, isbn, price, description, rating, fileUrl, authorId }
  });
  res.json(updated);
};

/**
 * DELETE /books/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.book.delete({ where: { id } });
  res.sendStatus(204);
};
