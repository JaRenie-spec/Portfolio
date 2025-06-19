import { Request, RequestHandler, Response } from "express";
import * as resourcesService from "../services/adminResources.service";

export const getAllResourcesHandler: RequestHandler = async (req: Request, res: Response) => {
  // (Optionnel) Vérifier que req.params.id correspond bien à req.user.id
  // si l’on veut restreindre l’accès “self” uniquement
  try {
    const data = await resourcesService.getAllResources();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
};
