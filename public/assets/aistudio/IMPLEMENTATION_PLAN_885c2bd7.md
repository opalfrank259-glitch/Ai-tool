# Implementation Plan

**Product:** AI Design Tutor & Creator  
**Document:** Implementation Plan  
**Version:** 1.0  
**Source plan date:** 31 October 2026  
**Approach:** Build and release one milestone at a time; do not implement every module in one pass.

---

## 1. Delivery Strategy

Build a secure foundation, then deliver one complete and measurable workflow: **poster idea → brief → concepts → blueprint → lesson → verification → correction → QA → export**.

The first release should be a thin slice that real beginners can complete. Reference analysis, full practice mode, brand kits, payment subscriptions, advanced editor integration and the Photoshop plugin must not block the MVP.

### 1.1 Recommended order

1. Secure project foundation.
2. Authentication, database, dashboard and storage.
3. Idea intake, brief and concepts.
4. Blueprint, lesson generation and learning workspace.
5. Verification, correction, QA, delivery and privacy controls.
6. Test with real beginners and complete MVP exit gate.
7. Add V1.5 editor canvas/starter file workflow.
8. Expand into V2 and later backlog.

## 2. Repository and Environment Setup

### 2.1 Repository structure

```text
ai-design-tutor/
├── CLAUDE.md / AGENTS.md
├── README.md
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── APP_FLOW.md
│   ├── UI_UX_DESIGN_BRIEF.md
│   ├── BACKEND_SCHEMA.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── BUILD_GUIDE.md
│   └── prompts/
├── .github/workflows/
├── public/
├── src/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
├── tests/
└── .env.example
```

### 2.2 Environments

- Create separate Supabase development and production projects.
- Connect Cloudflare previews to the development environment.
- Connect production deployment to the production environment.
- Keep separate Gemini keys for development and production.
- Store Gemini credentials only in Supabase Edge Function secrets.
- Store only public Supabase/Turnstile variables in frontend build settings.

## 3. Milestone Roadmap

Duration notes below reproduce the estimates in the source guide; they are planning estimates, not guaranteed delivery times.

### Milestone 0 — Project Setup

**Source estimate:** 1–2 days  
**Goal:** Establish the repository, frontend build, cloud projects and safe deployment workflow.

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-001 | Create repository and Vite React TypeScript app | App runs locally; Tailwind, ESLint, Prettier and Vitest configured |
| T-002 | Create Supabase dev/prod projects and CLI linkage | `.env.example` documented; no real secrets committed |
| T-003 | Connect Cloudflare and configure preview deploy + SPA fallback | Pull request preview works |
| T-004 | Add CI, branch protection and secret scanning | Lint/typecheck/test/build run in CI |
| T-005 | Add `CLAUDE.md` / `AGENTS.md` | Coding rules and secret rules committed |

**Exit gate:** A clean clone can install, lint, typecheck and build; preview deployment succeeds; secrets are not committed.

### Milestone 1 — Auth, Database, Dashboard

**Source estimate:** 3–5 days  
**Goal:** Establish user identity, ownership, credits, storage and project navigation.

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-010 | Apply initial database migration on dev | Profiles, credits, projects and related tables created; two-account RLS tests pass |
| T-011 | Build email + Google auth and Turnstile | Signup/login/logout and email confirmation work |
| T-012 | Build app shell and language switcher | English, Roman Urdu and basic Urdu RTL foundation |
| T-013 | Build dashboard | Recent projects, credit chip and New Project action |
| T-014 | Create private Storage buckets and upload component | Upload validation, image compression and EXIF stripping work |

**Exit gate:** Two users cannot read or modify each other’s project rows or files. A new user receives a profile and ledger signup grant. Dashboard can create and resume a draft project.

### Milestone 2 — Idea → Brief → Concepts

**Source estimate:** 1 week  
**Goal:** Complete the first creative-planning stage.

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-020 | Build shared Edge Function helpers | CORS, auth, credits, Gemini, schemas and rate-limit helpers with tests |
| T-021 | Implement `ai-intake` and brief builder | Structured brief, essential questions, placeholder warnings and approval |
| T-022 | Seed package recommender | Templates for supported business types and reasoned suggestions |
| T-023 | Implement `ai-concepts` and gallery | 2–3 distinct directions, revision notes and approval gate |
| T-024 | Implement `ai-image` job and Realtime progress | Private preview storage, job states, refund on failure and fallback |
| T-025 | Log `model_runs` and basic admin cost view | Tokens, latency, errors and estimated cost visible to authorized admin |

