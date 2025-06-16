import { Request, Response, NextFunction } from "express";
import { createBookSchema, updateBookSchema } from "../types/book.schema";

export const validateCreateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = createBookSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors });
  }
};

export const validateUpdateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = updateBookSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors });
  }
};
