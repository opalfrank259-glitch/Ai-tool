# Backend Schema — Supabase PostgreSQL

**Product:** AI Design Tutor & Creator  
**Document:** Backend Schema  
**Version:** 1.0  
**Source plan date:** 31 October 2026  
**Scope:** Logical schema inventory and access model consolidated from the supplied build guide. Review all SQL migrations on a development project before production.

---

## 1. Backend Overview

Supabase is the application backend and system of record. It provides Auth, PostgreSQL, Row Level Security, private Storage, Realtime and Deno/TypeScript Edge Functions. PostgreSQL uses `pgcrypto` and `vector` extensions in the source plan.

### 1.1 Core conventions

- UUID primary keys use `gen_random_uuid()` unless the source schema specifies an identity or serial key.
- User-owned records normally carry `user_id` referencing `profiles.id`.
- Project-owned records reference `projects.id` and are scoped to the owning user.
- Flexible AI output and snapshots use `jsonb`.
- Timestamps use `timestamptz` and generally default to `now()`.
- Every public table must have RLS enabled.
- User uploads and generated files belong in private Storage buckets.
- Sensitive state changes (approvals, status, credits and role) should be handled through controlled server-side flows where required.

## 2. Entity Relationship Overview

```text
auth.users
   └── profiles
       ├── credit_ledger
       ├── projects
       │    ├── project_briefs
       │    ├── deliverables
       │    ├── reference_assets
       │    ├── concepts ──┐
       │    ├── blueprints ◄┘
       │    ├── project_steps ── submissions ── verification_results
       │    ├── qa_reviews ── correction_proposals
       │    ├── project_versions
       │    ├── exports
       │    └── generation_jobs
       ├── brand_kits ─────────── projects.brand_kit_id
       ├── feedback_events
       └── consent_records

Curated/admin data:
  lessons ── lesson_steps
  qa_rubrics ── qa_reviews
  knowledge_chunks
  canvas_presets
  package_templates

Operational/service-only data:
  model_runs, audit_events, content_flags, rate_limits

Private Storage buckets:
  references, submissions, generated, exports, brand
```

## 3. Table Inventory

The field lists below follow the source plan. `PK` = primary key, `FK` = foreign key. Columns not listed in the source guide should not be assumed to exist without a migration.

### 3.1 Profiles and credits

#### `profiles`

| Column | Type / rule | Notes |
|---|---|---|
| `id` | uuid PK, FK → `auth.users(id)` ON DELETE CASCADE | One row per user |
| `display_name` | text | Defaults from auth metadata/email in signup trigger |
| `role` | text, default `user`, check `user/admin/support` | Must not be self-editable |
| `language` | text, default `ur-roman`, check `en/ur-roman/ur/mixed` | AI/UI language preference |
| `skill_level` | text, default `beginner`, check `beginner/basic/intermediate/advanced` | Lesson adaptation |
| `app_name` | text, default `photoshop`, check `photoshop/photopea/other` | Selected editor |
| `app_version` | text | Editor version context |
| `created_at` | timestamptz default now() | Creation time |

#### `credit_ledger`

| Column | Type / rule | Notes |
|---|---|---|
| `id` | bigint identity PK | Ledger event |
| `user_id` | uuid FK → `profiles.id` ON DELETE CASCADE | Owner |
| `delta` | int | Positive grant/refund; negative spend |
| `reason` | text | Examples: signup_bonus, ai-concepts, refund |
| `ref_id` | uuid nullable | Related project/job |
| `created_at` | timestamptz default now() | Event time |

Balance is derived from `sum(delta)`; do not maintain a client-editable balance counter.

### 3.2 Projects and creative pipeline

#### `projects`

