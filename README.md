# Cherry

Password-gated Next.js demo with Neon-backed admin settings and fixed brand assets.

## Local setup

Copy `.env.example` to `.env.local`, fill each value, then run:

```bash
npm install
npm run dev
```

Environment variables:

- `ADMIN_PASSWORD`: password for `/admin`.
- `LOCAL_DEV`: set to `true` to bypass guest and admin password prompts locally.
- `DATABASE_URL`: Neon Postgres connection string.
- `NEXT_PUBLIC_SITE_URL`: deployed origin used for social metadata URLs.
