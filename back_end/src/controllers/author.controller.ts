import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect'
import { createAuthor } from '../services/author.service';

const prisma = new PrismaClient();
/**
 * GET /authors
 */
export const findAll: RequestHandler = async (_req, res) => {
  const authors = await prisma.author.findMany({
    where: { deletedAt: null },
    include: { books: true }
  });
  res.json(authors);
};

/**
 * POST /authors
 */
export const create: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, pseudo, email, bio, link } = req.body;
    const newAuthor = await createAuthor({
      firstName,
      lastName,
      pseudo,
      email,
      bio,
      link,
      password: 'temp_password', // Sera géré par Keycloak
    });
    res.status(201).json(newAuthor);
  } catch (error) {
    console.error('Erreur création auteur:', error);
    res.status(400).json({ error: 'Impossible de créer l\'auteur' });
  }
};

/**
 * GET /authors/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  console.log('GET /authors/:id called', { params: req.params, headers: req.headers });
  const { id } = req.params;
  try {
    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true }
    });
    if (!author) {
      res.status(404).json({ error: 'Auteur non trouvé' });
      return;
    }
    res.json(author);
  } catch (err) {
    console.error('Erreur dans findOne:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
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