| Column | Type / rule | Notes |
|---|---|---|
| `id` | uuid PK | Project ID |
| `user_id` | uuid FK → `profiles.id` ON DELETE CASCADE | Owner |
| `title` | text NOT NULL | Project title |
| `category` | text nullable | poster, banner, logo, card, etc. |
| `mode` | text default `idea_to_final`, check `idea_to_final/reference/improve/practice` | Operating mode |
| `status` | text default `draft`; check `draft/brief_approved/concept_approved/blueprint_ready/learning/review/delivered/archived` | Workflow state |
| `app_name` | text default `photoshop` | Editor selection |
| `current_step_id` | uuid nullable | Current lesson step reference; circular FK can be added after `project_steps` exists if desired, but source only defines the column |
| `idea_text` | text nullable | Original user input |
| `brand_kit_id` | uuid nullable FK → `brand_kits.id` | Added after brand_kits creation |
| `created_at` | timestamptz default now() | Creation time |
| `updated_at` | timestamptz default now() | Updated by trigger |

Index: `(user_id, updated_at DESC)`. Trigger updates `updated_at` before project updates.

#### `project_briefs`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `facts` jsonb NOT NULL default `{}` — user-approved facts
- `interpreted` jsonb NOT NULL default `{}` — AI interpretation
- `assumptions` jsonb NOT NULL default `[]`
- `placeholders` jsonb NOT NULL default `[]`
- `approved` boolean NOT NULL default false
- `language` text nullable
- `version` int NOT NULL default 1
- `created_at` timestamptz default now()

#### `deliverables`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `kind` text NOT NULL (logo, poster, banner, menu, card, etc.)
- `reason` text nullable
- `is_optional` boolean NOT NULL default true
- `selected` boolean NOT NULL default false
- `width_px`, `height_px` int nullable
- `output_intent` text nullable
- `status` text NOT NULL default `planned`

#### `reference_assets`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `storage_path` text NOT NULL
- `kind` text NOT NULL default `reference` (reference, logo, product_photo, existing_design)
- `source_note`, `license_note` text nullable
- `analysis` jsonb nullable
- `created_at` timestamptz default now()

#### `concepts`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `deliverable_id` uuid nullable FK → `deliverables.id` ON DELETE SET NULL
- `version` int NOT NULL default 1
- `title` text NOT NULL
- `details` jsonb NOT NULL (idea, mood, palette, typography, layout, pros, cons)
- `image_path` text nullable
- `warnings` jsonb NOT NULL default `[]`
- `approved` boolean NOT NULL default false
- `revision_note` text nullable
- `created_at` timestamptz default now()

#### `blueprints`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `concept_id` uuid nullable FK → `concepts.id`
- `content` jsonb NOT NULL (canvas, layers, assets, typography, checklist, exports)
- `layout_json` jsonb nullable (starter-file layout)
- `created_at` timestamptz default now()

#### `brand_kits`

- `id` uuid PK
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `name` text NOT NULL
- `data` jsonb NOT NULL default `{}` (colors, fonts, logo_path, tone, contacts, taglines, rules)
- `created_at` timestamptz default now()

`projects.brand_kit_id` references `brand_kits.id`.

### 3.3 Lessons and learning progress

#### `lessons` — curated/admin-managed lesson metadata

- `id` uuid PK
- `slug` text UNIQUE NOT NULL
- `title` text NOT NULL
- `category`, `level`, `app_name`, `app_version`, `language` text nullable
- `version` int NOT NULL default 1
- `reviewed_by` text nullable
- `reviewed_at` date nullable
- `published` boolean NOT NULL default false

#### `lesson_steps` — curated step content

- `id` uuid PK
- `lesson_id` uuid FK → `lessons.id` ON DELETE CASCADE
- `position` int NOT NULL
- `content` jsonb NOT NULL (LessonStep structure)

#### `project_steps` — generated steps for a user's project

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `position` int NOT NULL
- `content` jsonb NOT NULL
- `status` text NOT NULL default `todo`, check `todo/in_progress/submitted/verified/done/skipped`
- `completed_at` timestamptz nullable

Index: `(project_id, position)`.

### 3.4 Submissions, verification and QA

#### `submissions`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `step_id` uuid nullable FK → `project_steps.id` ON DELETE SET NULL
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `storage_path` text NOT NULL
- `kind` text NOT NULL default `preview`, check `preview/screenshot/dimension_proof`
- `client_metrics` jsonb nullable (contrast, blur, margins, palette, etc.)
- `created_at` timestamptz default now()

#### `verification_results`

