import { CreateReviewDTO } from '../types/review.types';
import prisma from '../../prisma/client';

export class ReviewService {
  public async create(data: CreateReviewDTO & { userId: string }): Promise<any> {
    const book = await prisma.book.findUnique({
      where: { id: data.bookId },
    });
    if (!book) {
      throw new Error('Livre introuvable');
    }

    const review = await prisma.review.create({
      data: {
        comment: data.comment,
        rating: data.rating,
        bookId: data.bookId,
        userId: data.userId,
        authorId: data.authorId,
      },
    });
    return review;
  }
}
