import KcAdminClient from '@keycloak/keycloak-admin-client';

let kcAdminClient: KcAdminClient | null = null;

export async function initKeycloak(): Promise<KcAdminClient> {
  if (!kcAdminClient) {
    kcAdminClient = new KcAdminClient({
      baseUrl:    process.env.KEYCLOAK_BASE_URL,
      realmName:  process.env.KEYCLOAK_REALM,
    });
    await kcAdminClient.auth({
      grantType: 'password',
      clientId:  process.env.KEYCLOAK_CLIENT_ID!,
      username:  process.env.KEYCLOAK_ADMIN_USER!,
      password:  process.env.KEYCLOAK_ADMIN_PASS!,
    });
  }
  return kcAdminClient;
}

export default kcAdminClient;