- `id` uuid PK
- `submission_id` uuid nullable FK → `submissions.id` ON DELETE CASCADE
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `step_id` uuid nullable FK → `project_steps.id` ON DELETE SET NULL
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `method` text NOT NULL, check `editor_verified/screenshot_reviewed/preview_reviewed/user_confirmed/not_verified`
- `passed`, `failed`, `unknown`, `next_actions` jsonb NOT NULL with empty-array defaults
- `needs_new_submission` boolean NOT NULL default false
- `limitations` text nullable
- `created_at` timestamptz default now()

#### `qa_rubrics`

- `id` uuid PK
- `category` text NOT NULL
- `version` int NOT NULL default 1
- `content` jsonb NOT NULL
- `published` boolean default true

#### `qa_reviews`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `rubric_id` uuid nullable FK → `qa_rubrics.id`
- `findings` jsonb NOT NULL (category, severity, objective/subjective, where, why, fix)
- `summary` text nullable
- `created_at` timestamptz default now()

#### `correction_proposals`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `qa_review_id` uuid nullable FK → `qa_reviews.id`
- `issue` text NOT NULL
- `fix` jsonb NOT NULL
- `approval_state` text NOT NULL default `proposed`, check `proposed/approved/rejected/applied/failed`
- `result` jsonb nullable
- `created_at` timestamptz default now()

#### `project_versions`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `label` text nullable
- `snapshot` jsonb NOT NULL
- `created_at` timestamptz default now()

#### `exports`

- `id` uuid PK
- `project_id` uuid FK → `projects.id` ON DELETE CASCADE
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `format` text nullable
- `width_px`, `height_px` int nullable
- `storage_path` text nullable
- `created_at` timestamptz default now()

### 3.5 AI operations and operational data

#### `generation_jobs`

- `id` uuid PK
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `project_id` uuid nullable FK → `projects.id` ON DELETE CASCADE
- `kind` text NOT NULL (concept_images, starter_file, etc.)
- `status` text NOT NULL default `queued`, check `queued/running/done/failed`
- `input`, `output` jsonb nullable
- `error` text nullable
- `created_at` timestamptz default now()
- `finished_at` timestamptz nullable

#### `model_runs` — Edge Function/service writes only

- `id` bigint identity PK
- `user_id`, `project_id` uuid nullable
- `function_name`, `model`, `prompt_version` text nullable
- `input_tokens`, `output_tokens`, `thinking_level`, `latency_ms` nullable (integer/text as appropriate to source DDL)
- `est_cost_usd` numeric(10,5) nullable
- `ok` boolean nullable
- `error` text nullable
- `created_at` timestamptz default now()

#### `feedback_events`

- `id` uuid PK
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `project_id`, `step_id` uuid nullable
- `kind` text NOT NULL, check `thumbs_up/thumbs_down/step_mismatch/wrong_instruction/other`
- `note` text nullable
- `created_at` timestamptz default now()

#### `consent_records`

- `id` uuid PK
- `user_id` uuid FK → `profiles.id` ON DELETE CASCADE
- `kind` text NOT NULL (screenshot_to_ai, terms, privacy, etc.)
- `granted` boolean NOT NULL
- `created_at` timestamptz default now()

#### `audit_events` — service/admin controlled

- `id` bigint identity PK
- `user_id` uuid nullable
- `event` text NOT NULL
- `meta` jsonb nullable
- `created_at` timestamptz default now()

#### `content_flags` — service/admin controlled

- `id` uuid PK
- `user_id`, `project_id` uuid nullable
- `reason` text nullable
- `status` text default `open`
- `created_at` timestamptz default now()

#### `rate_limits` — service controlled

- `user_id` uuid NOT NULL
- `bucket` text NOT NULL
- `window_start` timestamptz NOT NULL
- `count` int NOT NULL default 0
- Composite PK: `(user_id, bucket, window_start)`

### 3.6 Curated knowledge and preset tables

#### `knowledge_chunks`

- `id` uuid PK
- `topic`, `app_name`, `app_version`, `language` text nullable
- `content` text NOT NULL
- `source`, `reviewed_by` text nullable
- `reviewed_at` date nullable
- `embedding` vector(768) in the source example — **verify embedding model and dimension before migration**
- `published` boolean NOT NULL default true
- HNSW index using cosine operations in the source plan

