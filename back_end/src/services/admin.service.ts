/* src/services/admin.service.ts */
import kcAdmin from '../utils/keycloak';
import type { CreateAdminInput, UpdateAdminInput } from '../types/admin.schema';

const REALM = process.env.KEYCLOAK_REALM!;

/**
 * Crée un nouvel administrateur et lui assigne le rôle 'admin'
 */
export async function createAdmin(
  input: CreateAdminInput
): Promise<{ id: string; username: string }> {
  // Création de l'utilisateur
  const user = await kcAdmin.users.create({
    realm: REALM,
    username: input.name,
    email: input.email,
    enabled: true,
    credentials: [
      {
        type: 'password',
        value: input.password,
        temporary: false,
      } as any,
    ],
    attributes: input.superAdminId
      ? { createdBy: [input.superAdminId] }
      : undefined,
  });
  const userId = user.id!;

  // Assignation du rôle 'admin'
  const realmRole = await kcAdmin.roles.findOneByName({ realm: REALM, name: 'admin' });
  if (realmRole?.id && realmRole.name) {
    await kcAdmin.users.addRealmRoleMappings({
      realm: REALM,
      id: userId,
      roles: [{ id: realmRole.id, name: realmRole.name }],
    });
  }

  return { id: userId, username: input.name };
}

/**
 * Récupère tous les administrateurs (utilisateurs ayant le rôle 'admin')
 */
export async function findAllAdmins(): Promise<Array<{ id: string; username: string }>> {
  const users = await kcAdmin.users.find({ realm: REALM, max: 1000 });
  const admins: Array<{ id: string; username: string }> = [];

  for (const u of users) {
    const mappings = await kcAdmin.users.listRealmRoleMappings({ realm: REALM, id: u.id! });
    if (mappings.some((role) => role.name === 'admin')) {
      admins.push({ id: u.id!, username: u.username! });
    }
  }

  return admins;
}

/**
 * Récupère un administrateur par son ID, ou null si non trouvé / sans rôle 'admin'
 */
export async function findAdminById(
  id: string
): Promise<{ id: string; username: string } | null> {
  const user = await kcAdmin.users.findOne({ realm: REALM, id });
  if (!user) return null;

  const mappings = await kcAdmin.users.listRealmRoleMappings({ realm: REALM, id });
  if (!mappings.some((role) => role.name === 'admin')) {
    return null;
  }

  return { id, username: user.username! };
}

/**
 * Met à jour un administrateur (username, email, attributs, mot de passe)
 */
export async function updateAdmin(
  id: string,
  input: UpdateAdminInput
): Promise<{ id: string; username: string }> {
  const payload: Record<string, any> = {};
  if (input.name) payload.username = input.name;
  if (input.email) payload.email = input.email;
  if (input.superAdminId) payload.attributes = { createdBy: [input.superAdminId] };

  await kcAdmin.users.update({ realm: REALM, id }, payload);

  if (input.password) {
    await kcAdmin.users.resetPassword(
      { realm: REALM, id } as any,
      {
        type: 'password',
        value: input.password,
        temporary: false,
      } as any
    );
  }

  const updated = await kcAdmin.users.findOne({ realm: REALM, id });
  return { id, username: updated!.username! };
}

/**
 * Supprime un administrateur
 */
export async function deleteAdmin(id: string): Promise<void> {
  await kcAdmin.users.del({ realm: REALM, id } as any);
}
