import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema<any>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({ errors: result.error.format() });
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
