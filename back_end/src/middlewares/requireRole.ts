import { RequestHandler, Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './protect';

export const requireRole = (allowedRoles: string | string[]): RequestHandler => {
  const rolesNeeded = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user || !Array.isArray(user.roles)) {
      res.status(401).json({ success: false, error: 'Non authentifié' });
      return;
    }

    const hasRole = user.roles.some((r: string) =>
      rolesNeeded.includes(r)
    );

    if (!hasRole) {
     res.status(403).json({ success: false, error: 'Accès refusé' });
      return;
    }

    next();
  };
};
