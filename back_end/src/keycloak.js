   import Keycloak from "keycloak-js";

   const keycloak = new Keycloak({
     url: "http://localhost:8080",
     realm: "ebook-store",
     clientId: "ebook-frontend",
   });

   export default keycloak;
