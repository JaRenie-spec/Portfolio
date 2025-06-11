import { CreateReviewDTO } from '../types/review.types';
import prisma from '../../prisma/client';

export class ReviewService {
	/**
	 *
	 */
	async create(data: CreateReviewDTO & { userId: string }) {
		const book = await prisma.book.findUnique({
			where: { id: data.bookId },
		});

		if (!book) {
			throw new Error('Livre introuvable');
		}

		const review = await prisma.review.create({
			data: {
				userId: data.userId,
				bookId: data.bookId,
				comment: data.comment,
				rating: data.rating,
			},
		});

		return review;
	}
}
