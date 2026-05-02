# Database

## Overview

The database is PostgreSQL, managed by [Payload CMS](https://payloadcms.com) using the `@payloadcms/db-postgres` adapter. The schema is defined through Payload collection configs in `cms/src/collections/` and registered in `cms/src/payload.config.ts`. Payload handles migrations automatically.

The generated TypeScript types live in `cms/src/payload-types.ts` — regenerate them after any schema change:

```bash
cd cms
pnpm generate:types
```

## Collections

```mermaid
graph TD
    A["Auth Collections<br/>Users · Members"] --> DB
    B["Content Collections<br/>Events · Execs · Sponsors"] --> DB
    C["Media<br/>Media"] --> DB
    D["Payload System<br/>payload-kv · payload-locked-documents<br/>payload-preferences · payload-migrations"] --> DB
    DB[("PostgreSQL")]
```

### Auth collections

**`users`** — Payload admin accounts. Email/password auth is built in. Anyone with a user account can access the `/admin` panel.

**`members`** — SSA member accounts. Email/password auth enabled. Separate from admin users — members do not have CMS admin access.

### Content collections

**`events`** — Events displayed on the public site. Read-only from the web app's perspective; managed by admins in the CMS.

**`execs`** — Executive committee members displayed on the About page.

**`sponsors`** — Sponsors displayed on the Sponsors page, with one optionally highlighted as sponsor of the week.

### Media

**`media`** — All uploaded files (images, etc.). Used by Events (cover image + gallery), Execs (photo), and Sponsors (logo). Every upload requires an `alt` text field.

## Schema

```mermaid
erDiagram
    users {
        int id PK
        string email
        string password
    }

    members {
        int id PK
        string name
        string email
        string password
        string phone
        enum membershipStatus "active | expired | pending"
        date membershipExpiry
        string stripeCustomerId
        string emergencyContactName
        string emergencyContactPhone
    }

    events {
        int id PK
        string title
        date date
        richtext description
        int coverImage FK
        boolean isUpcoming
    }

    event_images {
        int id PK
        int eventId FK
        int mediaId FK
    }

    execs {
        int id PK
        string name
        string role
        int photo FK
        text bio
        int year
    }

    sponsors {
        int id PK
        string name
        int logo FK
        string websiteUrl
        boolean isSponsorOfTheWeek
        text description
    }

    media {
        int id PK
        string alt
        string url
        string filename
        string mimeType
        int width
        int height
    }

    events ||--o| media : "coverImage"
    events ||--o{ event_images : "images"
    event_images }o--|| media : "file"
    execs ||--o| media : "photo"
    sponsors ||--o| media : "logo"
```

## Environment variables

| Variable         | Required | Purpose                      |
| ---------------- | -------- | ---------------------------- |
| `DATABASE_URL`   | Yes      | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes      | JWT signing secret for auth  |

## Adding a new collection

1. Create a new file in `cms/src/collections/` (e.g. `Events.ts`).
2. Define the collection config and export it.
3. Register it in `cms/src/payload.config.ts` under `collections: [...]`.
4. Run `pnpm dev` — Payload applies the schema change automatically in development.
5. Run `pnpm generate:types` to update `payload-types.ts`.
6. Commit both the collection file and the updated types file.
