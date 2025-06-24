import { PrismaClient } from "@prisma/client";
import { CreateAuthorDTO } from "../types";

const prisma = new PrismaClient();

// 🔹 Créer un auteur
export const createAuthor = async (data: CreateAuthorDTO) => {
  try {
    return await prisma.author.create({
      data: { ...data },
    });
  } catch (err) {
    console.error("Erreur création auteur :", err);
    throw new Error("Impossible de créer l’auteur.");
  }
};

// 🔹 Lister tous les auteurs (avec relations)
export const getAllAuthors = async () => {
  try {
    return await prisma.author.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        books: true,
        events: true,
        reviews: true,
      },
    });
  } catch (err) {
    console.error("Erreur récupération auteurs :", err);
    throw new Error("Impossible de récupérer les auteurs.");
  }
};

// 🔹 Récupérer un auteur par ID (avec relations)
export const getAuthorById = async (id: string) => {
  try {
    const author = await prisma.author.findFirst({
      where: { id: id, deletedAt: null },
      include: {
        books: true,
        events: true,
        reviews: true,
      },
    });

    if (!author) {
      throw new Error("Auteur non trouvé.");
    }

    return author;
  } catch (err) {
    console.error("Erreur récupération auteur par ID :", err);
    if (err instanceof Error) {
      throw new Error(err.message || "Erreur lors de la recherche de l’auteur.");
    }
    throw new Error("Erreur lors de la recherche de l’auteur.");
  }
};

// 🔹 Mettre à jour un auteur
export const updateAuthor = async (
  id: string,
  data: Partial<CreateAuthorDTO>
) => {
  try {
    return await prisma.author.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Erreur mise à jour auteur :", err);
    throw new Error("Impossible de mettre à jour l’auteur.");
  }
};

// 🔹 Supprimer un auteur (soft delete)
export const deleteAuthor = async (id: string) => {
  try {
    return await prisma.author.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Erreur suppression auteur :", err);
    throw new Error("Impossible de supprimer l’auteur.");
  }
};

// 🔎 Chercher par pseudo
export const findAuthorByPseudo = async (pseudo: string) => {
  try {
    return await prisma.author.findFirst({
      where: {
        pseudo,
        deletedAt: null,
      },
      include: {
        books: true,
        events: true,
        reviews: true,
      },
    });
  } catch (err) {
    console.error("Erreur recherche par pseudo :", err);
    throw new Error("Erreur recherche par pseudo.");
  }
};

// 🔎 Chercher par email
export const findAuthorByEmail = async (email: string) => {
  try {
    return await prisma.author.findUnique({
      where: {
        email,
      },
      include: {
        books: true,
        events: true,
        reviews: true,
      },
    });
  } catch (err) {
    console.error("Erreur recherche par email :", err);
    throw new Error("Erreur recherche par email.");
  }
};

// 🔎 Chercher tous les auteurs ayant écrit un livre contenant un mot-clé
export const findAuthorsByBookTitle = async (title: string) => {
  try {
    return await prisma.author.findMany({
      where: {
        deletedAt: null,
        books: {
          some: {
            title: {
              contains: title,
              mode: "insensitive",
            },
          },
        },
      },
      include: {
        books: true,
      },
    });
  } catch (err) {
    console.error("Erreur recherche auteurs par titre de livre :", err);
    throw new Error("Erreur recherche auteurs par livre.");
  }
};
