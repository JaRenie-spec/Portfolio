import kcAdminClient, { initKeycloak } from "../utils/keycloak";
import { CreateAdminInput, UpdateAdminInput } from "../types/admin.schema";

const REALM = process.env.KEYCLOAK_REALM!;

export const createAdmin = async (input: CreateAdminInput) => {
  await initKeycloak();

  // 1) création de l’utilisateur dans Keycloak
  const { id } = await kcAdminClient.users.create({
    realm:   REALM,
    username: input.name,
    enabled: true,
    credentials: [
      { type: "password", value: input.password, temporary: false }
    ],
    // on peut stocker superAdminId en attribut si besoin
    attributes: input.superAdminId
      ? { createdBy: [input.superAdminId] }
      : undefined,
  });

  // 2) assignation du rôle realm "admin"
  const realmRole = await kcAdminClient.roles.findOneByName({
    realm: REALM, name: "admin"
  });
  if (realmRole) {
    await kcAdminClient.users.addRealmRoleMappings({
      realm: REALM,
      id,
      roles: [{ id: realmRole.id, name: realmRole.name }],
    });
  }

  return { id, name: input.name };
};

export const findAllAdmins = async () => {
  await initKeycloak();
  const users = await kcAdminClient.users.find({ realm: REALM, max: 200 });
  const out = [];
  for (const u of users) {
    const roles = await kcAdminClient.users.listRealmRoleMappings({
      realm: REALM, id: u.id!
    });
    if (roles.some(r => r.name === "admin")) {
      out.push({ id: u.id, name: u.username });
    }
  }
  return out;
};

export const findAdminById = async (id: string) => {
  await initKeycloak();
  const u = await kcAdminClient.users.findOne({ realm: REALM, id });
  if (!u) return null;
  const roles = await kcAdminClient.users.listRealmRoleMappings({
    realm: REALM, id
  });
  if (!roles.some(r => r.name === "admin")) return null;
  return { id: u.id, name: u.username };
};

export const updateAdmin = async (id: string, input: UpdateAdminInput) => {
  await initKeycloak();

  // 1) update des champs username / attributs
  const payload: any = {};
  if (input.name)         payload.username = input.name;
  if (input.superAdminId) payload.attributes = { createdBy: [input.superAdminId] };

  await kcAdminClient.users.update({ realm: REALM, id }, payload);

  // 2) reset du mot de passe si fourni
  if (input.password) {
    await kcAdminClient.users.resetPassword(
      { realm: REALM, id },
      { type: "password", value: input.password, temporary: false }
    );
  }

  const updated = await kcAdminClient.users.findOne({ realm: REALM, id });
  return { id, name: updated!.username };
};

export const deleteAdmin = async (id: string) => {
  await initKeycloak();
  // suppression Keycloak
  await kcAdminClient.users.del({ realm: REALM, id });
};
