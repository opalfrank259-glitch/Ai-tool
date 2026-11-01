# Technical Requirements Document (TRD)

**Product:** AI Design Tutor & Creator  
**Document:** TRD — Technical Requirements Document  
**Version:** 1.0  
**Source plan date:** 31 October 2026  
**Status:** Technical baseline; verify time-sensitive provider details before implementation.

---

## 1. Technical Summary

The system is a React single-page application (SPA) hosted on Cloudflare. Supabase provides authentication, PostgreSQL, Row Level Security (RLS), private object storage, Realtime and TypeScript/Deno Edge Functions. Gemini is called only from the server-side Edge Functions. GitHub is the source of truth and drives frontend and backend deployment pipelines.

### 1.1 Mandatory security decision

**Never place `GEMINI_API_KEY` in React code, a `VITE_` variable, browser storage or Git.** All AI calls must use:

`React → src/services/api.ts → Supabase Edge Function → Gemini API`

The Supabase anon/publishable key can exist in the frontend; table/storage safety must come from RLS and private bucket policies.

## 2. System Architecture

```text
GitHub repository
  ├── React + Vite + TypeScript source
  ├── Supabase SQL migrations / Edge Functions
  └── GitHub Actions workflows
          │
          ├── Cloudflare deployment
          │      └── Static React SPA + CDN + DNS + SSL + WAF + Turnstile
          │
          └── Supabase deployment
                 ├── Auth
                 ├── PostgreSQL + pgvector
                 ├── Private Storage
                 ├── Realtime
                 └── Edge Functions (Deno / TypeScript)
                          │ server-side secret only
                          └── Gemini API
                               ├── Text/vision model
                               └── Separate image-generation model
```

### 2.1 Responsibilities

| Component | Responsibility | Must not do |
|---|---|---|
| React SPA | UI, routing, forms, local drafts, browser-side image checks, editor adapters | Call Gemini directly or contain server secrets |
| `src/services/api.ts` | Single frontend gateway for Supabase reads/writes and Edge Function invocation | Contain Gemini keys or prompt secrets |
| Supabase Auth | User sessions and authentication providers | Decide project ownership without database policies |
| PostgreSQL | Persist profiles, projects, content, activity, usage and credits | Expose cross-user rows |
| RLS | Enforce row-level access | Be omitted from any public table |
| Storage | Keep private uploads, previews and exports | Serve user files as public objects by default |
| Edge Functions | Validate, authorize, spend credits, call Gemini, persist/log results | Trust browser input or expose secrets |
| Gemini | Structured reasoning/text/vision and separate image generation | Be called directly from the browser |
| Cloudflare | Static hosting, CDN, DNS, TLS, WAF and Turnstile | Replace Supabase as the system-of-record backend |
| GitHub Actions | CI and controlled migrations/function deployment | Store Gemini API key in repository secrets unless there is an explicitly approved alternative; source guide places it in Supabase secrets |

## 3. Technology Stack

### 3.1 Frontend

| Need | Technology from source plan |
|---|---|
| Framework/build | React + Vite + TypeScript |
| Styling | Tailwind CSS; shadcn/ui optional |
| Routing | React Router |
| Server state | TanStack Query |
| Forms/validation | react-hook-form + Zod |
| Backend SDK | `@supabase/supabase-js` |
| Localization | i18next + react-i18next (`en`, `ur-roman`, `ur`) |
| Canvas preview | Konva or Fabric.js |
| PSD export (V1.5) | `ag-psd` — evaluate quality and limits before committing |
| Embedded editor (V1.5) | Photopea npm wrapper / embedded Photopea |
| OCR | `tesseract.js` or Gemini OCR |
| Image metrics | Browser Canvas API and optional `opencv.js` WASM |
| Icons | lucide-react |
| Tests | Vitest, React Testing Library, Playwright |

### 3.2 Backend

- Supabase Auth.
- Supabase PostgreSQL with `pgcrypto` and `vector` extensions.
- Supabase Storage with private buckets.
- Supabase Realtime for job progress.
- Supabase Edge Functions using Deno and TypeScript.
- Zod validation for request and model output schemas.
- `pgvector` retrieval for curated editor knowledge; the MVP may begin with topic/app filtering before enabling embeddings.

### 3.3 AI model configuration

- Text/vision model named by the source guide: `gemini-3.8-flash`.
- Separate image-generation model supplied using `GEMINI_IMAGE_MODEL`.
- The source guide states the text model returns text and cannot generate images; concept image generation must be handled by the separate image model.
- Exact model IDs, thinking configuration fields, limits, privacy terms, API behavior and prices are **verification items**, not hardcoded permanent assumptions.
- Keep image-model and text-model IDs in server-side environment secrets/configuration.

## 4. Frontend Application Structure

