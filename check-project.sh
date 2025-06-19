#!/bin/bash

# Chemins
FRONT_DIR="./front_end/chapter_one"
API_FILE="$FRONT_DIR/src/lib/api.ts"
TSCONFIG="$FRONT_DIR/tsconfig.json"
ENV_FILE="$FRONT_DIR/.env.local"

echo "🔍 Vérification du projet Next.js (frontend)..."

# 1. Vérification du fichier api.ts
if [ -f "$API_FILE" ]; then
  echo "✅ Fichier présent : $API_FILE"
else
  echo "❌ Fichier manquant : $API_FILE"
fi

# 2. Vérification de l'alias @ dans tsconfig
if grep -q '"@/\*": \["\.\/src/\*"\]' "$TSCONFIG"; then
  echo "✅ Alias '@/src/*' trouvé dans $TSCONFIG"
else
  echo "❌ Alias manquant ou incorrect dans $TSCONFIG"
fi

# 3. Vérification de la variable d’environnement
if grep -q "NEXT_PUBLIC_API_URL=" "$ENV_FILE"; then
  echo "✅ Variable NEXT_PUBLIC_API_URL trouvée dans $ENV_FILE"
else
  echo "❌ Variable NEXT_PUBLIC_API_URL manquante dans $ENV_FILE"
fi

echo "✅ Vérification terminée."
