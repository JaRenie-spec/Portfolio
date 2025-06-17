import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

// Créer un admin
export const createAdminHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await adminService.createAdmin(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
		return;
  }
};

// Récupérer tous les admins
export const getAllAdminsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await adminService.findAllAdmins();
    res.json({ success: true, data: list });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
		return;
  }
};

// Récupérer un admin par ID
export const getAdminByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await adminService.findAdminById(req.params.id); // id est string (UUID)
    if (!admin) {
      res.status(404).json({ success: false, error: "Non trouvé" });
      return;
    }
    res.json({ success: true, data: admin });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
		return;
  }
};

// Mettre à jour un admin
export const updateAdminHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await adminService.updateAdmin(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
		return;
  }
};

// Supprimer un admin
export const deleteAdminHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await adminService.deleteAdmin(req.params.id);
    res.status(204).send();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
		return;
  }
};
