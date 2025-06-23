#!/usr/bin/env sh

echo "⏳ Waiting for Postgres…"
until pg_isready -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 1
done

echo "✅ Postgres is up, running migrations"
npx prisma migrate dev --name init

echo "🚀 Starting server"
npm run start
