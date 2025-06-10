import { RequestHandler } from 'express';
import * as eventService from '../services/event.service';
import { createEventSchema, updateEventSchema } from '../types/event.types';

export const create: RequestHandler = async (req, res) => {
  try {
    const parsed = createEventSchema.parse(req.body);
    const event = await eventService.createEvent(parsed);
    res.status(201).json(event);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const getAll: RequestHandler = async (_req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getById: RequestHandler = async (req, res) => {
  try {
    const event = await eventService.getEventById(Number(req.params.id));
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const parsed = updateEventSchema.parse(req.body);
    const event = await eventService.updateEvent(Number(req.params.id), parsed);
    res.status(200).json(event);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const remove: RequestHandler = async (req, res) => {
  try {
    const event = await eventService.softDeleteEvent(Number(req.params.id));
    res.status(200).json({ message: 'Event deleted', event });
  } catch {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
