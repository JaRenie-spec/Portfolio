import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
/**
 * GET /authors
 */
export const findAll: RequestHandler = async (_req, res) => {
  const authors = await prisma.author.findMany();
  res.json(authors);
};

/**
 * GET /authors/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) {
    res.status(404).json({ error: 'Auteur non trouvé' });
    return;
  }
  res.json(author);
};

/**
 * POST /authors
 */
export const create: RequestHandler = async (req, res) => {
  const { firstName, lastName, pseudo, email, password, bio, link } = req.body;
  const newAuthor = await prisma.author.create({
    data: { firstName, lastName, pseudo, email, password, bio, link }
  });
  res.status(201).json(newAuthor);
};

/**
 * PUT /authors/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, pseudo, email, bio, link } = req.body;
  const updated = await prisma.author.update({
    where: { id },
    data: { firstName, lastName, pseudo, email, bio, link }
  });
  res.json(updated);
};

/**
 * DELETE /authors/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.author.delete({ where: { id } });
  res.sendStatus(204);
};
