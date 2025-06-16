import { Response } from 'express';
import { ReviewService } from '../services/ReviewService';
import { AuthenticatedRequest } from '../middlewares/protect';

const reviewService = new ReviewService();


export const createReview = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	const userId = req.user?.sub;
	if (!userId) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	// Récupère l'identifiant de l'utilisateur depuis le token
	// Si l'utilisateur n'est pas authentifié, on renvoie 401 Non autorisé


	try {
		const review = await reviewService.create({
			...req.body,
			userId,
		});
		res.status(201).json(review);
	} catch (err) {
		console.error('Review creation failed:', err);
		res.status(500).json({ error: 'Failed to create review' });
	}
};
	// En cas d'erreur, on log l'erreur et on renvoie 500
