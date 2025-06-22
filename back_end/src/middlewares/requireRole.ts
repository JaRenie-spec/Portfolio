import { RequestHandler, Request, Response, NextFunction } from 'express';

/**
 * Middleware factory : ne laisse passer que les users
 * dont le rôle figure dans `allowedRoles`.
 */
export const requireRole = (allowedRoles: string | string[]): RequestHandler => {
  const rolesNeeded = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    // pas d'user injecté par protect
    if (!user || !Array.isArray(user.roles)) {
      res.status(401).json({ success: false, error: 'Non authentifié' });
      return;  // <-- on fait bien un return sans valeur
    }

    // intersection roles
    const hasRole = user.roles.some((r: string) => rolesNeeded.includes(r));
    if (!hasRole) {
      res.status(403).json({ success: false, error: 'Accès refusé' });
      return;  // <-- idem, return sans Response
    }

    // tout est OK, on passe au handler suivant
    next();
  };
};
