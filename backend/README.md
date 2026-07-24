# SharpJob API (Scaffold)

Minimal Express scaffold for the job-post contract with PostgreSQL persistence.

## Run

1. `cd backend`
2. `npm install`
3. Set env vars (copy `.env.example` into `.env` and edit `DATABASE_URL`).
4. Apply DB schema:

```bash
psql "$DATABASE_URL" -f src/db/schema.sql
```

5. `npm run dev`

Server defaults to `http://localhost:4000/v1`.

## Notes

- Routes use SQL-backed repository functions in `src/db/repo.js`.
- SQL schema is in `src/db/schema.sql`.
- `x-user-id` should be a UUID so it maps to `users.id`.
