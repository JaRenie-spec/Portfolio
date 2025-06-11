import { Request, Response, NextFunction } from "express";

/**
 * Vérifie qu’un utilisateur est authentifié (req.user rempli).
 * Sinon renvoie 401 Unauthorized.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Non authentifié" });
    return;
  }
  next();
};
