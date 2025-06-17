import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { CreateReviewDTO } from '../types/review.types';
import { Review } from '@prisma/client';

export class ReviewService {
  public async create(
    data: CreateReviewDTO & { userId: string }
  ): Promise<Review> {
    const bookExists = await prisma.book.findUnique({
      where: { id: data.bookId },
    });
    if (!bookExists) {
      throw new Error('Book not found');
    }

    const authorExists = await prisma.author.findUnique({
      where: { id: data.authorId },
    });
    if (!authorExists) {
      throw new Error('Author not found');
    }

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
