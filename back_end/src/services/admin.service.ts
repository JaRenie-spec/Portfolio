// src/services/admin.service.ts

import KcAdminClient from '@keycloak/keycloak-admin-client';
import { initKeycloak } from '../utils/keycloak';
import { CreateAdminInput, UpdateAdminInput } from '../types/admin.schema';

const REALM = process.env.KEYCLOAK_REALM!;

/**
 * Crée un nouvel administrateur dans Keycloak et lui assigne le rôle "admin".
 */
export const createAdmin = async (
  input: CreateAdminInput
): Promise<{ id: string; name: string }> => {
  const kc = await initKeycloak();

  // 1) Création de l’utilisateur
  const { id } = await kc.users.create({
    realm: REALM,
    username: input.name,
    email: input.email,
    enabled: true,
    credentials: [
      {
        type: 'password',
        value: input.password,
        temporary: false,
      } as any
    ],
    attributes: input.superAdminId
      ? { createdBy: [input.superAdminId] }
      : undefined,
  });

  // 2) Assignation du rôle realm "admin"
  const realmRole = await kc.roles.findOneByName({
    realm: REALM,
    name: 'admin',
  });
  if (realmRole?.id) {
    await kc.users.addRealmRoleMappings({
      realm: REALM,
      id,
      roles: [{ id: realmRole.id } as any],
    });
  }

  return { id, name: input.name };
};

/**
 * Récupère tous les utilisateurs Keycloak ayant le rôle "admin".
 */
export const findAllAdmins = async (): Promise<Array<{ id: string; name: string }>> => {
  const kc = await initKeycloak();
  const users = await kc.users.find({ realm: REALM, max: 200 });

  const admins: Array<{ id: string; name: string }> = [];
  for (const u of users) {
    const roles = await kc.users.listRealmRoleMappings({
      realm: REALM,
      id: u.id!,
    });
    if (roles.some(r => r.name === 'admin')) {
      admins.push({
        id: u.id!,
        name: u.username!,
      });
    }
  }
  return admins;
};

/**
 * Récupère un administrateur par ID, si l’utilisateur a bien le rôle "admin".
 */
export const findAdminById = async (
  id: string
): Promise<{ id: string; name: string } | null> => {
  const kc = await initKeycloak();
  const user = await kc.users.findOne({ realm: REALM, id });
  if (!user) return null;

  const roles = await kc.users.listRealmRoleMappings({ realm: REALM, id });
  if (!roles.some(r => r.name === 'admin')) return null;

  return { id, name: user.username! };
};

/**
 * Met à jour un administrateur : username, email, attributs et mot de passe.
 */
export const updateAdmin = async (
  id: string,
  input: UpdateAdminInput
): Promise<{ id: string; name: string }> => {
  const kc = await initKeycloak();

  const payload: Partial<any> = {};
  if (input.name) payload.username = input.name;
  if (input.email) payload.email = input.email;
  if (input.superAdminId) payload.attributes = { createdBy: [input.superAdminId] };

  await kc.users.update({ realm: REALM, id }, payload);

  if (input.password) {
    await kc.users.resetPassword(
      { realm: REALM, id } as any,
      {
        type: 'password',
        value: input.password,
        temporary: false,
      } as any
    );
  }

  const updated = await kc.users.findOne({ realm: REALM, id });
  return { id, name: updated!.username! };
};

/**
 * Supprime un administrateur dans Keycloak.
 */
export const deleteAdmin = async (id: string): Promise<void> => {
  const kc = await initKeycloak();
  // On cast en any pour satisfaire le type CredentialRequirement
  await kc.users.del({ realm: REALM, id } as any);
};
