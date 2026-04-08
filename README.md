# SSA

A monorepo containing the SSA web frontend and CMS backend.

| Package | Tech | Port |
|---|---|---|
| `web/` | Next.js 16, React 19, Tailwind CSS 4 | 3000 |
| `cms/` | Payload CMS 3, Next.js 15, PostgreSQL | 3001 |

---

## Prerequisites

- **Node.js** `>=20.9.0` (Node 22 recommended)
- **pnpm** `>=9`
- **PostgreSQL** database (Supabase or local)

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/UoaWDCC/ssa.git
cd ssa
```

### 2. Install dependencies

Install dependencies for each package separately:

```bash
cd web && pnpm install
cd ../cms && pnpm install
```

### 3. Configure environment variables

Copy the example env file in the CMS and fill in your values:

```bash
cp cms/.env.example cms/.env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Random secret string for Payload to sign sessions |

The `web` package has no required environment variables.

### 4. Run the development servers

In separate terminals:

```bash
# Web (http://localhost:3000)
cd web && pnpm dev

# CMS (http://localhost:3001)
cd cms && pnpm dev
```

---

## Scripts

### Web (`web/`)

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format:check` | Check formatting with Prettier |

### CMS (`cms/`)

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm devsafe` | Clear `.next` cache and start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm generate:types` | Regenerate Payload TypeScript types |
| `pnpm generate:importmap` | Regenerate Payload import map |
| `pnpm test:int` | Run integration tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm test` | Run all tests |

---

## Code Quality

Both packages use **ESLint** and **Prettier**. The CI pipeline enforces these on every push and pull request.

### Run locally

```bash
# Lint
cd web && pnpm lint
cd cms && pnpm lint

# Format check
cd web && pnpm format:check
```

### Config

| Tool | Web config | CMS config |
|---|---|---|
| ESLint | `web/eslint.config.mjs` | `cms/eslint.config.mjs` |
| Prettier | `web/.prettierrc` | `cms/.prettierrc.json` |
| TypeScript | `web/tsconfig.json` | `cms/tsconfig.json` |

### CI

GitHub Actions runs the following on every PR and push to `main`:

1. ESLint
2. Prettier format check (web only)
3. TypeScript type check (`tsc --noEmit`)
4. Next.js build

PRs cannot be merged into `main` unless both the **Web** and **CMS** checks pass.

---

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| New feature | `feature/short-description` | `feature/events-page` |
| Bug fix | `fix/short-description` | `fix/navbar-overlap` |
| Chore / config | `chore/short-description` | `chore/update-ci` |
| Hotfix | `hotfix/short-description` | `hotfix/broken-build` |

Use lowercase and hyphens, no spaces.

---

## Troubleshooting

**CMS won't start — database connection error**
Make sure `DATABASE_URL` in `cms/.env` is a valid PostgreSQL connection string and your database is accessible.

**CMS build fails with memory error**
The CMS build uses `--max-old-space-size=8000`. If your machine has less than 8GB RAM, lower this value in the `build` script in `cms/package.json`.

**Type errors after pulling new changes**
Payload types may be out of date. Regenerate them:

```bash
cd cms && pnpm generate:types
```

**Stale `.next` cache causing issues**
Use `devsafe` instead of `dev` to clear the cache before starting:

```bash
cd cms && pnpm devsafe
```

**ESLint or Prettier errors blocking CI**
Run lint and format check locally before pushing to catch issues early:

```bash
cd web && pnpm lint && pnpm format:check
cd cms && pnpm lint
```