**Exit gate:** User can start with a rough idea, approve a brief, see at least two concept directions and approve one. Concept previews are clearly labelled. AI facts are not invented.

### Milestone 3 — Blueprint → Lesson → Learn Workspace

**Source estimate:** 1–2 weeks  
**Goal:** Turn the selected design direction into a teachable production plan.

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-030 | Implement `ai-blueprint` and blueprint screen | Canvas, content, assets, typography, layers, techniques and export plan |
| T-031 | Seed first poster lesson and reviewed knowledge | One human-written 10–15 step poster lesson and 20–30 knowledge chunks |
| T-032 | Implement `ai-lesson` and `project_steps` | App/topic-filtered knowledge retrieval; schema validation and source IDs |
| T-033 | Build learning workspace | Desktop three-panel layout, mobile tabs, progress and resume |
| T-034 | Implement streaming `ai-mentor` | Context-aware short answers and Explain simpler support |
| T-035 | Add feedback controls | Thumbs up/down and “step didn’t match my screen” saved |

**Exit gate:** An approved concept produces a blueprint and a usable lesson plan. User can complete and resume lesson steps. Editor-specific uncertainty is shown honestly.

### Milestone 4 — Verify → Correct → QA → Export

**Source estimate:** 1–2 weeks  
**Goal:** Complete the full poster-to-delivery loop.

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-040 | Build browser metrics tools | Contrast, blur, margins, palette and aspect checks with unit tests |
| T-041 | Implement submissions, consent and `ai-verify` | Private upload, consent record, structured verification and evidence labels |
| T-042 | Implement `ai-correction` | Manual correction guide, approval state and re-test workflow |
| T-043 | Implement `ai-qa` and poster rubric | Objective/subjective findings, severity and prioritized fixes; no absolute score |
| T-044 | Build export guide and delivery page | Formats, settings, naming, handoff notes, recap and project summary download |
| T-045 | Add Terms/Privacy, reporting and account data actions | Report content, export account data and delete account flow |

**MVP exit test:** At least five real beginners complete one poster from idea to export using Roman Urdu. Security and privacy release gates also pass.

### Milestone 5 — V1.5 Practice Canvas and Starter Files

**Goal:** Add useful editor integration without binding the product permanently to one editor.

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-050 | Add `EditorAdapter` and `PhotopeaAdapter` | Embed, read document info and export preview where supported |
| T-051 | Build starter-file pipeline | Layout JSON → Konva preview → evaluate PSD export with `ag-psd` → open in Photopea |
| T-052 | Add editor-backed checks | Dimension/layer/text checks where supported; label results correctly |
| T-053 | Add editor labels to lessons | Photoshop / Photopea / Both shown for every applicable lesson |

**Exit gate:** Photopea failure has a screenshot fallback. Editor actions require approval and checkpoints. Do not promise features not verified in the actual editor API.

### Milestone 6 — V2 Product Expansion

| Ticket | Task | Deliverable / acceptance |
|---|---|---|
| T-060 | Reference analyzer and hotspot UI | Estimated image regions, palette, hierarchy and clear uncertainty notice |
| T-061 | More design categories and Urdu/print lessons | Banner/card/logo exploration, Urdu typography, print handoff pack |
| T-062 | Brand kit and reusable templates | Shared brand data, locked/editable fields and consistency flags |
| T-063 | Practice, assignments, skills and pedagogy | Hint ladder, mastery records, portfolio and recall/reflection features |
| T-064 | Admin content-management system | Lessons, knowledge, rubrics, reports and embeddings/retrieval |
| T-065 | Payments and credit packs | Local gateway or Merchant-of-Record decision, PKR prices and invoices |
| T-066 | Auto-resize and “Where is it?” helper | Multi-format output with human-check warning; screenshot UI hotspot helper |

**Exit gate:** Each V2 module has its own acceptance tests and does not weaken MVP security or verification rules.

### Milestone 7 — Later Backlog

- Photoshop UXP plugin with device-code login, document inspection and approved safe actions.
- Email reminders for unfinished lessons.
- Community features.
- Expert review.
- Classroom dashboard.
- Additional editor integrations.

No later feature should be started at the cost of an incomplete or insecure MVP workflow.

## 4. Dependencies and Critical Path

```text
Repo + Environments
       ↓
Auth + RLS + Storage + Projects
       ↓
Shared Edge helpers + Credits + Model logging
       ↓
Intake + Brief approval
       ↓
Concepts + Concept approval
       ↓
Blueprint
       ↓
Reviewed lesson knowledge + Lesson generation
       ↓
Learning workspace + Mentor
       ↓
Submission + Verification
       ↓
Correction + Re-verification
       ↓
QA + Export + Account controls
       ↓
Real beginner beta / MVP release
```

