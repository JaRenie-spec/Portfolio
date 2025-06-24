import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload, JwtHeader } from 'jsonwebtoken';
import { getPublicKey } from '../utils/getKey';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Ton client_id Keycloak, défini dans tes variables d’environnement
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    username: string;
    roles: string[];
  };
}

export const protect: RequestHandler = async (req, res, next) => {
  // 1️⃣ Vérification de la présence du token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou invalide' });
    return;
  }
  const token = authHeader.slice(7);

  // 2️⃣ Décodage de l’en-tête pour récupérer le kid
  const decodedHeader = jwt.decode(token, { complete: true }) as { header: JwtHeader } | null;
  if (!decodedHeader) {
    res.status(401).json({ error: 'Impossible de décoder le token' });
    return;
  }

  // 3️⃣ Récupération de la clé publique correspondante
  let publicKey: string;
  try {
    publicKey = await getPublicKey(decodedHeader.header.kid as string);
  } catch (err) {
    console.error('Échec récupération de la clé publique :', err);
    res.status(401).json({ error: 'Clé de vérification introuvable' });
    return;
  }

  // 4️⃣ Vérification du token JWT
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
  } catch (err) {
    console.error('Échec vérification JWT :', err);
    res.status(401).json({ error: 'Token invalide ou expiré' });
    return;
  }

  // 5️⃣ Extraction des informations utilisateur
  const sub      = payload.sub as string;
  const email    = (payload.email as string) || '';
  const username = (payload.preferred_username as string) || '';

  // 6️⃣ Fusion des realm roles et des client roles
  const realmRoles  = (payload.realm_access?.roles as string[])   || [];
  const clientRoles = (payload.resource_access?.[CLIENT_ID]?.roles as string[]) || [];
  // Union, suppression des doublons et normalisation en minuscules
  const roles = Array.from(new Set([...realmRoles, ...clientRoles]))
    .map(r => r.toLowerCase());

  // 7️⃣ Synchronisation de l’utilisateur dans la base (upsert)
  try {
    await prisma.account.upsert({
      where: { id: sub },
      update: { email, username, roles },
      create: { id: sub, email, username, roles },
    });

    // Si tu synchronises aussi un modèle `User`, garde cet upsert
    await prisma.user.upsert({
      where: { id: sub },
      update: { email, firstName: payload.given_name as string || '', lastName: payload.family_name as string || '' },
      create: {
        id: sub,
        email,
        password: '',
        firstName: payload.given_name as string || '',
        lastName: payload.family_name as string || ''
      },
    });
  } catch (err) {
    console.error('Erreur upsert DB :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la synchronisation' });
    return;
  }

  // 8️⃣ Injection de l’utilisateur dans la requête pour la suite
  (req as AuthenticatedRequest).user = { sub, email, username, roles };

  // 9️⃣ On passe la main au middleware suivant / au handler
  next();
};
