import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";
import { KeycloakTokenResponse } from "../types/keycloak.types";
import axios from "axios";

/**
 * Service pour gérer les utilisateurs avec Keycloak
 * Axios est une bibliothèques qui permet de faire des requêtes HTTP ( GET, POST, PUT, DELETE ) simplement.
 * Elle est utiliser pour communiquer avec des API, récupérer des données ou en envoyer :D
 * Le payload désigne les données envoyées dans une requête HTTP
 */

export class UserService {
  async create(data: CreateUserDTO) {
    const tokenRes = await axios.post<KeycloakTokenResponse>(
      `${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: "admin-cli",
        grant_type: "password",
        username: process.env.KEYCLOAK_ADMIN_USER!,
        password: process.env.KEYCLOAK_ADMIN_PASS!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

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
            type: "password",
            value: data.password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { email: data.email, message: "Utilisateur créé dans Keycloak" };
  }

  async update(id: string, data: UpdateUserDTO) {
    const tokenRes = await axios.post<KeycloakTokenResponse>(
      `${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: "admin-cli",
        grant_type: "password",
        username: process.env.KEYCLOAK_ADMIN_USER!,
        password: process.env.KEYCLOAK_ADMIN_PASS!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    const payload: any = {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.email && { email: data.email, username: data.email }),
    };

    await axios.put(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (data.password) {
      await axios.put(
        `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}/reset-password`,
        {
          type: "password",
          value: data.password,
          temporary: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return { message: "Utilisateur mis à jour avec succès" };
  }

  async delete(id: string) {
    const tokenRes = await axios.post<KeycloakTokenResponse>(
      `${process.env.KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: 'admin-cli',
        grant_type: 'password',
        username: process.env.KEYCLOAK_ADMIN_USER!,
        password: process.env.KEYCLOAK_ADMIN_PASS!,
      }),
      { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    await axios.delete(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return { message: 'Utilisateur supprimé avec succès' };
  }
}
