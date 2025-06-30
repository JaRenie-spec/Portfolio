import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect';

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
  const userId = (req as AuthenticatedRequest).user.sub;
  const { comment, rating, bookId, authorId } = req.body;

  const newReview = await prisma.review.create({
    data: { comment, rating, bookId, userId, authorId }
  });
  res.status(201).json(newReview);
};

/**
 * PUT /reviews/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { sub, roles } = (req as AuthenticatedRequest).user;
  const isAdmin = roles.includes('admin');

  // 1️⃣ récupérer l’avis
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    res.status(404).json({ error: 'Avis non trouvé' });
		return;
  }

  // 2️⃣ contrôle d’autorisation
  if (!isAdmin && review.userId !== sub) {
    res.status(403).json({ error: 'Impossible de modifier cet avis' });
		return;
  }

  // 3️⃣ mise à jour
  const updated = await prisma.review.update({
    where: { id },
    data: req.body
  });
  res.json(updated);
};

/**
 * DELETE /reviews/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { sub, roles } = (req as AuthenticatedRequest).user;
  const isAdmin = roles.includes('admin');

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    res.status(404).json({ error: 'Avis non trouvé' });
		return;
  }

  if (!isAdmin && review.userId !== sub) {
    res.status(403).json({ error: 'Impossible de supprimer cet avis' });
		return;
  }

  await prisma.review.delete({ where: { id } });
  res.sendStatus(204);
};
