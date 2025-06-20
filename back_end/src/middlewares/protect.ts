// FICHIER : src/middlewares/protect.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Étend Express Request pour y ajouter
 * la propriété `user` injectée après vérification du token.
 */
export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    username: string;
    roles: string[];
    given_name?: string;
    family_name?: string;
  };
}

const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
});

/**
 * Récupère la clé publique via le `kid` du header JWT
 */
function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  if (!header.kid) {
    callback(new Error('Pas de KID dans le header'), undefined);
    return;
  }
  client.getSigningKey(header.kid, (err, rsaKey) => {
    if (err || !rsaKey) {
      callback(err ?? new Error('Clé JWK introuvable'), undefined);
      return;
    }
    const publicKey = rsaKey.getPublicKey();
    callback(null, publicKey);
  });
}

/**
 * Middleware `protect` :
 * - Vérifie le Bearer token JWT via JWKS
 * - Extrait les claims
 * - Synchronise l’Account (pivot) et l’entité métier User
 * - Injecte `req.user` pour la suite
 */
export const protect: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou invalide' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded: any) => {
    if (err || !decoded?.sub) {
      res.status(401).json({ error: 'Token invalide ou expiré' });
      return;
    }

    const sub = decoded.sub as string;
    const email = (decoded.email as string) ?? '';
    const username = (decoded.preferred_username as string) ?? '';
    const roles: string[] = decoded.realm_access?.roles || [];
    const given_name = decoded.given_name as string | undefined;
    const family_name = decoded.family_name as string | undefined;

    // 1️⃣ Synchronisation du pivot Account
    try {
      await prisma.account.upsert({
        where: { id: sub },
        update: { email, username, role: roles[0] },
        create: { id: sub, email, username, role: roles[0] },
      });
    } catch (e) {
      console.error('Erreur upsert Account :', e);
      res.status(500).json({ error: 'Erreur serveur (Account)' });
      return;
    }

    // 2️⃣ Synchronisation de l’entité User (optionnel)
    try {
      await prisma.user.upsert({
        where: { id: sub },
        update: {
          email,
          firstName: given_name ?? '',
          lastName: family_name ?? '',
        },
        create: {
          id: sub,
          email,
          password: '',               // géré par Keycloak
          firstName: given_name ?? '',
          lastName: family_name ?? '',
        },
      });
    } catch (e) {
      console.error('Erreur upsert User :', e);
      res.status(500).json({ error: 'Erreur serveur (User)' });
      return;
    }

    // Injection de l’objet user pour les middlewares suivants
    (req as AuthenticatedRequest).user = {
      sub,
      email,
      username,
      roles,
      given_name,
      family_name,
    };

    next();
  });
};
