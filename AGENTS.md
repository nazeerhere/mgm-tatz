# Client Website A Agent Contract — v0.1

## Mission

Build Miles / MGM.TATZ a premium, artist-first tattoo portfolio that presents finished tattoos and drawings with editorial clarity, while providing one owner with a focused administration workflow.

## Authority

- Work only in this repository unless Nazeer explicitly authorizes another path.
- Use high autonomy for reversible repository work.
- Stop before installing a production dependency, provisioning Supabase or Vercel, deploying, handling credentials, deleting substantial work, or changing the approved product/architecture direction.
- Never commit secrets or client personal data. Use documented environment placeholders.
- Do not modify the Portfolio or SolarBot repositories.

## Required loop

For nontrivial work: inspect, state a bounded plan, implement the smallest coherent change, run applicable verification, review the diff, update project memory, and deliver a checkpoint.

Do not scaffold application code until the Phase 3 implementation checkpoint is approved. Do not build a general-purpose CMS or CRM.

## Canonical product constraints

- Audience: prospective tattoo clients and people evaluating Miles's work.
- Visual baseline: artist-first editorial identity; near-black tattoo sections; warm ivory drawing/process sections; restrained warm gold accent; refined serif display typography; clean UI/body typography; strong grid and negative space; minimal rounded corners.
- Content supports finished tattoos plus drawings, concepts, and flash.
- Public first-version scope: hero, selected tattoos, drawings/flash, About Miles, specialties/influences, FAQ, consultation CTA, and contact/social/Chicago information.
- Excluded: aftercare, design-to-tattoo pairing, advanced CRM automation, payments, shared backend integration, SolarBot work, and a generalized CMS.

## Approved architecture direction

- Next.js App Router with strict TypeScript.
- One isolated Supabase project for PostgreSQL, object storage, and owner authentication.
- Controlled server-side data access; public reads expose published content only.
- Vercel is the proposed frontend host.
- Provider resources and deployment remain approval-gated and unprovisioned.

## Truth and evidence

- Mark material claims Observed, Inferred, or Proposed when needed.
- Never invent artist biography, studio details, social links, availability, portfolio descriptions, or client outcomes.
- Never report a command, test, upload, database mutation, deployment, accessibility check, or responsive check as successful unless observed.

## Persistent records

Keep these concise and current for substantial work:

- `docs/PROJECT_STATE.md`
- `docs/TRAJECTORY.md`
- `docs/DECISIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/VERIFICATION.md`

## Verification ladder

Discover commands from repository files. Run every applicable level: file/syntax inspection, format, lint, strict type checking, unit/integration tests, production build, authentication/authorization checks, persistence checks, responsive behavior, accessibility basics, secret scan, and diff review.

## Checkpoint footer

End substantial reports with: Completed, Verified, Assumptions, Open Decisions, Known Limitations, Next Leverage Point, and Drift Check.
