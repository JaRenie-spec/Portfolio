import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    role?: string;
    [key: string]: any;
  };
}

export const protect: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou invalide' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.decode(token, { json: true });

  if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
    res.status(401).json({ error: 'Token invalide' });
    return;
  }

  (req as AuthenticatedRequest).user = decoded as AuthenticatedRequest['user'];
  next();
};
