import { z } from 'zod';

/**
 * z est un namespace fourni par Zod.
 * Il contient toutes les fonctions pour déclarer des schémas
 */

export const CreateUserSchema = z.object({
	firstName: z.string().min(1, "Prénom requis"),
	lastName: z.string().min(1, "Nom requis"),
	email: z.string().email("email invalide"),
	password: z.string().min(8, "Mot de passe trop court"),
});

// z.object créé un schéma

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// génère un typescript à partir du schéma
