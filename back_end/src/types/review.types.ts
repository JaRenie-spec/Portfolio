import { z } from "zod";

export const CreateReviewSchema = z.object({
	comment: z.string().min(1),
	rating: z.number().min(1).max(5),
	bookId: z.string().uuid(),
	userId: z.string().uuid().optional(),
	authorId: z.string().uuid().optional(),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;
