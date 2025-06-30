import jwksClient, { JwksClient } from 'jwks-rsa';

const client: JwksClient = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  cache: true,                  // met en cache les clés (par défaut 5 entrées)
  cacheMaxEntries: 5,           // nombre max de clés en cache
  cacheMaxAge: 600_000,         // durée max (ms) avant invalidation (ici 10 min)
  rateLimit: true,              // active la limitation de requêtes
  jwksRequestsPerMinute: 10,    // max 10 requêtes/minute
});

/**
 * Récupère la clé publique PEM correspondant au `kid`.
 */
export async function getPublicKey(kid: string): Promise<string> {
  const key = await client.getSigningKey(kid);
  // selon la version de jwks-rsa, getPublicKey() ou publicKey/rsaPublicKey
  return key.getPublicKey
    ? key.getPublicKey()
    : (key as any).publicKey || (key as any).rsaPublicKey;
}
