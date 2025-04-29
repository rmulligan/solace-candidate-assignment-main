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
export DATABASE_URL="postgres://postgres:password@localhost:5433/solaceassignment"

echo "Running database migrations..."
# Push Drizzle migrations
npx drizzle-kit push

echo "Database setup complete."
echo "To seed data, start the app (npm run dev) and then run:"
echo "  curl -X POST http://localhost:3000/api/seed"
