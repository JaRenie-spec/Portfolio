import { z } from "zod";

export const createAuthorSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  pseudo: z.string().min(2, "Le pseudo est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  bio: z.string().max(2_000).optional(),
  createdByAdminId: z.string().optional(),
});

export const updateAuthorSchema = createAuthorSchema.partial();

// Types inférés
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
