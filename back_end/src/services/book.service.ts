import { PrismaClient } from "@prisma/client";
import { CreateBookInput, UpdateBookInput } from "../types/book.schema";

const prisma = new PrismaClient();

// Création
export const createBook = async (data: CreateBookInput) => {
  if (!data.fileUrl) {
    throw new Error("Le champ fileUrl est obligatoire pour créer un livre.");
  }
  return await prisma.book.create({
    data: {
      ...data,
      fileUrl: data.fileUrl, // Ensures fileUrl is always a string
      description: data.description ?? null,
      rating: data.rating ?? null,
      createdByAdminId: data.createdByAdminId ?? null,
    },
    include: {
      author: true,
      reviews: true,
      purchases: true,
      favorites: true,
      stat: true,
      createdByAdmin: true,
    },
  });
};

// Filtrage / pagination
interface BookFilters {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}
export const getAllBooks = async (filters: BookFilters = {}) => {
  const { page = 1, limit = 10, minPrice, maxPrice, minRating } = filters;
  const skip = (page - 1) * limit;
  const where: any = { deletedAt: null };
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice != null && { gte: minPrice }),
      ...(maxPrice != null && { lte: maxPrice }),
    };
  }
  if (minRating != null) {
    where.rating = { gte: minRating };
  }

  return prisma.book.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      reviews: true,
      purchases: true,
      favorites: true,
      stat: true,
      createdByAdmin: true,
    },
  });
};

// Récupération simple
export const getBookById = async (id: number) => {
  try {
    const book = await prisma.book.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: true,
        reviews: true,
        purchases: true,
        favorites: true,
        stat: true,
        createdByAdmin: true,
      },
    });
    if (!book) throw new Error("Livre non trouvé");
    return book;
  } catch (err: any) {
    console.error("Erreur getBookById:", err);
    throw new Error("Erreur lors de la récupération du livre");
  }
};

// Mise à jour
export const updateBook = async (id: number, data: UpdateBookInput) => {
  try {
    return await prisma.book.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        author: true,
        reviews: true,
        purchases: true,
        favorites: true,
        stat: true,
        createdByAdmin: true,
      },
    });
  } catch (err: any) {
    console.error("Erreur updateBook:", err);
    throw new Error("Erreur lors de la mise à jour du livre");
  }
};

// Soft delete
export const deleteBook = async (id: number) => {
  try {
    return prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (err: any) {
    console.error("Erreur deleteBook:", err);
    throw new Error("Erreur lors de la suppression du livre");
  }
};

// Recherche
export const searchBooksByTitle = async (title: string) => {
  try {
    return prisma.book.findMany({
      where: {
        deletedAt: null,
        title: { contains: title, mode: "insensitive" },
      },
      include: {
        author: true,
        reviews: true,
        purchases: true,
        favorites: true,
        stat: true,
        createdByAdmin: true,
      },
    });
  } catch (err: any) {
    console.error("Erreur searchBooksByTitle:", err);
    throw new Error("Erreur lors de la recherche par titre");
  }
};

export const searchBooksByAuthor = async (authorId: number) => {
  try {
    return prisma.book.findMany({
      where: { deletedAt: null, authorId },
      include: {
        author: true,
        reviews: true,
        purchases: true,
        favorites: true,
        stat: true,
        createdByAdmin: true,
      },
    });
  } catch (err: any) {
    console.error("Erreur searchBooksByAuthor:", err);
    throw new Error("Erreur lors de la recherche par auteur");
  }
};

// Mise à jour du fileUrl
export const updateBookFileUrl = async (id: number, fileUrl: string) => {
  try {
    return prisma.book.update({
      where: { id },
      data: { fileUrl, updatedAt: new Date() },
    });
  } catch (err: any) {
    console.error("Erreur updateBookFileUrl:", err);
    throw new Error("Erreur lors de la mise à jour du fichier");
  }
};
