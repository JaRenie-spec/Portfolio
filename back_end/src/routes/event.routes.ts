import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CreateEventData {
  title: string;
  description: string;
  dateEvent: Date;
  authorId: string;
  createdByAdminId?: string;
}

export const createEvent = async (data: CreateEventData): Promise<ReturnType<typeof prisma.event.create>> => {
  return prisma.event.create({ data });
};
export const getAllEvents = async () => {
  return prisma.event.findMany();
}

export const getEventById = async (id: string) => {
  return prisma.event.findUnique({ where: { id } });
};

export const updateEvent = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    dateEvent: Date;
    authorId: string;
    createdByAdminId?: string;
  }>
) => {
  return prisma.event.update({ where: { id }, data });
};

export const softDeleteEvent = async (id: string) => {
  return prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
};

// export default router; // Uncomment and move this line here if you have a 'router' to export
