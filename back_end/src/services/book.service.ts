import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function getAllBooks() {
  return prisma.book.findMany();
}