```text
src/
├── main.tsx
├── App.tsx
├── routes.tsx
├── i18n/
│   ├── en.json
│   ├── ur-roman.json
│   └── ur.json
├── lib/
│   ├── supabase.ts
│   ├── zod-schemas.ts
│   └── constants.ts
├── services/
│   └── api.ts                 # single backend gateway
├── hooks/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── tutor/
│   ├── concepts/
│   ├── review/
│   └── editor/
├── features/
│   ├── auth/ dashboard/ projects/ brief/ concepts/ blueprint/
│   ├── learning/ review/ delivery/ portfolio/ settings/ admin/
├── tools/
│   ├── contrast.ts
│   ├── blur.ts
│   ├── margins.ts
│   ├── palette.ts
│   ├── aspect.ts
│   ├── ocr.ts
│   ├── exifStrip.ts
│   └── cropBlur.tsx
└── editor/
    └── EditorAdapter implementation(s)
```

### 4.1 Single API gateway requirements

`src/services/api.ts` owns all calls to Supabase. Expected operations include:

- `startProject`, `getProjects`, `getProject`, `archiveProject`
- `runIntake`, `approveBrief`
- `generateConcepts`, `startImageJob`, `approveConcept`, `reviseConcept`
- `buildBlueprint`, `generateLesson`
- `submitPreview`, `verifyStep`, `getVerificationHistory`
- `askMentor`, `runQA`, `getDelivery`
- `exportProject`, `deleteAccount`, `reportContent`

Plain reads/writes use `supabase.from(...)` and are protected by RLS. AI operations use `supabase.functions.invoke(...)`.

Map technical errors to friendly messages, including:

| Error | User-facing behavior |
|---|---|
| `insufficient_credits` | Explain that credits are insufficient; do not silently retry. |
| Rate limit | Explain that the user should try again later. |
| Invalid AI schema/output | Explain that the AI response was invalid; refund spent credits according to backend policy. |
| Provider timeout / 429 | Show retryable state, avoid duplicate charging and preserve project state. |

## 5. Backend Request Lifecycle

### 5.1 Standard synchronous AI request

1. Handle CORS preflight for origins in `ALLOWED_ORIGINS` only.
2. Verify the user from the JWT; reject missing/invalid sessions.
3. Parse and validate request body with Zod and size limits.
4. Apply per-user rate limits.
5. Verify the requested project belongs to the authenticated user.
6. Run content-safety checks where relevant.
7. Spend credits through the atomic `spend_credits` RPC.
8. Build a server-side prompt using delimited user data and approved knowledge chunks.
9. Call Gemini with the selected model, thinking level and structured-output schema.
10. Validate the response with Zod; retry once for schema-invalid output; refund on terminal failure.
11. Save the result and write a `model_runs` record.
12. Return a consistent response such as `{ ok, data, credits_left }`.

### 5.2 Asynchronous image request

1. Validate request and project ownership.
2. Spend credits and insert `generation_jobs` with `queued` status.
3. Return a `job_id` to the client.
4. Process the image-generation request with the configured image model.
5. Move job state through `running` to `done` or `failed`.
6. Store completed image output in the private `generated` bucket.
7. Refund credits on failure.
8. Client listens through Supabase Realtime and displays progress.
9. If generation fails, retain the text concept and moodboard colours so the lesson workflow is not blocked.

**Verification required:** Confirm current Supabase Edge Function background-task and maximum-duration behavior before relying on in-process background work. The source guide explicitly flags this.

## 6. Edge Function Inventory

Credit values below are the source guide’s suggested starting values, not final pricing.

| Function | Input / purpose | Suggested credits | Model / execution |
|---|---|---:|---|
| `ai-intake` | Idea → brief, missing facts, deliverables | 1 | Text model, low, synchronous |
| `ai-concepts` | Brief → 2–3 concept directions | 2 | Text model, medium, synchronous |
| `ai-image` | Concept → preview image | 3 per image | Image model, asynchronous job |
| `ai-blueprint` | Approved concept → blueprint/layout JSON | 2 | Text model, medium, synchronous |
| `ai-lesson` | Blueprint + retrieved knowledge → steps | 3 | Text model, medium, synchronous |
| `ai-verify` | Preview/screenshot + metrics → verification | 2 | Text/vision model, low/medium |
| `ai-mentor` | Context-aware mentor response | 1 | Text model, low, streaming |
| `ai-analyze-reference` | Reference image → estimated breakdown | 3 | Text/vision model, medium |
| `ai-qa` | Design → rubric findings | 3 | Text/vision model, medium |
| `ai-correction` | Issue → manual correction guide | 1 | Text model, low |
| `export-project` | User project archive/summary | 0 | No AI |
| `delete-account` | Delete user data and storage | 0 | No AI |
| `report-content` | Create content flag | 0 | No AI |