#### `canvas_presets`

- `id` serial PK
- `name`, `category` text nullable
- `width_px`, `height_px`, `dpi` int nullable
- `notes` text nullable

#### `package_templates`

- `id` serial PK
- `business_type` text nullable
- `deliverables` jsonb nullable

## 4. Database Helper Functions and Triggers

### 4.1 `is_admin()`

A stable SQL function using `auth.uid()` to check whether the current user has `profiles.role = 'admin'`. It is used in content-table RLS policies.

### 4.2 `touch_updated_at()`

A trigger function that sets `NEW.updated_at = now()` before updating a row. The source schema attaches it to `projects`.

### 4.3 `credit_balance(p_user uuid)`

Returns the sum of all `credit_ledger.delta` records for the specified user, defaulting to zero.

### 4.4 `spend_credits(p_user, p_amount, p_reason, p_ref)`

- Locks the user's profile row using `FOR UPDATE`.
- Calculates current ledger balance.
- Rejects with `insufficient_credits` if balance is too low.
- Inserts one negative ledger entry.
- Returns the remaining balance.
- Revoke execution from public, anon and authenticated roles; grant only to `service_role`.

### 4.5 `handle_new_user()` trigger

After an auth user is created:

- Insert one profile.
- Add the initial signup credit ledger grant (50 credits in the source plan).

## 5. RLS Policy Model

### 5.1 Non-negotiable rule

Enable RLS on **every public table**. The supplied build guide includes a migration loop to enable RLS for all public tables; still confirm each table has an appropriate policy or is intentionally service-role-only.

### 5.2 Owner-only tables

The source schema applies owner policies to:

- `projects`
- `project_briefs`
- `deliverables`
- `reference_assets`
- `concepts`
- `blueprints`
- `brand_kits`
- `project_steps`
- `submissions`
- `verification_results`
- `qa_reviews`
- `correction_proposals`
- `project_versions`
- `exports`
- `generation_jobs`
- `feedback_events`
- `consent_records`

The generic policy pattern is:

- SELECT: `user_id = auth.uid()`
- INSERT: `WITH CHECK (user_id = auth.uid())`
- UPDATE: `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())`
- DELETE: `user_id = auth.uid()`

**Important:** the source guide warns that unrestricted user UPDATE policies may allow edits to sensitive columns such as `approved` or `status`. Move those transitions into Edge Functions and remove or narrow broad UPDATE policies where necessary.

### 5.3 Profiles

- SELECT and UPDATE own profile only (`id = auth.uid()`).
- Revoke authenticated update privilege on `role` so users cannot promote themselves to admin.

### 5.4 Credits

- Users can SELECT their own ledger records.
- Users cannot INSERT/UPDATE/DELETE credit ledger entries.
- Credit writes are performed by server-side functions using service-role access.

### 5.5 Content tables

- `lessons`, `qa_rubrics`, `knowledge_chunks`: authenticated users can read published content; admins can manage all content.
- `lesson_steps`: authenticated read; admin write per source policy.
- `canvas_presets`, `package_templates`: authenticated read in the source example.

### 5.6 Service-only operational tables

The source plan intentionally provides no user policies for:

- `model_runs`
- `audit_events`
- `content_flags`
- `rate_limits`

These are service-role-only unless a carefully scoped admin view is added through a secure function or aggregate.

## 6. Storage Design

### 6.1 Private buckets

Create these buckets with `public = false`:

| Bucket | Contents |
|---|---|
| `references` | Reference images, existing designs, user-provided brand assets |
| `submissions` | Preview and screenshot submissions |
| `generated` | AI-generated concept preview images and later generated assets |
| `exports` | User exports and project archives |
| `brand` | Brand-kit logos and related assets |

### 6.2 Object path convention

`{user_id}/{project_id}/{filename}`

Storage policies check that the first folder component equals `auth.uid()::text` for the applicable bucket.

### 6.3 Upload rules

