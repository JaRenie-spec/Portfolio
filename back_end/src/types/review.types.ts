import { z } from "zod";

export const CreateReviewSchema = z.object({
	bookId: z.string().uuid({ message: 'bookId doit être un UUID validé' }),
	comment: z.string().min(3, { message: 'Le commentaire doit faire au moins 3 caractères' }),
	rating: z
		.number()
		.int({ message: 'la note doit être un nombre entier '})
		.min(1, { message: 'La note doit être au moins de 1'})
		.max(5, { message: 'la note doit être au maximum 5 !'}),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;
