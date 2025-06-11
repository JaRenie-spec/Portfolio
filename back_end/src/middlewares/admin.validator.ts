import { Request, Response, NextFunction } from "express";
import { createAdminSchema, updateAdminSchema } from "../types/admin.schema";

export const validateCreateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createAdminSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ success: false, errors: err.errors });
  }
};

export const validateUpdateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateAdminSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ success: false, errors: err.errors });
  }
};
