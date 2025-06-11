import KcAdminClient from "keycloak-admin";

const kcAdminClient = new KcAdminClient();

export const initKeycloak = async () => {
  if (!(kcAdminClient as any).authenticated) {
    await kcAdminClient.auth({
      grantType: "client_credentials",
      clientId:     process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      realmName:    process.env.KEYCLOAK_REALM!,
    });
  }
};

export default kcAdminClient;
