// Configuration Keycloak
const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'ebook-store';
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend-client';

// Types pour l'authentification
export interface KeycloakUser {
  sub: string;
  email: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
}

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

class KeycloakService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: KeycloakUser | null = null;

  // Initialiser le service
  init() {
    // Récupérer les tokens stockés
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('keycloak_token');
      this.refreshToken = localStorage.getItem('keycloak_refresh_token');
      const userStr = localStorage.getItem('keycloak_user');
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    }
  }

  // Rediriger vers la page de connexion Keycloak
  login() {
    const redirectUri = window.location.origin;
    const loginUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?` +
      `client_id=${KEYCLOAK_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=${this.generateState()}`;

    window.location.href = loginUrl;
  }

  // Gérer le retour de Keycloak après connexion
  async handleCallback(code: string, state: string) {
    try {
      // Échanger le code contre un token
      const tokenResponse = await this.exchangeCodeForToken(code);

      // Stocker les tokens
      this.token = tokenResponse.access_token;
      this.refreshToken = tokenResponse.refresh_token;

      if (typeof window !== 'undefined') {
        localStorage.setItem('keycloak_token', this.token);
        localStorage.setItem('keycloak_refresh_token', this.refreshToken);
      }

      // Récupérer les informations utilisateur
      this.user = await this.getUserInfo();

      if (typeof window !== 'undefined' && this.user) {
        localStorage.setItem('keycloak_user', JSON.stringify(this.user));
      }

      return this.user;
    } catch (error) {
      console.error('Erreur lors de la gestion du callback:', error);
      throw error;
    }
  }

  // Échanger le code d'autorisation contre un token
  private async exchangeCodeForToken(code: string): Promise<KeycloakTokenResponse> {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KEYCLOAK_CLIENT_ID,
        code: code,
        redirect_uri: window.location.origin,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'échange du code contre un token');
    }

    return response.json();
  }

  // Récupérer les informations utilisateur
  private async getUserInfo(): Promise<KeycloakUser> {
    if (!this.token) {
      throw new Error('Aucun token disponible');
    }

    const userInfoUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

    const response = await fetch(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des informations utilisateur');
    }

    return response.json();
  }

  // Rafraîchir le token
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }

    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: KEYCLOAK_CLIENT_ID,
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du rafraîchissement du token');
    }

    const tokenResponse: KeycloakTokenResponse = await response.json();

    this.token = tokenResponse.access_token;
    this.refreshToken = tokenResponse.refresh_token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('keycloak_token', this.token);
      localStorage.setItem('keycloak_refresh_token', this.refreshToken);
    }

    return this.token;
  }

  // Déconnexion
  logout() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('keycloak_token');
      localStorage.removeItem('keycloak_refresh_token');
      localStorage.removeItem('keycloak_user');

      // Rediriger vers la page de déconnexion Keycloak
      const logoutUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout?` +
        `client_id=${KEYCLOAK_CLIENT_ID}&` +
        `post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;

      window.location.href = logoutUrl;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): KeycloakUser | null {
    return this.user;
  }

  // Obtenir le token d'accès
  getAccessToken(): string | null {
    return this.token;
  }

  // Générer un état aléatoire pour la sécurité
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    if (!this.token) return true;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

// Instance singleton
export const keycloakService = new KeycloakService();

// Initialiser le service au chargement
if (typeof window !== 'undefined') {
  keycloakService.init();
}
