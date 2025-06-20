import { RequestHandler } from 'express';
import { AuthenticatedRequest } from './protect';

/**
 * Ne laisse passer que les utilisateurs qui ont un des rôles autorisés.
 * Exemple : requireRole(['author', 'admin'])
 */
export const requireRole = (allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    const userReq = req as AuthenticatedRequest;
    const roles = userReq.user?.roles;

    // Pas authentifié ?
    if (!roles) {
      res.status(401).json({ success: false, error: 'Non authentifié' });
      return;
    }

    // Vérifier qu'au moins un rôle correspond
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      res.status(403).json({ success: false, error: 'Accès refusé' });
      return;
    }

    next();
  };
};
