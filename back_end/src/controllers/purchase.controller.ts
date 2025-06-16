import { RequestHandler } from 'express';
import * as purchaseService from '../services/purchase.service';
import { createPurchaseSchema, updatePurchaseSchema } from '../types/purchase.types';

export const create: RequestHandler = async (req, res) => {
  try {
    const parsed = createPurchaseSchema.parse(req.body);
    const purchase = await purchaseService.createPurchase(parsed);
    res.status(201).json(purchase);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};

export const getAll: RequestHandler = async (_req, res) => {
  try {
    const purchases = await purchaseService.getAllPurchases();
    res.status(200).json(purchases);
  } catch {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

export const getById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid purchase ID' });
      return;
    }
    const purchase = await purchaseService.getPurchaseById(id);
    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' });
      return;
    }
    res.status(200).json(purchase);
  } catch {
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid purchase ID' });
      return;
    }
    const parsed = updatePurchaseSchema.parse(req.body);
    const purchase = await purchaseService.updatePurchase(id, parsed);
    res.status(200).json(purchase);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update purchase' });
  }
};

export const remove: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid purchase ID' });
      return;
    }
    const purchase = await purchaseService.softDeletePurchase(id);
    res.status(200).json({ message: 'Purchase deleted', purchase });
  } catch {
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
};
