import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createEvent = async (data: {
  title: string;
  description: string;
  dateEvent: Date;
  authorId: string;
  createdByAdminId?: string;
}) => {
  return prisma.event.create({ data });
};

export const getAllEvents = async () => {
  return prisma.event.findMany();
};

export const getEventById = async (id: string) => {
  return prisma.event.findUnique({ where: { id } });
};

export const updateEvent = async (id: string, data: Partial<{
  title: string;
  description: string;
  dateEvent: Date;
  authorId: string;
  createdByAdminId?: string;
}>) => {
  return prisma.event.update({ where: { id }, data });
};

export const softDeleteEvent = async (id: string) => {
  return prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
};
