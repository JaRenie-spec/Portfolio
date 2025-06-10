import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.author.create({
    data: {
      firstName: "Alice",
      lastName: "Durand",
      pseudo: "alice_d",
      email: "alice@example.com",
      password: "secret123",
      bio: "Auteure passionnée",
      link: "https://alicebooks.fr",

    },
  });

  console.log("Auteur créé :", author);
}

main()
  .catch((e) => {
    console.error("Erreur lors de la création de l'auteur :", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