Credits are tuned using measured `model_runs` data. Every paid operation needs clear client-side cost disclosure and server-side atomic spending.

## 7. AI Contracts and Validation

Define shared schemas in `supabase/functions/_shared/schemas.ts` and mirror compatible validation in `src/lib/zod-schemas.ts`.

### 7.1 Intake contract

- `interpreted_request: string`
- `category`: poster, banner, logo, card, menu, social, thumbnail, flyer or other
- `business_type: string`
- `missing_required_facts[]`: `{ key, question }`, maximum three per round
- `optional_preferences[]`: `{ key, question }`
- `deliverables[]`: `{ kind, reason, optional }`
- `assumptions[]`, `placeholders[]`
- `detected_language`: en, ur, ur-roman or mixed

### 7.2 Concept contract

Each concept contains title, one-line idea, mood, audience fit, palette (4–6 named hex colours), typography direction, layout direction, symbol/image treatment, pros, limitations, placeholder warnings and an `image_prompt` that contains no real business facts.

### 7.3 Lesson step contract

Each step contains id, title, objective, menu path, tool name/recognition, shortcut and verification state, menu fallback, what/why explanation, ordered actions (maximum five), settings, expected result, common mistakes, practice task, verification method/criteria, dimension-proof requirement, recovery steps, app differences and source chunk IDs. Empty source chunk IDs mean the step is unverified and the UI must show a warning.

### 7.4 Verification contract

Return method, `passed[]`, `failed[]`, `unknown[]`, subjective notes, `needs_new_submission`, `next_actions[]` and limitations. Failed items carry evidence location, reason, severity and fix steps.

### 7.5 QA contract

Return findings with category, severity, `objective` or `subjective` kind, location, reason and fixes; include summary and top fixes. Do not present one absolute score.

### 7.6 Reference analysis contract

Return category, estimated aspect ratio and confidence, normalized regions, palette, typography traits, hierarchy, effects, likely techniques, layer plan and an explicit estimate notice. Exact fonts/layers/settings cannot be inferred with certainty from an image.

### 7.7 Blueprint contract

Return summary, canvas properties, content checklist, palette, typography roles/alternatives, asset provenance/license notes, layer groups, technique sequence, milestones, exports and optional `layout_json` for a starter file.

## 8. Browser-side Image Analysis

Image measurement runs in the browser, not in a Python server. Expected utilities:

| Utility | Expected check |
|---|---|
| `contrast.ts` | Text/background contrast ratio |
| `blur.ts` | Blur score from downscaled grayscale image |
| `margins.ts` | Content distance from canvas edges |
| `palette.ts` | Compare extracted palette with approved palette |
| `aspect.ts` | Compare actual aspect ratio with expected ratio |
| `ocr.ts` | Read text and compare with approved copy |
| `exifStrip.ts` | Re-encode image to remove metadata |
| `cropBlur.tsx` | Allow user to crop or blur private areas |

These browser metrics are supplied by the client and are not proof by themselves. The server and AI response must preserve uncertainty and mention inconsistencies where relevant.

## 9. Editor Integration Abstraction

V1.5 introduces an adapter interface so the app is not tightly coupled to one editor.

```ts
interface EditorAdapter {
  name: "photopea" | "photoshop-uxp" | "screenshot";
  getDocumentInfo(): Promise<{
    width: number;
    height: number;
    layers?: string[];
    texts?: string[];
  } | null>;
  getPreview(): Promise<Blob>;
  openStarterFile(file: ArrayBuffer): Promise<void>;
  proposeAction?(action: Action): Promise<Preview>;
  applyAction?(action: Action): Promise<Result>;
}
```

`applyAction` must be preceded by approval and a checkpoint. Photopea document data can support `editor_verified`; screenshot-only integrations must use `screenshot_reviewed` or `preview_reviewed`.

## 10. Environment Variables and Secrets

