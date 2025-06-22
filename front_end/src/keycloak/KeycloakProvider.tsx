import React, { useEffect, useState, ReactNode } from 'react';
import keycloak from './keycloak';

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      if (authenticated) {
        setReady(true);
      } else {
        console.warn('Utilisateur non authentifié');
      }
    });
  }, []);

  if (!ready) return <div>Chargement...</div>;
  return <>{children}</>;
};
