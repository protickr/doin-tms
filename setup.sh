#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Running setup from $ROOT_DIR"

echo "\n1) Installing workspace dependencies (pnpm install)..."
pnpm install

echo "\n2) Generating Prisma client for backend..."
pnpm --filter ./apps/backend run prisma:generate

echo "\n3) Applying Prisma migrations (prisma migrate dev) - may prompt interactively"
if ! pnpm --filter ./apps/backend run prisma:migrate; then
  echo "prisma migrate failed or was interactive. If needed, run manually: pnpm --filter ./apps/backend run prisma:migrate"
fi

echo "\n4) Ensure frontend .env exists"
if [ ! -f "$ROOT_DIR/apps/frontend/.env" ]; then
  cat > "$ROOT_DIR/apps/frontend/.env" <<'EOF'
VITE_API_URL=http://localhost:8000
EOF
  echo "Created apps/frontend/.env"
else
  echo "apps/frontend/.env already exists - leaving it in place"
fi

echo "\n5) Install Tailwind dev dependencies in frontend (tailwindcss, postcss, autoprefixer)"
if ! pnpm --filter ./apps/frontend add -D tailwindcss postcss autoprefixer @tailwindcss/postcss; then
  echo "Warning: failed to install Tailwind dev deps automatically. You can run:\n  pnpm --filter frontend add -D tailwindcss postcss autoprefixer @tailwindcss/postcss"
fi

echo "\n6) Initialize Tailwind config if missing"
if [ ! -f "$ROOT_DIR/apps/frontend/tailwind.config.cjs" ]; then
  echo "Creating Tailwind config (if CLI is available)..."
  if pnpm --filter ./apps/frontend exec -- tailwindcss init -p >/dev/null 2>&1; then
    echo "Generated tailwind.config.cjs and postcss.config.cjs"
  else
    if (cd "$ROOT_DIR/apps/frontend" && npx tailwindcss init -p >/dev/null 2>&1); then
      echo "Generated tailwind.config.cjs and postcss.config.cjs via npx"
    else
      echo "Could not run tailwindcss init -p automatically. If you need Tailwind config, run inside apps/frontend:\n  npx tailwindcss init -p"
    fi
  fi
else
  echo "tailwind.config.cjs exists - skipping init"
fi

echo "\nSetup finished. Next steps:\n  - Start backend: pnpm --filter backend run dev\n  - Start frontend: pnpm --filter frontend run dev\n"

echo "If any step failed above, inspect output and re-run the failing step manually."
