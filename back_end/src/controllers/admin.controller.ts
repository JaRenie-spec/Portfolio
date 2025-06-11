import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export const createAdminHandler = async (req: Request, res: Response) => {
  const data = await adminService.createAdmin(req.body);
  res.status(201).json({ success: true, data });
};

export const getAllAdminsHandler = async (_: Request, res: Response) => {
  const list = await adminService.findAllAdmins();
  res.json({ success: true, data: list });
};

export const getAdminByIdHandler = async (req: Request, res: Response) => {
  const a = await adminService.findAdminById(req.params.id);
  if (!a) return res.status(404).json({ success: false, error: "Non trouvé" });
  res.json({ success: true, data: a });
};

export const updateAdminHandler = async (req: Request, res: Response) => {
  const updated = await adminService.updateAdmin(req.params.id, req.body);
  res.json({ success: true, data: updated });
};

export const deleteAdminHandler = async (req: Request, res: Response) => {
  await adminService.deleteAdmin(req.params.id);
  res.status(204).end();
};
