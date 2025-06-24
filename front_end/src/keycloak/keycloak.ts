import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  // URL de ton serveur Keycloak (sans slash final)
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
};

const initOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',     // tenter de récupérer une session existante
  silentCheckSsoRedirectUri:
    window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',      // recommandé pour SPAs
};

const keycloak = new Keycloak(keycloakConfig);

export const initializeKeycloak = (): Promise<boolean> =>
  keycloak.init(initOptions);

export default keycloak;
