# Détail complet du fonctionnement du code Prisma (PostgreSQL)

Ce document explique en détail **le fonctionnement de notre base de données** avec Prisma et PostgreSQL. Il passe en revue chaque **modèle Prisma** que nous avons défini, en expliquant :

* à quoi sert chaque champ,
* comment les relations sont construites,
* et quelle logique métier se cache derrière chaque partie.

 Les explications sur Prisma sont données au fil des modèles, uniquement pour comprendre ce qu’il fait **dans notre projet**.

---

## Modèle `User`

```prisma
model User {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String
  email     String   @unique
  password  String

  reviews    Review[]
  purchases  Purchase[]
  favorites  Favorite[]

  createdByAdminId Int?
  createdByAdmin   Admin? @relation(fields: [createdByAdminId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}
```

**Explication** :

* L’utilisateur a un `id` auto-incrémenté et des champs obligatoires : prénom, nom, email unique, mot de passe.
* Les relations :

  * `reviews` : toutes les critiques faites par l’utilisateur.
  * `purchases` : tous les livres qu’il a achetés.
  * `favorites` : ses favoris.
* Le champ `createdByAdminId` permet de savoir **quel admin a créé cet utilisateur**. C’est utile dans une logique d’administration centralisée.

Prisma génère automatiquement les bonnes clés étrangères et les contraintes SQL associées.

---

## Modèle `Book`

```prisma
model Book {
  id        Int      @id @default(autoincrement())
  title     String
  isbn      String   @unique
  price     Float
  description String?
  rating    Float?
  fileUrl   String

  authorId  Int
  author    Author   @relation(fields: [authorId], references: [id])

  createdByAdminId Int?
  createdByAdmin   Admin? @relation(fields: [createdByAdminId], references: [id])

  reviews    Review[]
  purchases  Purchase[]
  favorites  Favorite[]
  stat       Stat?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}
```

**Explication** :

* `title`, `isbn`, `price`, `fileUrl` sont obligatoires.
* `isbn` est unique pour éviter les doublons en base.
* `authorId` est **obligatoire** : chaque livre doit être lié à un auteur.
* `createdByAdminId` est **optionnel** : si un admin a créé le livre depuis l’interface d’administration, ce champ est rempli. Sinon, l’auteur peut le publier lui-même.
* `stat` est une relation 1-1 vers les statistiques liées à ce livre.

---

## Exemple de logique métier : éviter les doublons en favoris

```prisma
model Favorite {
  id     Int @id @default(autoincrement())
  bookId Int
  userId Int

  @@unique([bookId, userId])
}
```

Cette contrainte empêche qu’un utilisateur ajoute plusieurs fois le même livre en favori.

```ts
await prisma.favorite.upsert({
  where: {
    userId_bookId: {
      userId: 1,
      bookId: 2
    }
  },
  update: {},
  create: {
    user: { connect: { id: 1 } },
    book: { connect: { id: 2 } }
  }
});
```

**Résultat** : aucun doublon possible, même si un utilisateur clique plusieurs fois.

---

## Prisma (explication rapide)

Prisma est l'outil qui **traduit notre code en requêtes SQL**. Il se base sur un fichier `schema.prisma` où l'on déclare nos modèles. Il génère ensuite un client TypeScript (`@prisma/client`) que l’on utilise dans notre code.

```ts
const prisma = new PrismaClient();
const users = await prisma.user.findMany();
```

Cela exécute un `SELECT * FROM "User";`, mais avec la sécurité d’un ORM (pas d’injection SQL, requêtes typées, etc.).
