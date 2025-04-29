#!/usr/bin/env bash
set -euo pipefail

# Script to start Postgres via Docker, wait for readiness, run migrations.

echo "Starting Postgres container..."
docker compose up -d db

echo "Waiting for Postgres to be ready..."
# Use pg_isready inside container; -T for non-TTY
until docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
  echo -n "."
done
echo ""
echo "Postgres is ready."
# Set DATABASE_URL for Drizzle migrations (override as needed)
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set. Retrieving password from Docker container environment."
  # Get the container's POSTGRES_PASSWORD to avoid hardcoding credentials
  DB_PASSWORD=$(docker compose exec -T db printenv POSTGRES_PASSWORD)
  export DATABASE_URL="postgres://postgres:${DB_PASSWORD}@localhost:5433/solaceassignment"
  echo "Exported DATABASE_URL with container password."
else
  echo "Using existing DATABASE_URL environment variable."
fi

echo "Running database migrations..."
# Push Drizzle migrations
npx drizzle-kit push

echo "Database setup complete."
echo "To seed data, start the app (npm run dev) and then run:"
echo "  curl -X POST http://localhost:3000/api/seed"
