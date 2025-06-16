import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPurchase = (data: {
  bookId: string;
  userId?: string;
  authorId?: string;
}) => prisma.purchase.create({ data });

export const getAllPurchases = () => prisma.purchase.findMany();

export const getPurchaseById = (id: string) =>
  prisma.purchase.findUnique({ where: { id } });

export const updatePurchase = (id: string, data: Partial<{ bookId: string; userId?: string; authorId?: string; }>) =>
  prisma.purchase.update({ where: { id }, data });

export const softDeletePurchase = (id: string) =>
  prisma.purchase.update({ where: { id }, data: { deletedAt: new Date() } });
