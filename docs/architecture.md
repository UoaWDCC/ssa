# Architecture

## Repo structure

The repo contains two Next.js apps that are built and deployed together as a single container:

```
ssa/
├── web/        # Next.js 16 public-facing website
├── cms/        # Payload CMS 3.0 admin + content API
├── Dockerfile  # Multi-stage build combining both apps
├── nginx.conf  # Reverse proxy routing
└── fly.toml    # Fly.io deployment config
```

There are no shared packages — the web app consumes content from the CMS via its REST/GraphQL API at runtime.

## System components

```mermaid
graph TD
    subgraph Browser
        USER[Visitor / Admin]
    end

    subgraph Fly.io ["Fly.io (Sydney)"]
        NGINX[Nginx :80]
        WEB[Web app<br/>Next.js 16 :3000]
        CMS[CMS<br/>Payload 3.0 :3001]
    end

    subgraph External
        DB[(PostgreSQL)]
    end

    USER -->|HTTPS| NGINX
    NGINX -->|"/ (everything else)"| WEB
    NGINX -->|"/admin, /api"| CMS
    WEB -->|Payload REST / GraphQL API| CMS
    CMS --> DB
```

## Request routing

Nginx is the single entry point. All traffic hits port 80 (force-HTTPS on Fly.io), and is routed by path prefix:

```mermaid
graph TD
    REQ[Incoming request] --> CHECK{Path prefix?}
    CHECK -->|"/admin/*"| CMS_ADMIN[CMS :3001<br/>Admin panel]
    CHECK -->|"/api/*"| CMS_API[CMS :3001<br/>REST + GraphQL API]
    CHECK -->|Everything else| WEB_APP[Web :3000<br/>Public website]
```

## Docker multi-stage build

Both apps share a single `Dockerfile` at the repo root. They are built independently and combined into one runner image:

```mermaid
flowchart TD
    BASE[node:22-alpine base<br/>+ nginx + pnpm]

    BASE --> CMS_DEPS[cms-deps<br/>pnpm install]
    CMS_DEPS --> CMS_BUILD[cms-builder<br/>pnpm build]

    BASE --> WEB_DEPS[web-deps<br/>pnpm install]
    WEB_DEPS --> WEB_BUILD[web-builder<br/>pnpm build]

    CMS_BUILD --> RUNNER[runner image]
    WEB_BUILD --> RUNNER

    RUNNER --> START["CMD: nginx + node cms/server.js + node web/server.js"]
```

Both Next.js apps use `output: 'standalone'` so only the minimal runtime files are copied into the final image.

## Technology choices

| Layer      | Technology              | Why                                                      |
| ---------- | ----------------------- | -------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router) | SSR + React Server Components                            |
| Styling    | Tailwind CSS 4          | Utility-first                                            |
| CMS        | Payload 3.0             | Code-first CMS, runs as a Next.js app, type-safe         |
| Database   | PostgreSQL              | Payload's postgres adapter; hosted externally            |
| Proxy      | Nginx                   | Routes `/admin` + `/api` to CMS, everything else to web  |
| Deployment | Fly.io                  | Single container, Sydney region (`syd`), 256 MB RAM      |
