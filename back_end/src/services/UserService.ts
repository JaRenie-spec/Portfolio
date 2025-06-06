import { CreateUserDTO } from '../types/user.types';
import axios from 'axios';
import { KeycloakTokenResponse } from 'types/keycloak.types';
/**
 * Service pour gérer les utilisateurs avec Keycloak
 */
export class UserService {
  async create(data: CreateUserDTO) {
    // 1. Obtenir un token admin depuis Keycloak
    const tokenRes = await axios.post<KeycloakTokenResponse>(
      `${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: 'admin-cli',
        grant_type: 'password',
        username: process.env.KEYCLOAK_ADMIN_USER!,
        password: process.env.KEYCLOAK_ADMIN_PASS!,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Créer l'utilisateur dans Keycloak
    await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        username: data.email,
        email: data.email,
        enabled: true,
        firstName: data.firstName,
        lastName: data.lastName,
        credentials: [
          {
            type: 'password',
            value: data.password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      email: data.email,
      message: 'Utilisateur créé dans Keycloak',
    };
  }
}
