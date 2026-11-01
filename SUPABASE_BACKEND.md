# Supabase Backend

Project reference: `qjqgekxbknnrnuppfwag`  
Region: `eu-west-2`  
API URL: `https://qjqgekxbknnrnuppfwag.supabase.co`

## Provisioned database

20 public tables are configured:

- Identity: `profiles`, `brand_kits`
- Credits: `credit_accounts`, `credit_ledger`
- Projects and design workflow: `projects`, `project_briefs`, `project_concepts`, `project_blueprints`, `lesson_steps`
- Review and files: `step_verifications`, `qa_reviews`, `project_assets`
- Learning: `reference_analyses`, `practice_assignments`, `practice_attempts`, `knowledge_chunks`
- AI tutor: `mentor_conversations`, `mentor_messages`, `model_runs`
- Administration: `admin_audit_logs`

All 20 public tables have RLS enabled. Three private buckets exist: `avatars` (5 MB), `project-assets` (50 MB), and `project-exports` (100 MB). Storage object paths must begin with the authenticated user's UUID.

Seed content: 2 practice assignments, 3 knowledge chunks and 1 public reference-analysis example. An Auth user-created trigger provisions the profile, a 50-credit account and its welcome ledger entry.

## Applied migrations

1. `20261101174141_initial_ai_design_tutor_backend`
2. `20261101174331_harden_permissions_credit_rpc_and_fk_indexes`

## Frontend setup

Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_PUBLISHABLE_KEY` to the project's publishable key. Install dependencies using `npm install`.

The browser client is `src/lib/supabase.ts`. Database types generated from the live schema are in `src/types/database.ts`. Authentication is provided by the sign-in/sign-up gate in `src/components/AuthGate.tsx`.

**Never put a Supabase service-role or secret key in browser code or a `VITE_*` variable.** The publishable key is designed for browser use, with RLS providing the authorization boundary.

## Security

- Users can read their own profile and change preferences, but cannot change their own `role`.
- Browser clients cannot write directly to credit accounts or the credit ledger.
- Credit debits use `rpc('spend_credits', ...)`, which locks the account row and supports idempotency keys.
- Credit refunds are restricted to the trusted `service_role`.
- Assign the first administrator only after the intended account has registered. Promote that verified user's Auth UUID from the Supabase SQL Editor; never expose an admin-promotion control to browser clients.

## Frontend integration

The authentication gate, typed client, project/profile/credit persistence, design workflow records, lesson progress, mentor history, published practice/reference content, and admin read screens are connected to Supabase. The existing browser `localStorage` data is not automatically migrated; create a new project while signed in, or export old browser-only data before moving it.\n\nAI API endpoints verify the user's access token before calling Gemini. The server charges 1 credit for AI Intake and 2 credits for the Concepts endpoint using the authenticated user's credit RPC; mentor chat has a 20-requests-per-minute per-user limit. For real server-side model-run telemetry, configure `SUPABASE_SERVICE_ROLE_KEY` as a server-only deployment secret (never prefix it with `VITE_`). Optionally configure Gemini input/output cost rates per million tokens. Without the service key, model-run rows are not recorded; without rate settings, cost fields remain zero and should be treated as unpriced.
