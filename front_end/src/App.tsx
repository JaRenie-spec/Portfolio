import React from 'react';
import { fetchWithAuth } from './api/fetchWithAuth';

function App() {
  const handleFetch = async () => {
    const res = await fetchWithAuth('http://localhost:3000/api/user');
    const data = await res.json();
    console.log('Données utilisateur:', data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Keycloak + API</h1>
      <button onClick={handleFetch}>Appeler API protégée</button>
    </div>
  );
}

export default App;
