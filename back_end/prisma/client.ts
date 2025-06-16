import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// 1 Créé un accès à la base avec new PrismaClient

// 2 export default permet de le réutiliser dans tout le projet

// 3 en gros ça évite les connexions multiples et c'est une meilleure pratique en terme de scalabilité

