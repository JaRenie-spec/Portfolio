import { Request, Response, NextFunction } from "express";

/**
 * Autorise l’accès si :
 *  - l’utilisateur a l’un des rôles spécifiés, OU
 *  - l’ID dans req.user.id correspond à req.params.id
 *
 * @param roles liste de rôles autorisés (ex. ["admin", "superAdmin"])
 */
export const authorizeSelfOrRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    const paramId = Number(req.params.id);

    if (!user) {
      res.status(401).json({ success: false, error: "Non authentifié" });
      return;
    }

    // Si rôle autorisé
    if (user.role && roles.includes(user.role)) {
      next();
      return;
    }

    // Si accès à son propre ID
    if (user.id === paramId) {
      next();
      return;
    }

    res.status(403).json({ success: false, error: "Accès interdit" });
  };
};
