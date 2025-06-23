/* src/middlewares/protect.ts */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload, JwtHeader } from 'jsonwebtoken';
import { getPublicKey } from '../utils/getKey';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface pour typer req.user
export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    username: string;
    roles: string[];
  };
}

export const protect: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou invalide' });
    return;
  }
  const token = authHeader.slice('Bearer '.length);

  // 1️⃣ Décodage de l’en-tête pour lire le kid
  const decodedHeader = jwt.decode(token, { complete: true }) as
    | { header: JwtHeader }
    | null;
  if (!decodedHeader) {
    res.status(401).json({ error: 'Impossible de décoder le token' });
    return;
  }

  // Récupération de la clé publique
  let publicKey: string;
  try {
    publicKey = await getPublicKey(decodedHeader.header.kid as string);
  } catch (err) {
    console.error('Échec récupération de la clé publique :', err);
    res.status(401).json({ error: 'Clé de vérification introuvable' });
    return;
  }

  // 2️⃣ Vérification du token avec la clé publique
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as JwtPayload;
  } catch (err) {
    console.error('Échec vérification JWT :', err);
    res.status(401).json({ error: 'Token invalide ou expiré' });
    return;
  }

  // 3️⃣ Extraction des claims
  const sub = payload.sub as string | undefined;
  if (!sub) {
    res.status(401).json({ error: 'Token sans souscription (sub)' });
    return;
  }
  const email   = (payload.email as string) ?? '';
  const username = (payload.preferred_username as string) ?? '';
  const roles   = (payload.realm_access?.roles as string[]) || [];
  const firstName = (payload.given_name as string) ?? '';
  const lastName  = (payload.family_name as string) ?? '';

  // 4️⃣ Synchronisation en base
  try {
    await prisma.account.upsert({
      where: { id: sub },
      update: { email, username, role: roles[0] },
      create: { id: sub, email, username, role: roles[0] },
    });
    await prisma.user.upsert({
      where: { id: sub },
      update: { email, firstName, lastName },
      create: { id: sub, email, password: '', firstName, lastName },
    });
  } catch (err) {
    console.error('Erreur upsert DB :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la synchronisation' });
    return;
  }

  // 5️⃣ Injection typée pour la suite
  (req as AuthenticatedRequest).user = { sub, email, username, roles };

  next();
};
