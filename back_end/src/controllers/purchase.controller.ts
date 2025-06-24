import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /purchases
 */
export const findAll: RequestHandler = async (_req, res) => {
  const purchases = await prisma.purchase.findMany();
  res.json(purchases);
};

/**
 * GET /purchases/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const purchase = await prisma.purchase.findUnique({ where: { id } });
  if (!purchase) {
    res.status(404).json({ error: 'Achat non trouvé' });
    return;
  }
  res.json(purchase);
};

/**
 * POST /purchases
 */
export const create: RequestHandler = async (req, res) => {
  const { bookId } = req.body;
  const userId = (req as any).user.sub as string; // ID Keycloak du client
  const newPurchase = await prisma.purchase.create({
    data: { bookId, userId },
  });
  res.status(201).json(newPurchase);
};

/**
 * DELETE /purchases/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.purchase.delete({ where: { id } });
  res.sendStatus(204);
};
