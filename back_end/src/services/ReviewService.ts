import prisma from '../../prisma/client';
import { CreateReviewDTO } from '../types/review.types';
import { Review } from '@prisma/client';

export class ReviewService {
  public async create(
    data: CreateReviewDTO & { userId: string }
  ): Promise<Review> {
    // 1️ Vérifier que le livre existe
    const bookExists = await prisma.book.findUnique({
      where: { id: data.bookId },
    });
    if (!bookExists) {
      throw new Error('Book not found');
    }

    // 2️ Vérifier que l’auteur existe
    const authorExists = await prisma.author.findUnique({
      where: { id: data.authorId },
    });
    if (!authorExists) {
      throw new Error('Author not found');
    }

    // 3️ Créer la review
    return prisma.review.create({
      data: {
        comment: data.comment,
        rating: data.rating,
        bookId: data.bookId,
        authorId: data.authorId,
        userId: data.userId,
      },
    });
  }
}
