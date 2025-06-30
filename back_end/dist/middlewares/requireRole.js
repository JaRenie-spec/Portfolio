"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (allowedRoles) => {
    const rolesNeeded = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];
    return (req, res, next) => {
        const user = req.user;
        if (!user || !Array.isArray(user.roles)) {
            res.status(401).json({ success: false, error: 'Non authentifié' });
            return;
        }
        const hasRole = user.roles.some((r) => rolesNeeded.includes(r));
        if (!hasRole) {
            res.status(403).json({ success: false, error: 'Accès refusé' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
