import { Request, Response, NextFunction } from "express";
import { createAuthorSchema, updateAuthorSchema } from "../types/author.schema";

export const validateCreateAuthor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = createAuthorSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors });
  }
};

export const validateUpdateAuthor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = updateAuthorSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors });
  }
};
