import React, { ReactNode, useState, useEffect } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { initializeKeycloak } from './keycloak';

interface Props {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<Props> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeKeycloak()
      .then((authenticated) => {
        setInitialized(true);
        if (!authenticated) {
          // si pas authentifié, redirige vers le login
          keycloak.login();
        }
      })
      .catch((err) => {
        console.error('Keycloak init failed', err);
      });
  }, []);

  if (!initialized) {
    return <div>Chargement de l’authentification...</div>;
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'check-sso' }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};
