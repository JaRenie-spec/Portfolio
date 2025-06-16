import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const book = await prisma.book.create({
    data: {
      title: "Nom du livre",
      isbn: "978-1234567890",
      price: 19.99,
      description: "Une description du livre",
      fileUrl: "http://example.com/book.pdf",
      author: {
        connect: { id: 3 } // change `1` par l’ID d’un auteur existant
      },

    },
  });

  console.log("Livre créé :", book);
}

main()
  .catch((e) => {
    console.error("Erreur lors de la création :", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
