import { Response } from "express";
import { UserService } from "../services/UserService";
import { AuthenticatedRequest } from "../middlewares/protect";

const userService = new UserService();

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await userService.create(req.body);
    return void res.status(201).json(result);
  } catch (error) {
    return void res.status(500).json({ error: "Erreur lors de la création" });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await userService.update(userId, req.body);
    return void res.status(200).json(result);
  } catch (error) {
    return void res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour" });
  }
};

export const updateOwnProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return void res.status(401).json({ error: "Non autorisé" });

    const result = await userService.update(userId, req.body);
    return void res.status(200).json(result);
  } catch (error) {
    return void res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du profil" });
  }
};

// Suppression d'un compte par un admin

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    await userService.delete(userId);
    return void res.status(200).json({ message: 'Utilisateur supprimé '});
  } catch (error) {
    return void res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

// Suppression de son propre compte

export const deleteOwnAccount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId)
      return void res.status(401).json({ error: 'Non autorisé' });

    await userService.delete(userId);
    return void res.status(200).json({ message: 'Compte supprimé' });
  } catch (error) {
    return void res.status(500).json({ error: 'Erreur lors de la suppression de votre compte' });
  }
};
