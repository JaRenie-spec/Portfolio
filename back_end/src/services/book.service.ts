import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBook = async (data) => {
  try {
    return await prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        price: data.price,
        description: data.description ?? null,
        rating: data.rating ?? null,
        fileUrl: data.fileUrl,
        authorId: data.authorId,
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
  } catch (err: any) {
    console.error("Erreur création livre:", err);
    throw new Error("Erreur lors de la création du livre");
  }
};

export const getAllBooks = async () => {
  try {
    return await prisma.book.findMany({
      where: { deletedAt: null },
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
  } catch (err: any) {
    console.error("Erreur récupération livres:", err);
    throw new Error("Erreur lors de la récupération des livres");
  }
};

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
    console.error("Erreur lors de la récupération du livre par ID:", err);
    throw new Error("Erreur lors de la récupération du livre");
  }
};

export const updateBook = async (id: number, data) => {
  try {
    return await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        isbn: data.isbn,
        price: data.price,
        description: data.description ?? null,
        rating: data.rating ?? null,
        fileUrl: data.fileUrl,
        authorId: data.authorId,
        createdByAdminId: data.createdByAdminId ?? null,
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
    console.error("Erreur mise à jour livre:", err);
    throw new Error("Erreur lors de la mise à jour du livre");
  }
};

export const deleteBook = async (id: number) => {
  try {
    return await prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (err: any) {
    console.error("Erreur suppression livre:", err);
    throw new Error("Erreur lors de la suppression du livre");
  }
};

export const searchBooksByTitle = async (title: string) => {
  try {
    return await prisma.book.findMany({
      where: {
        deletedAt: null,
        title: {
          contains: title,
          mode: "insensitive",
        },
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
    console.error("Erreur recherche livre par titre:", err);
    throw new Error("Erreur lors de la recherche par titre");
  }
};

export const searchBooksByAuthor = async (authorId: number) => {
  try {
    return await prisma.book.findMany({
      where: {
        deletedAt: null,
        authorId,
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
    console.error("Erreur recherche livre par auteur:", err);
    throw new Error("Erreur lors de la recherche par auteur");
  }
};

export const updateBookFileUrl = async (id: number, fileUrl: string) => {
  try {
    return await prisma.book.update({
      where: { id },
      data: {
        fileUrl,
        updatedAt: new Date(),
      },
    });
  } catch (err: any) {
    console.error("Erreur mise à jour fichier:", err);
    throw new Error("Erreur mise à jour fichier");
  }
};
