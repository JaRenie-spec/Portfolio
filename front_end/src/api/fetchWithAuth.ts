import keycloak from '../keycloak/keycloak';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = keycloak.token;
  return fetch(endpoint, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
