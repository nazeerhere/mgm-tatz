# Client Website A

Controlled client project for Miles / MGM.TATZ: a premium tattoo artist portfolio with a focused owner administration workflow.

The Phase 3 application foundation and portfolio publishing slice are implemented. A development Supabase project must be configured before the live authentication and persistence path can run.

Start with `docs/PROJECT_STATE.md`, then read `docs/ARCHITECTURE.md`, `docs/CONTENT_MODEL.md`, and `docs/VERIFICATION.md`.

## Local setup

1. Use Node.js 20 or newer and run `npm install`.
2. Create one development Supabase project. Do not reuse it for production.
3. Apply `supabase/migrations/202608120001_portfolio_publishing.sql` through the Supabase CLI or reviewed SQL editor.
4. Create one password-based owner user with public signup disabled.
5. Add that user's UUID to the database allowlist:

   ```sql
   insert into public.owner_users (user_id)
   values ('OWNER_AUTH_USER_UUID');
   ```

6. Copy `.env.example` to `.env.local` and provide the development project URL, publishable key, and the same owner UUID. Never place a secret/service-role key in a public environment variable.
7. Run `npm run dev`, sign in at `/admin/login`, and create a private draft.

Draft objects remain in the private `portfolio-drafts` bucket. Publishing copies the image into public `portfolio-media`, updates its metadata, marks the item published, and removes the private object. A separate Supabase production project is required before deployment.

## Commands

```sh
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm start
```
