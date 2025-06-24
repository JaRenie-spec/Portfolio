import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

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
  const { title, description, dateEvent, authorId } = req.body;
  const newEvent = await prisma.event.create({
    data: { title, description, dateEvent, authorId }
  });
  res.status(201).json(newEvent);
};

/**
 * PUT /events/:id
 */
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, dateEvent, authorId } = req.body;
  const updated = await prisma.event.update({
    where: { id },
    data: { title, description, dateEvent, authorId }
  });
  res.json(updated);
};

/**
 * DELETE /events/:id
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.event.delete({ where: { id } });
  res.sendStatus(204);
};
