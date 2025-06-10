import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export const createEvent = async (data: {
  title: string;
  description: string;
  dateEvent: Date;
  authorId: number;
  createdByAdminId?: number;
}) => {
  return await prisma.event.create({ data });
};

export const getAllEvents = async () => {
  return await prisma.event.findMany({
    where: { deletedAt: null },
    include: { author: true, createdByAdmin: true }
  });
};

export const getEventById = async (id: number) => {
  return await prisma.event.findUnique({
    where: { id },
    include: { author: true, createdByAdmin: true }
  });
};

export const updateEvent = async (
  id: number,
  data: Partial<{
    title: string;
    description: string;
    dateEvent: Date;
    authorId: number;
    createdByAdminId: number;
  }>
) => {
  return await prisma.event.update({
    where: { id },
    data,
  });
};

export const softDeleteEvent = async (id: number) => {
  return await prisma.event.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
