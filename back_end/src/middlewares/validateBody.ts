import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * validateBody : applique n'importe quel schéma Zod (objets, effets, coercions…)
 */
export const validateBody = (schema: ZodTypeAny): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: result.error.format() });
      return;
    }
    req.body = result.data;
    next();
  };
};



/**
 * schema.safeParse est une méthode fournie par zod.
 * elle renvoie :
 * un objet { success: true, data: ...} si les données sont valides
 * un objet { success: false, error: ...} si les données sont invalides
 *
 * Exemples :
 * validateBody reçoit la requête.
 * Si elle est mauvaise, renvoie le bon message d'erreur ( ex: Mot de passe trop court)
 * Si elle est bonne, on remplace req.body par les données filtrées et validées (result.data) pour que le controlleur
 * n'ait pas à faire des vérifications supplémentaires
 */
