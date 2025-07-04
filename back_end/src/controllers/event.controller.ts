import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect';

const prisma = new PrismaClient();

/**
 * GET /events
 */
export const findAll: RequestHandler = async (_req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
};

/**
 * GET /events/:id
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).json({ error: 'Événement non trouvé' });
    return;
  }
  res.json(event);
};

/**
 * POST /events
 */
export const create: RequestHandler = async (req, res) => {
  const { title, description, dateEvent, authorId: bodyAuthorId } = req.body;
  const { sub, roles } = (req as AuthenticatedRequest).user;
  const isAdmin = roles.includes('admin');

  // Un auteur non-admin ne peut pas créer pour un autre auteur
  if (!isAdmin && bodyAuthorId && bodyAuthorId !== sub) {
    res.status(403).json({ error: 'Impossible de créer un événement pour un autre auteur' });
    return;
  }

  const finalAuthorId = isAdmin ? bodyAuthorId || sub : sub;

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        dateEvent: new Date(dateEvent),
        authorId: finalAuthorId
      }
    });
    res.status(201).json(newEvent);
  } catch (err: any) {
    console.error('Erreur création événement:', err);
    res.status(500).json({ error: 'Erreur lors de la création de l\'événement.' });
  }
};

/**
 * PUT /events/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, dateEvent, authorId: bodyAuthorId } = req.body;
  const { sub, roles } = (req as AuthenticatedRequest).user;
  const isAdmin = roles.includes('admin');

  // Vérifier existence
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).json({ error: 'Événement non trouvé' });
    return;
  }

  // Permissions
  if (!isAdmin && event.authorId !== sub) {
    res.status(403).json({ error: 'Impossible de modifier cet événement' });
    return;
  }
  if (!isAdmin && bodyAuthorId && bodyAuthorId !== sub) {
    res.status(403).json({ error: 'Impossible de changer l\'auteur de l\'événement' });
    return;
  }

  const finalAuthorId = isAdmin ? bodyAuthorId || event.authorId : sub;

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        dateEvent: new Date(dateEvent),
        authorId: finalAuthorId
      }
    });
    res.json(updated);
  } catch (err: any) {
    console.error('Erreur mise à jour événement :', err);
    res.status(500).json({ error: 'Impossible de mettre à jour l\'événement.' });
  }
};

/**
 * DELETE /events/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { sub, roles } = (req as AuthenticatedRequest).user;
  const isAdmin = roles.includes('admin');

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).json({ error: 'Événement non trouvé' });
    return;
  }
  if (!isAdmin && event.authorId !== sub) {
    res.status(403).json({ error: 'Impossible de supprimer cet événement' });
    return;
  }

  try {
    await prisma.event.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err: any) {
    console.error('Erreur suppression événement :', err);
    res.status(500).json({ error: 'Impossible de supprimer l\'événement.' });
  }
};
