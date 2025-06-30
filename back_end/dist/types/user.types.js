"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
/**
 * z est un namespace fourni par Zod.
 * Il contient toutes les fonctions pour déclarer des schémas
 */
// z.object créé un schéma
exports.CreateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "Prénom requis"),
    lastName: zod_1.z.string().min(1, "Nom requis"),
    email: zod_1.z.string().email("email invalide"),
    password: zod_1.z.string().min(8, "Mot de passe trop court"),
});
/**
 * .optionnal est utile car on ne modifie pas forcément tous les champs
 * par exemple : On peut juste vouloir changer l'email pour raison pro
 */
exports.UpdateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "Prénom requis").optional(),
    lastName: zod_1.z.string().min(1, "Nom requis").optional(),
    email: zod_1.z.string().email("email invalide").optional(),
    password: zod_1.z.string().min(8, "Mot de passe trop court").optional(),
});
// génère un typescript à partir du schéma
