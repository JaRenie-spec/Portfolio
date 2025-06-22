import jwksClient, { JwksClient } from 'jwks-rsa';

const client: JwksClient = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
});

/**
 * Récupère la clé publique PEM correspondant au `kid`.
 */
export async function getPublicKey(kid: string): Promise<string> {
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}
