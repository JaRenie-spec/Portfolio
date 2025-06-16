import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(3, "Le nom d'utilisateur est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  superAdminId: z.string().optional(), // string car UUID dans Prisma
});

export const updateAdminSchema = createAdminSchema.partial();

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
