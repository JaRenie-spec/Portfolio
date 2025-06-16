import { z } from "zod";

export const createAuthorSchema = z.object({
  pseudo: z.string().min(2, "Le pseudo est requis"),
  email: z.string().email("Email invalide"),
  bio: z.string().max(2_000).optional(),
  avatarUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  createdByAdminId: z.string().optional(),
});

export const updateAuthorSchema = createAuthorSchema.partial();

// Types inférés
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
