# CI/CD

## Overview

There are three GitHub Actions workflows in `.github/workflows/`:

| Workflow               | Trigger                        | What it does                              |
| ---------------------- | ------------------------------ | ----------------------------------------- |
| `ci.yml`               | Every PR + push to `main`      | Lint, typecheck, build both apps          |
| `fly-deploy.yml`       | Push to `main`                 | Deploy to Fly.io                          |
| `pr-notifications.yml` | PR opened / reopened / merged  | Post Discord notification                 |

## CI pipeline

```mermaid
flowchart TD
    PUSH[Push or PR opened]

    PUSH --> VALIDATE{Is it a PR?}
    VALIDATE -->|Yes| BRANCH[Validate branch name<br/>must match feature/ fix/ chore/ hotfix/]
    BRANCH -->|Invalid| FAIL_BRANCH[❌ Fail]
    BRANCH -->|Valid| PARALLEL

    VALIDATE -->|No - push to main| PARALLEL

    PARALLEL --> WEB_JOB[Web job<br/>pnpm install → lint → format:check → tsc → build]
    PARALLEL --> CMS_JOB[CMS job<br/>pnpm install → lint → tsc → build]

    WEB_JOB -->|Pass| SUCCESS[✅ CI passed]
    CMS_JOB -->|Pass| SUCCESS
    WEB_JOB -->|Fail| FAIL[❌ CI failed]
    CMS_JOB -->|Fail| FAIL
```

The web and CMS jobs run in parallel. Both must pass for CI to be green.

## Deploy pipeline

Deploys are triggered automatically on every push to `main`. Only one deploy runs at a time (`concurrency: deploy-group`).

```mermaid
flowchart TD
    MAIN[Push to main]
    MAIN --> BUILD[flyctl deploy --remote-only<br/>Fly.io builds the Docker image remotely]
    BUILD --> DEPLOY[Rolling deploy to Fly.io<br/>app: ssa-prod · region: syd]
    DEPLOY --> LIVE[✅ Live]
```

`--remote-only` means the Docker build runs on Fly.io's infrastructure, not in the GitHub Actions runner — no large image transfer required.

## PR notifications

When a PR is opened, reopened, or merged, a Discord webhook posts a message to the team channel.

```mermaid
sequenceDiagram
    participant GitHub
    participant GitHub Actions
    participant Discord

    GitHub->>GitHub Actions: PR opened / reopened
    GitHub Actions->>Discord: "Pull request opened: [title] | [link]"

    GitHub->>GitHub Actions: PR merged
    GitHub Actions->>Discord: "Pull request merged: [title]"
```

The webhook URL is stored as the `DISCORD_WEBHOOK_URL` repository secret.

## Required secrets

| Secret               | Used by              | Purpose                             |
| -------------------- | -------------------- | ----------------------------------- |
| `PAYLOAD_SECRET`     | `ci.yml` (CMS build) | Required to build the CMS           |
| `DATABASE_URL`       | `ci.yml` (CMS build) | Required to build the CMS           |
| `FLY_API_TOKEN`      | `fly-deploy.yml`     | Authenticates with Fly.io           |
| `DISCORD_WEBHOOK_URL`| `pr-notifications.yml` | Posts messages to Discord         |
