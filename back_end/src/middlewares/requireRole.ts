// filepath: /home/albat93/Portfolio/back_end/src/middlewares/requireRole.ts
import { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ success: false, error: "Access denied" });
      return;
    }
    next();
  };
};