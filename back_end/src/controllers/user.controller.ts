// FICHIER : src/controllers/user.controller.ts
import { RequestHandler } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/protect';

const prisma = new PrismaClient();

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}
interface KeycloakRole {
  id: string;
  name: string;
}

/**
 * GET /api/users
 * (superadmin uniquement)
 */
export const findAll: RequestHandler = async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

/**
 * GET /api/users/:id
 * (admin & superadmin uniquement)
 */
export const findOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ error: 'Utilisateur non trouvé' });
    return;
  }
  res.json(user);
};

/**
 * GET /api/users/me
 * (utilisateur authentifié)
 */
export const me: RequestHandler = async (req, res) => {
  const sub = (req as AuthenticatedRequest).user.sub;
  const user = await prisma.user.findUnique({ where: { id: sub } });
  if (!user) {
    res.status(404).json({ error: 'Utilisateur non trouvé' });
    return;
  }
  res.json(user);
};

/**
 * PUT /api/users/me
 * (utilisateur authentifié)
 */
export const updateMe: RequestHandler = async (req, res) => {
  const sub = (req as AuthenticatedRequest).user.sub;
  const { firstName, lastName } = req.body;
  const user = await prisma.user.update({
    where: { id: sub },
    data: { firstName, lastName },
  });
  res.json(user);
};

/**
 * POST /api/users/become-author
 * (client uniquement)
 */
export const becomeAuthor: RequestHandler = async (req, res) => {
  try {
    const { sub, email, username } = (req as AuthenticatedRequest).user;

    // 1) Récupérer un token admin Keycloak
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.KEYCLOAK_ADMIN_CLI_CLIENT!,
      client_secret: process.env.KEYCLOAK_ADMIN_PASSWORD!,
    }).toString();

    const tokenRes = await axios.post<KeycloakTokenResponse>(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const adminToken = tokenRes.data.access_token;

    // 2) Récupérer l’ID du rôle “author”
    const roleRes = await axios.get<KeycloakRole>(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/roles/author`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const roleId = roleRes.data.id;

    // 3) Assigner le rôle “author” dans Keycloak
    await axios.post(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${sub}/role-mappings/realm`,
      [{ id: roleId, name: 'author' }],
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // 4) Vérifier / créer l’entité Author locale
    const accountWithAuthor = await prisma.account.findUnique({
      where: { id: sub },
      include: { author: true },
    });
    let authorRecord = accountWithAuthor?.author;
    if (!authorRecord) {
      authorRecord = await prisma.author.create({
        data: {
          firstName: '',
          lastName: '',
          pseudo: username,
          email,
          password: '',
          account: { connect: { id: sub } },
        },
      });
      await prisma.account.update({
        where: { id: sub },
        data: { authorId: authorRecord.id },
      });
    }

    res.json({ success: true, authorId: authorRecord.id });
  } catch (err: any) {
    console.error('becomeAuthor error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Impossible de devenir auteur' });
  }
};

/**
 * DELETE /api/users/:id
 * (admin & superadmin uniquement)
 */
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.sendStatus(204);
};
