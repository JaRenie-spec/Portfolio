import e from "express";
import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(3, "Le nom d'utilisateur est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  superAdminId: z.string().optional(), // string car UUID dans Prisma
});

export const updateAdminSchema = createAdminSchema.partial();
// Les champs sont optionnels pour la mise à jour
export const getAdminByIdSchema = z.object({
	id: z.string().uuid("ID invalide, doit être un UUID"),
});
export const deleteAdminSchema = z.object({
	id: z.string().uuid("ID invalide, doit être un UUID"),
});
export const getAllAdminsSchema = z.object({
});
export type GetAdminByIdInput = z.infer<typeof getAdminByIdSchema>;
export type DeleteAdminInput = z.infer<typeof deleteAdminSchema>;
export type GetAllAdminsInput = z.infer<typeof getAllAdminsSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
