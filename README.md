# doin-tms

Monorepo (pnpm workspace) with a TypeScript + Vite + React frontend and an Express + Prisma backend.

This README explains how to get the project running locally, how to build it, and where to configure environment variables.

## Prerequisites

- Node.js (LTS). Note: Vite may require Node 20.19+ or 22.12+ for the dev server to avoid warnings. You can still build with slightly older Node versions but upgrade if you see Vite warnings.
- pnpm (recommended for this workspace). Install with `npm i -g pnpm` if you don't have it.

## Install dependencies

From the repository root run:

```bash
# Install all workspace dependencies
pnpm install
```

This will install dependencies for all workspace packages (`apps/backend`, `apps/frontend`, ...).

## Environment

There are environment variables used by the backend and frontend. Edit or create the files below.

- Backend: `apps/backend/.env` (already present in repo but you may want to review values)
- Frontend: `apps/frontend/.env` (set `VITE_API_URL` to point to your backend dev server)

Example `apps/backend/.env` (sensitive values should be kept secret):

```properties
PORT=8000
NODE_ENV=development
DATABASE_URL="file:./prisma/db/dev.db"
JWT_SECRET="replace-with-a-secure-secret"
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
API_PREFIX=/api
```

Example `apps/frontend/.env`:

```properties
VITE_API_URL=http://localhost:8000
```

> Note: `CORS_ORIGIN` accepts a comma-separated list of allowed origins. Add your production origin when ready.

## Prisma (database)

The backend uses Prisma and an SQLite dev database by default. Run the following when you first set up the project or after schema changes:

```bash
# generate Prisma client for the backend
pnpm --filter backend run prisma:generate

# run migrations (creates/updates the SQLite dev DB)
pnpm --filter backend run prisma:migrate
```

The development DB file lives at `apps/backend/prisma/db/dev.db`.

## Development (run locally)

Start the backend dev server (uses `tsx watch`):

```bash
pnpm --filter backend run dev
```

Start the frontend dev server (Vite):

```bash
pnpm --filter frontend run dev
```

Open the frontend in your browser (Vite will print the local URL, commonly `http://localhost:5173`).

The frontend expects the backend API base URL in `VITE_API_URL` (see `apps/frontend/.env`).

### Automated setup script

There is a convenience script at the repository root: `setup.sh`.

Run it once after cloning to perform the common setup steps automatically:

```bash
./setup.sh
```

What `setup.sh` does:

- Runs `pnpm install` for the workspace
- Generates the Prisma client
- Applies Prisma migrations (may be interactive)
- Ensures `apps/frontend/.env` exists (creates minimal file if missing)
- Attempts to install Tailwind dev dependencies and initialize Tailwind config

If any step fails the script will print a message explaining the next manual command to run.

## Build for production

Build backend (TypeScript compile):

```bash
pnpm --filter backend run build
```

Build frontend:

```bash
pnpm --filter frontend run build
```

## CORS

The backend reads allowed origins from `CORS_ORIGIN` in `apps/backend/.env` (comma-separated). Add origins you want to allow (dev and production).

If you prefer to avoid CORS during local development you can also use a Vite proxy in `apps/frontend/vite.config.ts` instead of contacting the backend directly.

## Tailwind CSS

Tailwind is configured in the frontend (see `apps/frontend/tailwind.config.cjs` and `apps/frontend/postcss.config.cjs`). The Tailwind directives are included in `apps/frontend/src/index.css`.

If you need to (re)install Tailwind locally in the frontend package:

```bash
pnpm --filter frontend add -D tailwindcss postcss autoprefixer @tailwindcss/postcss
pnpm --filter frontend exec tailwindcss init -p
```

## Useful commands

- Install dependencies: `pnpm install`
- Start backend: `pnpm --filter backend run dev`
- Start frontend: `pnpm --filter frontend run dev`
- Build frontend: `pnpm --filter frontend run build`
- Build backend: `pnpm --filter backend run build`
- Generate Prisma client: `pnpm --filter backend run prisma:generate`
- Apply Prisma migrations: `pnpm --filter backend run prisma:migrate`

## Troubleshooting

- If Vite warns about Node version, upgrade Node to at least 20.19 or 22.x.
- If you see CORS errors in the browser, ensure `CORS_ORIGIN` in backend .env includes the frontend origin (e.g., http://localhost:5173) and restart the backend.
- If Prisma complains about client not generated, run `pnpm --filter backend run prisma:generate`.
