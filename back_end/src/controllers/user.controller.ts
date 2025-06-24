// FICHIER : src/controllers/user.controller.ts
import { RequestHandler } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { getKeycloakAdminToken } from '../services/keycloak.service';
import { AuthenticatedRequest } from '../middlewares/protect';

const prisma = new PrismaClient();

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
    const { sub: userId } = (req as AuthenticatedRequest).user;

    // 1️⃣ Récupérer le token admin Keycloak via client_credentials
    const adminToken = await getKeycloakAdminToken();

    // 2️⃣ Récupérer l’ID du rôle “author” (optionnel si tu connais déjà son UUID)
    const roleRes = await axios.get(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/roles/author`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const roleId = roleRes.data.id;

    // 3️⃣ Assigner le rôle “author” à l’utilisateur
    await axios.post(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/realm`,
      [{ id: roleId, name: 'author' }],
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 4️⃣ (Optionnel) Synchroniser côté base de données
    // … ton code Prisma pour créer la ligne Author

    res.json({ success: true, authorId: roleId });
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
