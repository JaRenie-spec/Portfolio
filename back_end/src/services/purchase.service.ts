import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPurchase = (data: {
  bookId: number;
  userId?: number;
  authorId?: number;
}) => prisma.purchase.create({ data });

export const getAllPurchases = () => prisma.purchase.findMany();

export const getPurchaseById = (id: number) =>
  prisma.purchase.findUnique({ where: { id } });

export const updatePurchase = (id: number, data: Partial<{ bookId: number; userId?: number; authorId?: number; }>) =>
  prisma.purchase.update({ where: { id }, data });

export const softDeletePurchase = (id: number) =>
  prisma.purchase.update({ where: { id }, data: { deletedAt: new Date() } });
