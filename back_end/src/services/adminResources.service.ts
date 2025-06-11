import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface AllResources {
  users:       Awaited<ReturnType<typeof prisma.user.findMany>>;
  authors:     Awaited<ReturnType<typeof prisma.author.findMany>>;
  books:       Awaited<ReturnType<typeof prisma.book.findMany>>;
  events:      Awaited<ReturnType<typeof prisma.event.findMany>>;
  reviews:     Awaited<ReturnType<typeof prisma.review.findMany>>;
  purchases:   Awaited<ReturnType<typeof prisma.purchase.findMany>>;
  favorites:   Awaited<ReturnType<typeof prisma.favorite.findMany>>;
  stats:       Awaited<ReturnType<typeof prisma.stat.findMany>>;
}

export const getAllResources = async (): Promise<AllResources> => {
  // On peut lancer en parallèle pour gagner en performances
  const [
    users,
    authors,
    books,
    events,
    reviews,
    purchases,
    favorites,
    stats,
  ] = await Promise.all([
    prisma.user.findMany({ where: { deletedAt: null } }),
    prisma.author.findMany({ where: { deletedAt: null } }),
    prisma.book.findMany({ where: { deletedAt: null } }),
    prisma.event.findMany({ where: { deletedAt: null } }),
    prisma.review.findMany({ where: { deletedAt: null } }),
    prisma.purchase.findMany(),
    prisma.favorite.findMany(),
    prisma.stat.findMany(),
  ]);

  return { users, authors, books, events, reviews, purchases, favorites, stats };
};
export const deleteAllResources = async (): Promise<void> => {
	// On peut lancer en parallèle pour gagner en performances
	await Promise.all([
		prisma.user.deleteMany({ where: { deletedAt: null } }),
		prisma.author.deleteMany({ where: { deletedAt: null } }),
		prisma.book.deleteMany({ where: { deletedAt: null } }),
		prisma.event.deleteMany({ where: { deletedAt: null } }),
		prisma.review.deleteMany({ where: { deletedAt: null } }),
		prisma.purchase.deleteMany(),
		prisma.favorite.deleteMany(),
		prisma.stat.deleteMany(),
	]);
};
