import { Response } from 'express';
import { ReviewService } from '../services/ReviewService';
import { AuthenticatedRequest } from 'middlewares/protect';

const reviewService = new ReviewService();

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		const userId = req.user?.sub;

		if (!userId) {
			return void res.status(401).json({ error: 'Non autorisé '});
		}

		const result = await reviewService.create({
			...req.body,
			userId,
		});

		return void res.status(201).json(result);
	} catch (error) {
		console.error(error);
		return void res.status(500).json({ error: 'Erreur lors de la création de la review'});
	}
};
