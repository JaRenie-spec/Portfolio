import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /reviews
 */
export const findAll: RequestHandler = async (_req, res) => {
  const reviews = await prisma.review.findMany();
  res.json(reviews);
};

/**
 * GET /reviews/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    res.status(404).json({ error: 'Avis non trouvé' });
    return;
  }
  res.json(review);
};

/**
 * POST /reviews
 */
export const create: RequestHandler = async (req, res) => {
  const userId = (req as any).user.sub as string;
  const { comment, rating, bookId, authorId } = req.body;
  const newReview = await prisma.review.create({
    data: { comment, rating, bookId, authorId, userId }
  });
  res.status(201).json(newReview);
};

/**
 * PUT /reviews/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const data = req.body; // valide par Zod, contient comment? rating?
  const updated = await prisma.review.update({
    where: { id },
    data
  });
  res.json(updated);
};

/**
 * DELETE /reviews/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.review.delete({ where: { id } });
  res.sendStatus(204);
};
