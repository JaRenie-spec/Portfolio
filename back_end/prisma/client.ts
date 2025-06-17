import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

/**
 * Le fichier prisma/client.ts crée et exporte une seule instance de PrismaClient,
 * qu'on réutilises dans tout le code.
 * Ça évite d’ouvrir plusieurs pools de connexions à notre base (risque de surcharge)
 * et facilite le mocking ou la configuration centralisée de Prisma
 */
