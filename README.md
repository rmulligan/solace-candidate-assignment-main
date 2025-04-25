## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```
### Environment Variables

Copy `.env.example` to `.env.local` (this file is ignored by Git):

```bash
cp .env.example .env.local
```

You can adjust the `DATABASE_URL` value in `.env.local` if needed.

## Database set up

## Database set up

Use the included Docker Compose to start Postgres and run migrations automatically:

```bash
npm run db:setup
```

This will:
 1. Start the Postgres container (`db` service in `docker-compose.yml`)
 2. Wait for Postgres to be ready
 3. Execute Drizzle migrations (`npx drizzle-kit push`)

### Seeding the database

After starting the Next.js dev server (`npm run dev`), seed the database:

```bash
npm run seed
# or
curl -X POST http://localhost:3000/api/seed
```
