"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteEvent = exports.updateEvent = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createEvent = async (data) => {
    return prisma.event.create({ data });
};
exports.createEvent = createEvent;
const getAllEvents = async () => {
    return prisma.event.findMany();
};
exports.getAllEvents = getAllEvents;
const getEventById = async (id) => {
    return prisma.event.findUnique({ where: { id } });
};
exports.getEventById = getEventById;
const updateEvent = async (id, data) => {
    return prisma.event.update({ where: { id }, data });
};
exports.updateEvent = updateEvent;
const softDeleteEvent = async (id) => {
    return prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
};
exports.softDeleteEvent = softDeleteEvent;
