"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getKey_1 = require("../utils/getKey");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const protect = async (req, res, next) => {
    // 1️⃣ Vérification de la présence du token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token manquant ou invalide' });
        return;
    }
    const token = authHeader.slice(7);
    // 2️⃣ Décodage de l’en-tête pour récupérer le kid
    const decodedHeader = jsonwebtoken_1.default.decode(token, { complete: true });
    if (!decodedHeader) {
        res.status(401).json({ error: 'Impossible de décoder le token' });
        return;
    }
    // 3️⃣ Récupération de la clé publique correspondante
    let publicKey;
    try {
        publicKey = await (0, getKey_1.getPublicKey)(decodedHeader.header.kid);
    }
    catch (err) {
        console.error('Échec récupération de la clé publique :', err);
        res.status(401).json({ error: 'Clé de vérification introuvable' });
        return;
    }
    // 4️⃣ Vérification du token JWT
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] });
    }
    catch (err) {
        console.error('Échec vérification JWT :', err);
        res.status(401).json({ error: 'Token invalide ou expiré' });
        return;
    }
    // 5️⃣ Extraction des informations utilisateur
    const sub = payload.sub;
    const email = payload.email || '';
    const username = payload.preferred_username || '';
    const firstName = payload.given_name || '';
    const lastName = payload.family_name || '';
    // 6️⃣ Fusion des rôles realm et client
    const realmRoles = payload.realm_access?.roles || [];
    const clientRoles = payload.resource_access?.[CLIENT_ID]?.roles || [];
    const roles = Array.from(new Set([...realmRoles, ...clientRoles]))
        .map(r => r.toLowerCase());
    // 7️⃣ Upsert dans la table account (commune à tous les rôles)
    try {
        await prisma.account.upsert({
            where: { id: sub },
            update: { email, username, roles },
            create: { id: sub, email, username, roles },
        });
        // 7.1️⃣ Si admin
        if (roles.includes('admin')) {
            await prisma.admin.upsert({
                where: { id: sub },
                update: { name: username },
                create: {
                    id: sub,
                    name: username,
                    password: '',
                },
            });
        }
        // 7.2️⃣ Sinon, si author
        else if (roles.includes('author')) {
            await prisma.author.upsert({
                where: { id: sub },
                update: {
                    email,
                    firstName,
                    lastName,
                    pseudo: username,
                },
                create: {
                    id: sub,
                    email,
                    password: '',
                    firstName,
                    lastName,
                    pseudo: username,
                },
            });
        }
        // 7.3️⃣ Sinon, si client
        else if (roles.includes('client')) {
            await prisma.user.upsert({
                where: { id: sub },
                update: { email, firstName, lastName },
                create: {
                    id: sub,
                    email,
                    password: '',
                    firstName,
                    lastName,
                },
            });
        }
        // 7.4️⃣ Sinon, aucun rôle traité
        else {
            console.warn(`Utilisateur ${sub} sans rôle géré : [${roles.join(', ')}]`);
            // Optionnel : res.status(403).json({ error: 'Rôle non autorisé' }); return;
        }
    }
    catch (err) {
        console.error('Erreur upsert DB :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la synchronisation' });
        return;
    }
    // 8️⃣ Injection de l’utilisateur pour la suite
    req.user = { sub, email, username, roles };
    // 9️⃣ On passe au middleware suivant
    next();
};
exports.protect = protect;
