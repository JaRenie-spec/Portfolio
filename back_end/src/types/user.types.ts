import { z } from "zod";

/**
 * z est un namespace fourni par Zod.
 * Il contient toutes les fonctions pour déclarer des schémas
 */

// z.object créé un schéma
export const CreateUserSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});

/**
 * .optionnal est utile car on ne modifie pas forcément tous les champs
 * par exemple : On peut juste vouloir changer l'email pour raison pro
 */
export const UpdateUserSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").optional(),
  lastName: z.string().min(1, "Nom requis").optional(),
  email: z.string().email("email invalide").optional(),
  password: z.string().min(8, "Mot de passe trop court").optional(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
// génère un typescript à partir du schéma
