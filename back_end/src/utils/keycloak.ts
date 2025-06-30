import KcAdminClient from '@keycloak/keycloak-admin-client';

// Initialisation du client Keycloak Admin
const kcAdmin = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: process.env.KEYCLOAK_REALM,
});

// Authentification du client (ex. via token client credentials)
(async () => {
  await kcAdmin.auth({
    grantType: 'client_credentials',
    clientId: process.env.KEYCLOAK_CLIENT_ID!,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
  });
})();

export default kcAdmin;
