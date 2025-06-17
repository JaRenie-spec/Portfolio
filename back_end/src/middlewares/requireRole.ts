import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from './protect';

/**
 * Middleware générique pour n’autoriser que certains rôles Keycloak.
 * @param roles Liste des rôles autorisés, ex: ['admin', 'superadmin']
 * @returns RequestHandler compatible Express
 */
export const requireRole = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // On caste la req pour accéder à user
    const { user } = req as AuthenticatedRequest;

    // 1️⃣ L’utilisateur doit être authentifié
    if (!user) {
      res.status(401).json({ success: false, error: 'Non authentifié' });
      return;
    }

    // 2️⃣ Le rôle doit exister
    const role = user.role;
    if (!role) {
      res.status(403).json({ success: false, error: 'Rôle manquant' });
      return;
    }

    // 3️⃣ Le rôle doit être dans la liste
    if (!roles.includes(role)) {
      res.status(403).json({ success: false, error: 'Accès refusé' });
      return;
    }

    // Tout est OK
    next();
  };
};