Critical dependencies:

- RLS and project ownership must exist before any user data workflow.
- Credit spend/refund and model logging should exist before AI features are exposed.
- Brief approval precedes concepts; concept approval precedes blueprint.
- Reviewed lesson content must be available before generated editor instructions can be trusted.
- Consent and private storage must be ready before real screenshot uploads.
- Account deletion/export and security tests must pass before launch.

## 5. Testing Strategy

### 5.1 Functional tests

- Signup/login/logout.
- Create, list and resume project.
- Edit and approve brief.
- Generate, revise and approve concepts.
- Generate blueprint and lessons.
- Complete lesson steps and persist progress.
- Submit preview, verify, correct and re-verify.
- Run QA and view export guide.
- Export project data and delete account.

### 5.2 Security tests — launch blockers

- Two-account test for every user-owned table and every storage bucket.
- User cannot edit own role or credit ledger.
- User cannot change sensitive `approved`/`status` fields outside allowed flows.
- Edge Functions reject missing/expired JWT, wrong project ID, oversized body and disallowed origin.
- `GEMINI_API_KEY` absent from `dist/` and Git history.
- Reject wrong MIME, oversized files, renamed executables and SVG with scripts.
- Prompt-injection text inside screenshot does not change system behavior.
- Concurrent requests cannot overspend credits.

### 5.3 AI quality tests

Create a versioned evaluation set under `/tests/ai`:

- 50+ briefs.
- 100+ Roman Urdu prompts.
- 50+ screenshots with known issues.

Automatic checks:

- Output JSON matches schema.
- No invented phone/date/price.
- Business name preserved exactly.
- No more than three required questions per round.
- Menu paths are grounded in reviewed knowledge.
- Verification methods are honest.

Run tests after every prompt/model change and save `prompt_version`. Human review of at least 20 outputs per release is the source-plan starting recommendation.

### 5.4 Visual and integration tests

- Desktop/tablet/mobile responsive layouts.
- Urdu RTL and mixed English tool names.
- Hotspot position checks when reference analysis is implemented.
- Contrast and keyboard navigation.
- Slow-network behavior (including 3G throttling).
- Photopea embed success/failure fallback.
- Realtime reconnect.
- Image job failure/refund.
- Gemini timeout/429 behavior.
- Supabase function cold starts/time limits.

## 6. Definition of Done (Per Ticket)

Every ticket must include:

- A brief explanation of behavior and files changed.
- TypeScript-safe implementation.
- Unit tests for important logic/schema validation.
- Updated route, UI state and error states where applicable.
- RLS/storage checks where data access is added or changed.
- No client-side secrets or direct Gemini calls.
- A migration for database changes; no manual production DB edits.
- A short manual test checklist.
- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` passing where scripts are configured.

## 7. AI Coding Assistant Workflow

Use Google AI Studio Build, Claude/Claude Code and ChatGPT as helpers without allowing any one tool to silently change the architecture.

| Tool | Intended use |
|---|---|
| Google AI Studio Build | Generate first-draft React UI screens using mocked `api.ts`; remove all client-side Gemini calls before deployment |
| Claude / Claude Code | Architecture review, SQL/RLS, Edge Functions, prompts, schemas, tests and repo-wide refactors |
| ChatGPT | Second-opinion security/code review, Roman Urdu microcopy and evaluation data |

### 7.1 Session workflow

1. Give the AI assistant one ticket at a time.
2. Provide `CLAUDE.md` / `AGENTS.md`, relevant schema and only the files it needs.
3. Ask it to explain planned changes before coding.
4. Require tests with the implementation.
5. Review all SQL migrations and RLS policies.
6. Test with two accounts and a Cloudflare preview after each milestone.
7. Merge only after checks pass.
8. Never paste real API keys into an AI chat; use placeholders.

### 7.2 Repository rules for coding assistants

- Product stack: React + Vite + TypeScript, Supabase, Gemini, Cloudflare.
- Never put `GEMINI_API_KEY` or any secret in frontend code, `VITE_*` variables or Git.
- All AI calls happen inside `supabase/functions/*` using the standard pipeline.
- Every new table gets RLS and cross-user tests.
- Frontend backend calls are routed through `src/services/api.ts`.
- Validate AI outputs with Zod before saving or displaying.
- Never invent business facts; unconfirmed values are placeholders.
- Use honest verification labels.
- One-step-at-a-time UX; support English/Roman Urdu/Urdu and RTL.
- Use a server-configured text model and image model ID.
- Run lint, typecheck and tests before completing a ticket.
- Make small, reviewable changes and explain migrations.

## 8. Release and Deployment Workflow

1. Create a feature branch.
2. Implement one ticket.
3. Run local tests.
4. Open a pull request.
5. CI runs lint, typecheck, tests and build.
6. Cloudflare creates a preview deployment.
7. Supabase migrations/functions are tested against dev.
8. Perform two-account RLS and flow tests as relevant.
9. Merge to `main` only after review.
10. Deploy frontend and Supabase changes using their approved workflows.
11. Monitor errors, latency, credits and model cost after release.

## 9. Operations and Cost Controls

- Start with the source-plan 50 signup credits as a configurable grant, not a hardcoded frontend value.
- Suggested per-function credit values are defaults only; tune from measured `model_runs`.
- Set per-user rate limits and daily caps.
- Use the lowest thinking level that passes evaluation for each function.
- Keep mentor context short; send relevant summaries, not the entire conversation.
- Downscale images before vision requests.
- Limit automatic retries to one where specified.
- Set a global spend alarm and hard monthly AI budget.
- Measure actual cost per completed project before pricing plans.
- Budget for provider price changes and verify the then-current official pricing.

## 10. Risk Register

| Risk | Mitigation / owner action |
|---|---|
| Gemini key exposed | Edge-only secret; scan `dist/` and Git; rotate immediately on exposure |
| Runaway AI spend | Credits, atomic spend, rate limits, daily alarm and monthly budget |
| Model returns invalid JSON | Structured output, Zod validation, one retry and refund on failure |
| Incorrect editor instructions | Reviewed, app/version-aware knowledge; feedback and human review |
| AI-generated text errors | Real text layers; OCR against approved copy |
| Edge Function time limits | Verify current limits; async jobs and Realtime with reliable fallback |
| Free-tier backend limits | Verify plan; use production-grade plan for real users |
| Photopea terms or behavior change | Verify commercial terms; adapter and screenshot fallback |
| RLS policy mistake | Two-account tests in CI and manual migration review |
| Payment route not available | Start with free beta credits; evaluate local PKR gateway or MoR |
| Upload privacy concern | Consent, paid-tier privacy review, retention policy and minimal data |
| Copyright/trademark concern | Original concepts, similarity warnings and no legal-clearance claims |
| Scope creep | Milestone gates and one first category |

## 11. MVP Launch Checklist

### Product readiness

- [ ] Five real beginners can complete one poster from idea to export.
- [ ] Brief approval and concept approval gates work.
- [ ] Two or more concept directions are generated.
- [ ] First poster lesson has been tested by a human in the real editor/version.
- [ ] Roman Urdu evaluation set meets agreed quality thresholds.
- [ ] Verification labels are honest and visible.
- [ ] Credit cost appears before paid actions.
- [ ] Feedback and incorrect-instruction reporting are live.

### Security and privacy

- [ ] RLS enabled on all tables; two-account tests pass.
- [ ] Storage is private and signed URLs are used.
- [ ] No secrets in repository or built assets.
- [ ] Turnstile and rate limits active where configured.
- [ ] Terms, Privacy, AI-use notice and screenshot consent are available.
- [ ] Export/delete data functions work.
- [ ] CSP and security headers are verified.

### Operations

- [ ] Production backups configured and restore path tested.
- [ ] Cost/error/completion dashboards available.
- [ ] Support process and wrong-instruction reporting owner assigned.
- [ ] Migration/function rollback plan documented.
- [ ] Monthly AI budget and daily spend alarm configured.

## 12. Post-MVP Review

After the beta:

1. Review first-five-step completion and idea-to-export conversion.
2. Examine which clarification questions cause abandonment.
3. Review step mismatch and incorrect-instruction feedback.
4. Inspect verification false positives and unknown results.
5. Analyze actual cost by Edge Function and project.
6. Decide whether to prioritize Photopea canvas, reference analyzer, additional design categories or practice mode.
7. Reconfirm pricing, provider privacy terms and gateway availability before adding payments.

---

## 13. Owner Decisions Required Before the Relevant Milestone

- Final name/domain/legal setup.
- First launch category (poster is recommended by the source plan).
- Photoshop-only vs Photoshop + Photopea for first beta.
- Current image model ID and price.
- Beta credit grant and whether payments are deferred.
- Supabase production plan and region.
- Lesson reviewer/maintainer.
- Upload retention duration.
- Monthly AI budget and daily alarm.
- Launch date and beta cohort size.