### 10.1 Frontend public variables

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-or-publishable-key>
VITE_TURNSTILE_SITE_KEY=<site-key>
VITE_APP_URL=https://your-domain.com
```

### 10.2 Supabase Edge Function secrets

```bash
supabase secrets set GEMINI_API_KEY=...
supabase secrets set GEMINI_TEXT_MODEL=gemini-3.8-flash
supabase secrets set GEMINI_IMAGE_MODEL=<verified-current-image-model-id>
supabase secrets set TURNSTILE_SECRET_KEY=...
supabase secrets set ALLOWED_ORIGINS=https://your-domain.com,http://localhost:5173
```

Supabase supplies its URL and service-role key to Edge Functions. Use the service-role key only server-side.

### 10.3 GitHub Actions secrets

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

### 10.4 Secret hygiene

- Commit `.env.example` only; ignore `.env*` files.
- Separate development and production Gemini keys and Supabase projects.
- Enable GitHub secret scanning and push protection.
- Rotate a leaked Gemini key immediately.
- Confirm `GEMINI_API_KEY` does not appear in the compiled `dist/` folder or Git history.

## 11. Security Requirements

| Area | Requirement |
|---|---|
| Authentication | Supabase email + Google; email confirmation; Turnstile on signup and selected high-cost actions |
| Database | RLS on every public table; ownership checked with `auth.uid()`; admin content protected by `is_admin()` |
| Storage | Private buckets; user folder path `{user_id}/{project_id}/{filename}`; short-lived signed URLs |
| Edge Functions | JWT verification; allow-listed CORS; Zod validation; request size limits; timeout handling |
| Credits/abuse | Atomic spend RPC; per-user rate limits; WAF; global daily spend alarm |
| Uploads | Allow-list PNG/JPG/WebP/PDF; size cap; EXIF removal; reject unsafe file types |
| Prompt injection | Treat text inside images as data, not instructions; delimit user text from system instructions |
| Prompts | Server-side only; do not execute model output as code |
| Privacy | Consent before screenshot-to-AI; disclose what is sent; retention job; data export/delete |
| Headers | CSP, `X-Content-Type-Options`, `Referrer-Policy`, restricted frame sources |
| Auditing | Record approvals, deletions, exports and admin actions in `audit_events` |

## 12. Localization and Accessibility

- Translation files: `en.json`, `ur-roman.json`, `ur.json`.
- `ur` sets document direction to RTL; other languages default to LTR.
- Use logical CSS utilities such as `ms-`, `me-`, `ps-` and `pe-` instead of hardcoded left/right.
- Load Noto Nastaliq Urdu only when Urdu is active, with a fallback font stack.
- AI language follows profile preference but can be changed for an individual message.
- Controls must support keyboard navigation, visible focus and clear text labels; do not rely on colour alone.

## 13. Deployment and Environments

### 13.1 Environments

Maintain separate Supabase development and production projects. Cloudflare preview deployments should use the development backend; production deployment uses the production backend.

### 13.2 Cloudflare frontend deployment

- Connect GitHub repository through Workers & Pages.
- Framework: Vite.
- Build: `npm run build`.
- Output: `dist`.
- Configure only public `VITE_*` variables.
- Configure SPA fallback using the appropriate Pages `_redirects` or Workers static-assets setting.
- Attach custom domain and HTTPS.
- Configure Turnstile site key in frontend and secret in Supabase.

**Verification item:** Confirm whether Pages or Workers with static assets is the preferred current deployment option and apply the current SPA routing method.

### 13.3 GitHub Actions

CI should run on pull request and push:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test --if-present`
5. `npm run build`

A separate deployment workflow runs on changes under `supabase/**` on `main`, links the Supabase project, pushes migrations and deploys functions.

### 13.4 Release flow

`feature/*` → Pull Request → CI + Cloudflare preview + Supabase dev tests → merge to `main` → production deploy.

Never edit the production database manually. Make and review a migration, test it on dev, then deploy.

## 14. Operations and Observability

- Monitor `model_runs` for model usage, token counts, latency, estimated cost and errors.
- Monitor signups, project completion, credit use and storage growth.
- Add daily spend and error-rate alerts.
- Use Supabase backups and test restoration; verify plan limits.
- Add frontend error monitoring with PII scrubbing.
- Set an approved hard monthly Gemini budget and restricted API key.
- Track image-job failures, Realtime reconnects and provider timeouts.

## 15. Verification Items Before Production

The source guide explicitly marks the following as changeable or requiring current-provider verification:

- Gemini model identifiers, request/response fields, thinking levels and limits.
- Current Gemini pricing and image-generation model pricing.
- Gemini free/paid tier privacy and data-use terms.
- Supabase Edge Function background execution and maximum duration.
- Supabase backup, scheduling, storage and function limits.
- Cloudflare Pages vs Workers static-assets deployment choice and SPA fallback.
- Photopea commercial embedding terms, ads and API behavior.
- `ag-psd` PSD export quality/limits.
- Embedding model identifier and vector dimension.
- Payment gateway availability and terms for the owner’s region.

Do not promote any of these items from “verify” to “confirmed” without checking the official documentation and recording the review date.

---

## 16. Technical Definition of Done

A technical milestone is complete only when:

- TypeScript and lint checks pass.
- Relevant unit and integration tests pass.
- Database migrations are reviewed and work in the dev project.
- RLS and storage ownership checks pass using two separate accounts.
- Edge Functions reject invalid JWTs, unauthorized project IDs and invalid request bodies.
- Gemini keys and system prompts are not present in frontend artifacts.
- AI responses are schema-validated before persistence.
- Errors do not silently double-charge the user.
- The relevant desktop/mobile and language states are tested.
- Deployment and rollback notes are recorded.
