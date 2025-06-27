import { RequestHandler } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect';
import { cp } from 'fs';

const prisma = new PrismaClient();

/**
 * GET /api/users
 * (superadmin uniquement)
 */
export const findAll: RequestHandler = async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

/**
 * GET /api/users/:id
 * (admin & superadmin uniquement)
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'Utilisateur non trouvé' });
    return;
  }
  res.json(user);
};

/**
 * GET /api/users/me
 * (utilisateur authentifié)
 */
export const me: RequestHandler = async (req, res) => {
  const sub = (req as AuthenticatedRequest).user.sub;
  const user = await prisma.user.findUnique({ where: { id: sub } });
  if (!user) {
    res.status(404).json({ error: 'Utilisateur non trouvé' });
    return;
  }
  res.json(user);
};

/**
 * PUT /api/users/me
 * (utilisateur authentifié)
 */
export const updateMe: RequestHandler = async (req, res) => {
  const { id } = req.params;
	const { sub, roles } = (req as AuthenticatedRequest).user;
	const { firstName, lastName } = req.body;
	const isAdmin = roles.includes('admin');

	if (!isAdmin && id !== sub) {
		res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que votre propre compte'});
		return;
	}

	const user = await prisma.user.update({
		where: { id },
		data: { firstName, lastName },
	});
	res.json(user);
};

/**
 * DELETE /api/users/:id
 * (admin & superadmin uniquement)
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
	const { sub, roles } = (req as AuthenticatedRequest).user;
	const isAdmin = roles.includes('admin');

	if (!isAdmin && id !== sub) {
		res.status(403).json({ error: 'Accès refusé : vous ne pouvez supprimer que votre propre compte'});
		return;
	}

	await prisma.user.delete({ where: { id } });
	res.status(204).send();
};
