import { Response } from "express";
import { UserService } from "../services/UserService";
import { AuthenticatedRequest } from "../middlewares/protect";
import { RequestHandler } from "express-serve-static-core";
import { resolve } from "path";

const userService = new UserService();

export const createUser: RequestHandler = async (req, res, next): Promise<void> => {
	try {
		const result = await userService.create(req.body);
		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: 'Erreur lors de la création' });
	}
};

export const updateUser: RequestHandler = async (req, res, next): Promise<void> => {
	try {
		const userId = req.params.id;
		const result = await userService.update(userId, req.body);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: 'Erreur lors de la mise à jour ' });
	}
};

export const updateOwnProfile: RequestHandler = async (req, res, next): Promise<void> => {
	const { user } = req as AuthenticatedRequest;

	if (!user?.sub) {
		res.status(401).json({ error: 'Non autorisé' });
		return;
	}

	const userId = user.sub;

	try {
		const result = await userService.update(userId, req.body);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
	}
};

export const deleteUser: RequestHandler = async (req, res, next): Promise<void> => {
	try {
		const userId = req.params.id;
		await userService.delete(userId);
		res.status(200).json({ message: 'Utilisateur supprimé' });
	} catch (error) {
		res.status(500).json({ error: 'Erreur lors de la suppression' });
	}
};

export const deleteOwnAccount: RequestHandler = async (req, res, next): Promise<void> => {
	const { user } = req as AuthenticatedRequest;
	if (!user?.sub) {
		res.status(401).json({ error: 'Non autorisé' });
		return;
	}

	const userId = user.sub;

	try {
		await userService.delete(userId);
		res.status(200).json({ message: 'Compte supprimé' });
	} catch (error) {
		res.status(500).json({ error: 'Erreur lors de la suppression de votre compte' });
	}
};

/**
 * On est passés à des handlers async qui retournent toujours void (Promise<void>)
 * pour coller à la signature Express : on n’utilise plus return res… (qui renvoie un Response)
 * mais on fait simplement res.status().json(…) puis on quitte la fonction.
 *
 * On a aussi séparé le check if (!user?.sub) avant de déclarer const userId = user.sub,
 * de sorte que userId est toujours de type string pur et plus string | undefined.
 */
