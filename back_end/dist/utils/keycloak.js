"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keycloak_admin_client_1 = __importDefault(require("@keycloak/keycloak-admin-client"));
// Initialisation du client Keycloak Admin
const kcAdmin = new keycloak_admin_client_1.default({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_REALM,
});
// Authentification du client (ex. via token client credentials)
(async () => {
    await kcAdmin.auth({
        grantType: 'client_credentials',
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    });
})();
exports.default = kcAdmin;