- Allow-listed types from the source plan: PNG, JPEG/JPG, WebP and PDF.
- Source guide gives 10 MB as an example size limit; set and verify the actual limit per bucket.
- Strip EXIF in the browser before upload.
- Use signed URLs with short expiry to display private images.
- Generated bucket writes are performed by Edge Functions under the owning user/project path.
- Apply retention deletion to old submissions according to the owner-approved retention period.

## 7. Edge Function to Table Mapping

| Function | Main reads | Main writes |
|---|---|---|
| `ai-intake` | `projects`, package templates | `project_briefs`, `deliverables`, `model_runs`, credit ledger |
| `ai-concepts` | approved `project_briefs`, `deliverables` | `concepts`, `model_runs`, credit ledger |
| `ai-image` | `concepts`, `projects` | `generation_jobs`, Storage `generated`, `model_runs`, credit ledger/refund |
| `ai-blueprint` | approved `concepts`, brief, presets | `blueprints`, `projects.status`, `model_runs`, credit ledger |
| `ai-lesson` | `blueprints`, `lessons`, `lesson_steps`, `knowledge_chunks` | `project_steps`, `model_runs`, credit ledger |
| `ai-verify` | `submissions`, step criteria, client metrics | `verification_results`, `project_steps`, `model_runs`, credit ledger |
| `ai-mentor` | project brief summary, concept, current step, latest verification | `model_runs`, credit ledger |
| `ai-analyze-reference` | reference asset | `reference_assets.analysis`, `model_runs`, credit ledger |
| `ai-qa` | project evidence, `qa_rubrics` | `qa_reviews`, `model_runs`, credit ledger |
| `ai-correction` | QA/verification finding | `correction_proposals`, `model_runs`, credit ledger |
| `export-project` | project-owned data and storage | export archive / `exports`, audit event |
| `delete-account` | user-owned records/storage | deletion and audit records as appropriate |
| `report-content` | authenticated user/project context | `content_flags` |

This mapping is a logical guide; the implementation must enforce ownership checks and transaction behavior for every write.

## 8. Standard AI Function Contract

Request/response conventions:

- Authenticated JWT required.
- Every project-bound function receives a project identifier and checks `projects.id = requested_id AND user_id = auth.uid()`.
- Input parsed with Zod; maximum payload size enforced.
- Rate limit checked before expensive processing.
- Credit spend is atomic and server-side.
- Prompt and AI credentials remain server-side.
- Model result validated against schema before persistence.
- `model_runs` stores tokens, model, function, prompt version, latency, estimated cost and success/error state.
- Response shape should consistently include `ok`, `data` and `credits_left` for synchronous calls; async image calls return `job_id` and later job state.
- Refund credits if a function fails after spending, according to the function's failure policy.

## 9. AI Structured Output Contracts

### 9.1 Intake output

```ts
{
  interpreted_request: string,
  category: "poster" | "banner" | "logo" | "card" | "menu" | "social" | "thumbnail" | "flyer" | "other",
  business_type: string,
  missing_required_facts: { key: string, question: string }[],
  optional_preferences: { key: string, question: string }[],
  deliverables: { kind: string, reason: string, optional: boolean }[],
  assumptions: string[],
  placeholders: string[],
  detected_language: "en" | "ur" | "ur-roman" | "mixed"
}
```

### 9.2 Concept output

```ts
{
  concepts: {
    title: string,
    one_line_idea: string,
    mood: string,
    audience_fit: string,
    palette: { name: string, hex: string }[],
    typography_direction: string,
    layout_direction: string,
    symbol_or_image_treatment: string,
    pros: string[],
    limitations: string[],
    placeholder_warnings: string[],
    image_prompt: string
  }[]
}
```

Each palette contains 4–6 colours. `image_prompt` must not contain real business facts.

### 9.3 Lesson step output

```ts
{
  id: string,
  title: string,
  objective: string,
  menu_path: string | null,
  tool_name: string | null,
  tool_recognition: string | null,
  shortcut: { windows?: string, mac?: string, verified: boolean } | null,
  menu_fallback: string | null,
  what_it_does: string,
  why_here: string,
  actions: string[],
  settings: { name: string, value: string }[],
  expected_result: string,
  common_mistakes: string[],
  practice_task: string | null,
  verification: {
    method: "preview" | "screenshot" | "editor" | "user_confirm",
    criteria: string[],
    needs_dimension_proof: boolean
  },
  recovery: string,
  app_differences: { photoshop?: string, photopea?: string } | null,
  source_chunk_ids: string[]
}
```

