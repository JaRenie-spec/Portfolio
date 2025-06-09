import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { sub?: string; [key: string]: any };
}

export const protect: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return void res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token, { json: true });

    if (!decoded || typeof decoded !== "object" || !decoded.sub) {
      return void res.status(401).json({ error: "Token invalide" });
    }

    (req as AuthenticatedRequest).user = decoded;
    return next();
  } catch (err) {
    return void res.status(401).json({ error: "Authentification échouée" });
  }
};
