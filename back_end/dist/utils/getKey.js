"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKey = getPublicKey;
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const client = (0, jwks_rsa_1.default)({
    jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
    cache: true, // met en cache les clés (par défaut 5 entrées)
    cacheMaxEntries: 5, // nombre max de clés en cache
    cacheMaxAge: 600000, // durée max (ms) avant invalidation (ici 10 min)
    rateLimit: true, // active la limitation de requêtes
    jwksRequestsPerMinute: 10, // max 10 requêtes/minute
});
/**
 * Récupère la clé publique PEM correspondant au `kid`.
 */
async function getPublicKey(kid) {
    const key = await client.getSigningKey(kid);
    // selon la version de jwks-rsa, getPublicKey() ou publicKey/rsaPublicKey
    return key.getPublicKey
        ? key.getPublicKey()
        : key.publicKey || key.rsaPublicKey;
}