Maximum about five ordered actions per step. Empty source IDs mean unverified source grounding and require a UI warning.

### 9.4 Verification output

```ts
{
  method: "editor_verified" | "screenshot_reviewed" | "preview_reviewed" | "user_confirmed" | "not_verified",
  passed: { check: string, evidence: string }[],
  failed: { check: string, where: string, why: string,
            severity: "critical" | "important" | "polish", fix: string[] }[],
  unknown: { check: string, reason: string }[],
  subjective_notes: string[],
  needs_new_submission: boolean,
  next_actions: string[],
  limitations: string
}
```

### 9.5 QA output

Findings contain category, severity, kind (`objective` or `subjective`), where, why and `fix[]`; response contains summary and top three fixes. Do not use one absolute score.

### 9.6 Reference analysis output

Includes category, canvas ratio estimate and confidence, normalized bounding boxes for regions, palette, typography traits, hierarchy, effects, likely techniques, layer plan and estimate notice.

### 9.7 Blueprint output

Includes summary, canvas properties, content checklist, palette, typography roles/alternatives, assets and license notes, layer groups, technique sequence, milestones, exports and optional `layout_json` with normalized or canvas-relative item positions.

## 10. Knowledge Retrieval

- Admin maintains `knowledge_chunks` with topic, editor, app version, language, source, reviewer and review date.
- Lesson retrieval must filter by selected app/version and relevant language.
- MVP may begin with topic + app filtering without vectors.
- When the collection grows, create embeddings with a verified embedding model and matching vector dimension.
- Retrieve a small relevant set (source guide suggests up to eight chunks) and include their IDs in lesson output.
- Only reviewed knowledge should be treated as verified editor instructions.

## 11. Index and Constraint Checklist

Source-specified indexes and constraints include:

- `credit_ledger(user_id, created_at DESC)`.
- `projects(user_id, updated_at DESC)`.
- `project_steps(project_id, position)`.
- Unique `lessons.slug`.
- `rate_limits(user_id, bucket, window_start)` composite primary key.
- HNSW cosine index on `knowledge_chunks.embedding` when embedding dimension/model is settled.
- Check constraints for roles, language, skill level, app name, project mode/status, step status, verification method, job status, correction state and feedback kind.

Add other indexes only after query patterns and performance tests justify them.

## 12. Seed Data Requirements

`seed.sql` should include:

- 8–10 canvas presets (e.g. Instagram post, story, WhatsApp Status, A4, visiting card, YouTube thumbnail and web hero).
- Package templates for hotel, restaurant, clothing, salon, online store, event and real estate.
- One poster QA rubric.
- One human-written and real-app-tested “Basic promotional poster” lesson with approximately 10–15 steps.
- Reviewed knowledge chunks for the selected editor/application and version.

## 13. Security and Schema Review Warnings

Before applying migrations to production:

1. Confirm RLS is enabled on every public table.
2. Verify every user-facing table has a deliberate policy, or is intentionally service-role-only.
3. Ensure users cannot self-edit `profiles.role`.
4. Ensure users cannot alter their own credit ledger.
5. Review broad project-table UPDATE policies for changes to `approved`, `status`, ownership and other sensitive columns. Use Edge Functions for protected transitions where necessary.
6. Test foreign-key ownership consistency: a user must not attach a resource owned by another user to their project.
7. Verify storage policies across every bucket and all object operations.
8. Check any admin reporting path does not accidentally expose private project content.
9. Ensure `spend_credits` is callable only by the service role.
10. Test simultaneous credit spending to prove balances cannot go negative.

## 14. Schema Migration Strategy

- Keep all database changes under `supabase/migrations/`.
- Use sequential, reviewable migration files.
- Test each migration on the development Supabase project.
- Include rollback/recovery notes for risky data changes.
- Avoid hand-editing production tables.
- Deploy migrations using the Supabase CLI through the approved GitHub Actions workflow.
