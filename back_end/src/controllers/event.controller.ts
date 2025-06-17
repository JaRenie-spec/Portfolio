import { RequestHandler } from 'express';
import * as eventService from '../services/event.service';
import { createEventSchema, updateEventSchema } from '../types/event.types';

export const createEvent: RequestHandler = async (req, res) => {
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

export const getAllEvents: RequestHandler = async (_req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEventById: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }
  try {
    const event = await eventService.getEventById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const updateEvent: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }
  try {
    const parsed = updateEventSchema.parse(req.body);
    const event = await eventService.updateEvent(id, parsed);
    res.status(200).json(event);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }
  try {
    const event = await eventService.softDeleteEvent(id);
    res.status(200).json({ message: 'Event deleted', event });
  } catch (error) {
    console.error('Error in remove:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
