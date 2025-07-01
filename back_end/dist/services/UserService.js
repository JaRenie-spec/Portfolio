"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Service pour gérer les utilisateurs avec Keycloak
 * Axios est une bibliothèques qui permet de faire des requêtes HTTP ( GET, POST, PUT, DELETE ) simplement.
 * Elle est utilisée pour communiquer avec des API, récupérer des données ou en envoyer :D
 * Le payload désigne les données envoyées dans une requête HTTP
 */
class UserService {
    async create(data) {
        const tokenRes = await axios_1.default.post(`${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`, new URLSearchParams({
            client_id: "admin-cli",
            grant_type: "password",
            username: process.env.KEYCLOAK_ADMIN_USER,
            password: process.env.KEYCLOAK_ADMIN_PASS,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const accessToken = tokenRes.data.access_token;
        await axios_1.default.post(`${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`, {
            username: data.email,
            email: data.email,
            enabled: true,
            firstName: data.firstName,
            lastName: data.lastName,
            credentials: [
                {
                    type: "password",
                    value: data.password,
                    temporary: false,
                },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return { email: data.email, message: "Utilisateur créé dans Keycloak" };
    }
    async update(id, data) {
        const tokenRes = await axios_1.default.post(`${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`, new URLSearchParams({
            client_id: "admin-cli",
            grant_type: "password",
            username: process.env.KEYCLOAK_ADMIN_USER,
            password: process.env.KEYCLOAK_ADMIN_PASS,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const accessToken = tokenRes.data.access_token;
        const payload = {
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.email && { email: data.email, username: data.email }),
        };
        await axios_1.default.put(`${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        if (data.password) {
            await axios_1.default.put(`${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}/reset-password`, {
                type: "password",
                value: data.password,
                temporary: false,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
        }
        return { message: "Utilisateur mis à jour avec succès" };
    }
    async delete(id) {
        const tokenRes = await axios_1.default.post(`${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`, new URLSearchParams({
            client_id: 'admin-cli',
            grant_type: 'password',
            username: process.env.KEYCLOAK_ADMIN_USER,
            password: process.env.KEYCLOAK_ADMIN_PASS,
        }), { headers: { 'Content-type': 'application/x-www-form-urlencoded' } });
        const accessToken = tokenRes.data.access_token;
        await axios_1.default.delete(`${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return { message: 'Utilisateur supprimé avec succès' };
    }
}
exports.UserService = UserService;
