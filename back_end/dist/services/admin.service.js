"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = createAdmin;
exports.findAllAdmins = findAllAdmins;
exports.findAdminById = findAdminById;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
/* src/services/admin.service.ts */
const keycloak_1 = __importDefault(require("../utils/keycloak"));
const REALM = process.env.KEYCLOAK_REALM;
/**
 * Crée un nouvel administrateur et lui assigne le rôle 'admin'
 */
async function createAdmin(input) {
    // Création de l'utilisateur
    const user = await keycloak_1.default.users.create({
        realm: REALM,
        username: input.name,
        email: input.email,
        enabled: true,
        credentials: [
            {
                type: 'password',
                value: input.password,
                temporary: false,
            },
        ],
        attributes: input.superAdminId
            ? { createdBy: [input.superAdminId] }
            : undefined,
    });
    const userId = user.id;
    // Assignation du rôle 'admin'
    const realmRole = await keycloak_1.default.roles.findOneByName({ realm: REALM, name: 'admin' });
    if (realmRole?.id && realmRole.name) {
        await keycloak_1.default.users.addRealmRoleMappings({
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
async function findAllAdmins() {
    const users = await keycloak_1.default.users.find({ realm: REALM, max: 1000 });
    const admins = [];
    for (const u of users) {
        const mappings = await keycloak_1.default.users.listRealmRoleMappings({ realm: REALM, id: u.id });
        if (mappings.some((role) => role.name === 'admin')) {
            admins.push({ id: u.id, username: u.username });
        }
    }
    return admins;
}
/**
 * Récupère un administrateur par son ID, ou null si non trouvé / sans rôle 'admin'
 */
async function findAdminById(id) {
    const user = await keycloak_1.default.users.findOne({ realm: REALM, id });
    if (!user)
        return null;
    const mappings = await keycloak_1.default.users.listRealmRoleMappings({ realm: REALM, id });
    if (!mappings.some((role) => role.name === 'admin')) {
        return null;
    }
    return { id, username: user.username };
}
/**
 * Met à jour un administrateur (username, email, attributs, mot de passe)
 */
async function updateAdmin(id, input) {
    const payload = {};
    if (input.name)
        payload.username = input.name;
    if (input.email)
        payload.email = input.email;
    if (input.superAdminId)
        payload.attributes = { createdBy: [input.superAdminId] };
    await keycloak_1.default.users.update({ realm: REALM, id }, payload);
    if (input.password) {
        await keycloak_1.default.users.resetPassword({ realm: REALM, id }, {
            type: 'password',
            value: input.password,
            temporary: false,
        });
    }
    const updated = await keycloak_1.default.users.findOne({ realm: REALM, id });
    return { id, username: updated.username };
}
/**
 * Supprime un administrateur
 */
async function deleteAdmin(id) {
    await keycloak_1.default.users.del({ realm: REALM, id });
}
