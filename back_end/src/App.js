   import React, { useEffect, useState } from "react";
   import keycloak from "./keycloak";

   function App() {
     const [authenticated, setAuthenticated] = useState(false);
     const [username, setUsername] = useState("");

     useEffect(() => {
       keycloak.init({ onLoad: "login-required" }).then((auth) => {
         setAuthenticated(auth);
         if (auth) {
           setUsername(keycloak.tokenParsed.preferred_username);
           console.log("Rôles :", keycloak.tokenParsed.realm_access.roles);
         }
       });
     }, []);

     if (!authenticated) return <p>Chargement...</p>;

     return (
       <div>
         <h1>Bienvenue {username} !</h1>
       </div>
     );
   }

   export default App;
