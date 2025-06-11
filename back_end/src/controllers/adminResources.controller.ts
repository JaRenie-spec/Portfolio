import { Request, Response } from "express";
import * as resourcesService from "../services/adminResources.service";

export const getAllResourcesHandler = async (req: Request, res: Response) => {
  // (Optionnel) Vérifier que req.params.id correspond bien à req.user.id
  // si l’on veut restreindre l’accès “self” uniquement
  const data = await resourcesService.getAllResources();
  res.json({ success: true, data });
};
