import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect'


const prisma = new PrismaClient();
/**
 * GET /authors
 */
export const findAll: RequestHandler = async (_req, res) => {
  const authors = await prisma.author.findMany();
  res.json(authors);
};

/**
 * GET /authors/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) {
    res.status(404).json({ error: 'Auteur non trouvé' });
    return;
  }
  res.json(author);
};

/**GET /authors/search
 *
 */
export const findByPublicInfo: RequestHandler = async (req, res) => {
  const { pseudo, nom, prenom } = req.query;

  const authors = await prisma.author.findMany({
    where: {
      AND: [
        pseudo ? { pseudo: { contains: String(pseudo), mode: 'insensitive' } } : {},
        nom ? { lastName: { contains: String(nom), mode: 'insensitive' } } : {},
        prenom ? { firstName: { contains: String(prenom), mode: 'insensitive' } } : {},
      ],
    },
  });

  if (!authors.length) {
    res.status(404).json({ error: 'Aucun auteur trouvé' });
    return;
  }

  res.json(authors);
};
/**
 * PUT /authors/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
	const { sub, roles } = (req as AuthenticatedRequest).user;
	const isAdmin = roles.includes('admin');

	if (!isAdmin && id !== sub) {
		res.status(403).json({ error: 'Accès refusé : vous devez agir sur votre propre profil'});
		return;
	}

	const { firstName, lastName, pseudo, email, bio, link } = req.body;
	const updated = await prisma.author.update({
		where: { id },
		data: { firstName, lastName, pseudo, email, bio, link }
	});
	res.json(updated);
};

/**
 * DELETE /authors/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
	const { sub, roles } = (req as AuthenticatedRequest).user;
	const isAdmin = roles.includes('admin');

	if (!isAdmin && id !== sub) {
		res.status(403).json({ error: 'Vous pouvez uniquement supprimer votre profil !'});
		return;
	}

	await prisma.author.delete({ where: { id } });
	res.sendStatus(204);
};
