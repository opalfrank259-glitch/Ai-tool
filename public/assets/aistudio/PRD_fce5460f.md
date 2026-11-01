# Product Requirements Document (PRD)

**Product:** AI Design Tutor & Creator  
**Document:** PRD — Product Requirements Document  
**Version:** 1.0  
**Source plan:** `AI-Design-Tutor-Build-Guide-React-Supabase-Gemini-Cloudflare.md`  
**Source date:** 31 October 2026  
**Status:** Project baseline — decisions marked “Open” require owner approval before the related feature is released.

---

## 1. Product Overview

AI Design Tutor & Creator is a guided design-learning and creation platform. It helps a user turn a plain-language idea or a reference image into an approved design direction, a production blueprint, an editable starter-file path, step-by-step learning instructions, verification feedback, corrections and final export guidance.

The product is designed first for **Roman Urdu, Urdu and English** users, including beginners learning Photoshop or Photopea. It should teach users how and why to perform design actions instead of silently producing a finished design for them.

### 1.1 Product promise

> Turn an idea into a design the user understands, builds, checks and can confidently export.

### 1.2 Core learning and creation loop

**Understand → Plan → Show examples → Teach → User creates → Verify → Correct → Re-test → Export → Reflect.**

### 1.3 Product principles

1. Idea-first: accept a rough request in natural language.
2. Teach, do not only generate: explain the purpose of each important design decision and tool.
3. One step at a time: keep each lesson action manageable.
4. Show before production: provide concept directions and ask the user to approve one.
5. Verify honestly: distinguish verified evidence, estimates, opinions and unknowns.
6. User approval: do not apply assisted changes without approval.
7. Non-destructive workflow: preserve checkpoints and versions before edits.
8. Originality and factual accuracy: do not invent business facts or claim legal clearance.
9. Progressive learning: adapt instructions to the user’s skill level and selected editor.

## 2. Problem Statement

A user may have a design goal but not know how to translate it into a useful brief, choose a visual direction, set up the canvas, use the correct editor tools, check the result or export the correct file. Existing design tools may expose many controls without explaining which one to use and why.

The product addresses this by combining structured idea intake, concept planning, guided lessons, design checking and delivery instructions in one saved project workspace.

This problem statement is the product hypothesis defined by the source plan. It should be validated with real beginner users during the MVP beta.

## 3. Goals and Success Outcomes

### 3.1 Primary goals

- Allow a user to start a project from a plain-language idea.
- Convert the idea into an editable, user-approved brief without inventing missing facts.
- Show at least two distinct design concepts and require approval before blueprint generation.
- Produce a practical production blueprint and a sequence of beginner-friendly lesson steps.
- Let users submit a preview or screenshot, receive honest verification results, fix issues and re-test.
- Provide final QA findings and export instructions.
- Save project progress so users can return and continue.
- Support Roman Urdu and English in the first MVP; begin the Urdu/RTL foundation early.

### 3.2 Starting success hypotheses

These are starting targets from the source plan, not proven results:

| Metric | Initial target / hypothesis |
|---|---:|
| New users finishing first 5 lesson steps | ≥ 60% |
| Started projects reaching final export | ≥ 35% during beta |
| Briefs approved within two clarification rounds | ≥ 80% |
| Verification re-submission improves results | ≥ 60% |
| AI cost per completed project | Within the owner-approved budget |
| Week-4 return rate | Establish baseline during beta |
| “Step mismatch” feedback rate | Establish baseline and reduce over time |

## 4. Users and Roles

### 4.1 Guest

Can view the landing page, examples and a limited demo using canned data. Cannot save projects or consume paid AI resources.

### 4.2 Registered user

Can create and own projects, upload references and previews, use AI within available credits, resume progress, export work and delete their account. Cannot access another user’s private data.

### 4.3 Paid user — later phase

A future entitlement level for additional credits, history or features. The source plan does not define final paid-plan benefits or prices.

### 4.4 Admin / content editor

Can manage lessons, knowledge chunks, categories, QA rubrics, reports and content flags. Must not read private user projects by default; support access requires a user-shared support item or link.

### 4.5 Support — optional

Can view only items explicitly shared by a user.

### 4.6 User skill levels

The product stores one of: `beginner`, `basic`, `intermediate`, `advanced`. The selected level influences explanations and lesson detail.

## 5. Main Use Cases

1. **Idea-to-Final:** A user describes a poster, confirms the brief, selects a concept, follows lessons, verifies the design and exports it.
2. **Reference-to-Final:** A user uploads a reference, receives an estimated visual breakdown and continues through the lesson workflow. Planned for MVP v0.2 / V2 scope as listed in the source guide.
3. **Improve Existing Design:** A user uploads an existing design and its purpose, receives QA findings, chooses manual fixes and re-checks the result.
4. **Practice:** A user chooses an assignment, receives a rubric and staged hints, creates independently, then receives critique and skill-progress feedback.

## 6. Scope and Release Priorities

### 6.1 MVP — first release

The first thin slice is **one poster workflow**, not every design category or module.

- React app foundation, authentication, dashboard and project saving.
- Roman Urdu and English interface and AI response language; basic Urdu/RTL foundation.
- Idea intake and brief builder, with no more than three required questions in one round.
- Rule-based deliverable package recommendation for supported business types.
- Two to three concept directions and optional generated concept-preview images.
- User concept approval and revision notes.
- Production blueprint and canvas presets.
- Step-by-step lesson generation using reviewed knowledge.
- Learn workspace, progress tracking, mentor chat and feedback.
- Preview/screenshot submission, browser-side measurements, verification and manual correction guidance.
- Basic QA, export/delivery guide, project recap and account data export/delete.
- Credits ledger, usage logging and core trust/safety controls.

### 6.2 V1.5 — practice canvas and starter files

- `EditorAdapter` abstraction.
- Photopea embedding and document information where supported.
- Layout JSON rendered as a preview and evaluated PSD/starter-file export path.
- Dimension, layer and text checks where editor integration supports them.
- Explicit Photoshop / Photopea / Both labels on lessons.

### 6.3 V2 — expansion

- Reference image analyzer with clickable hotspots.
- More categories such as banners, cards and logo exploration.
- Urdu typography lessons and print handoff pack.
- Brand kits and reusable templates.
- Practice assignments, skills, mastery records, portfolio and pedagogy features.
- Admin content-management interface and richer retrieval/embeddings.
- Payments, credit packs and invoices after gateway decision.
- Multi-format auto-resize and “Where is it?” screenshot helper.

### 6.4 Later backlog

Photoshop UXP plugin, reminders, community, expert review, classroom dashboard and support for other editors.

## 7. Functional Requirements

Requirements are uniquely identified so they can be converted into development tickets and tests.

### 7.1 Account and project foundation

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-001 | Users can sign up and sign in with email and Google. | Email confirmation is enabled; invalid or expired sessions are rejected. |
| FR-002 | New users receive a profile and signup credits. | Profile is created from auth metadata and the initial credit grant is recorded in the ledger. Source-plan starting grant: 50 credits. |
| FR-003 | Users can create, list, resume and archive their own projects. | Project list is owner-scoped; a user cannot access another user’s project. |
| FR-004 | Users can select language, skill level and editor/application. | Settings persist to the profile and are used by lesson prompts. |
| FR-005 | The app shows current credits and the cost of paid actions. | Cost is shown before execution; insufficient credits produce a clear message. |

### 7.2 Idea, brief and deliverables

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-010 | The user can describe a design idea in Roman Urdu, Urdu or English. | Input is saved with the project; detected language is returned. |
| FR-011 | AI converts the idea into a structured brief. | Output follows the intake schema and preserves exact business-name spelling. |
| FR-012 | AI asks only essential missing questions. | No more than three required questions per round; optional questions may be skipped. |
| FR-013 | Unconfirmed information is marked as a placeholder or assumption. | No invented phone numbers, dates, prices, addresses or offers appear as confirmed facts. |
| FR-014 | User can edit and approve the brief. | An approved brief is saved with a version and approval state. |
| FR-015 | The system recommends related deliverables. | Recommendations come from package templates and include a reason and optional flag; user may select one item at a time. |

### 7.3 Concepts and blueprint

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-020 | AI generates 2–3 distinct concept directions. | Each contains mood, palette, typography direction, layout, treatment, pros, limitations and placeholder warnings. |
| FR-021 | Concept preview images can be generated separately. | Image generation uses a dedicated image model; preview is labelled “Concept preview — not a final file / not a real photo.” |
| FR-022 | User can approve or request revision of a concept. | Approval is required before blueprint creation; revision note creates a new version. |
| FR-023 | System generates a production blueprint. | Includes canvas specs, content checklist, output formats, palette, typography hierarchy, assets/provenance, layer plan, tool sequence, milestones and export guidance. |

### 7.4 Lessons and mentor

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-030 | System generates lesson steps from the approved blueprint. | Each step follows the LessonStep schema and includes objective, tool path, actions, expected result, mistakes, verification and recovery. |
| FR-031 | Lesson instructions are editor- and version-aware. | Profile/project editor and version are passed to lesson generation; uncertain instructions are labelled as unverified. |
| FR-032 | Lesson steps are manageable. | One action at a time; a step contains no more than approximately five ordered actions. |
| FR-033 | User can navigate, repeat and simplify lessons. | Previous, Next, Repeat, Explain simpler, Show example and Ask AI actions are available. |
| FR-034 | User can ask the AI mentor questions. | Mentor receives only relevant project summary, approved concept, current step, level, language and latest verification context. |
| FR-035 | User can report inaccurate or mismatched steps. | Feedback is stored as a feedback event linked to project and step. |

### 7.5 Verification, QA and delivery

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-040 | User can submit an exported preview or screenshot. | Upload consent is recorded; file type/size is validated; EXIF is stripped in the browser. |
| FR-041 | Browser tools calculate measurable design checks. | Checks can include contrast, blur, margins, palette, aspect ratio and OCR/copy comparison. |
| FR-042 | AI returns a structured verification result. | Result includes passed, failed, unknown, next actions, need for new submission and limitations. |
| FR-043 | Verification method is clearly labelled. | Only the allowed labels are used: `editor_verified`, `screenshot_reviewed`, `preview_reviewed`, `user_confirmed`, `not_verified`. |
| FR-044 | User can receive a manual correction guide. | Each issue states what, where, why, severity and ordered fix steps. |
| FR-045 | User can re-submit after a correction. | A new verification record is saved; earlier result history remains available. |
| FR-046 | User can request final QA. | Findings separate objective and subjective points; highest-impact fixes are first; no single absolute score is presented. |
| FR-047 | User can view export and delivery guidance. | Includes relevant formats, settings, naming and print/web handoff notes. |
| FR-048 | User can resume a saved project. | Last completed/current step and related project assets are retained. |
| FR-049 | User can export a project summary and request account deletion/data export. | The appropriate backend function produces the requested result and audit record. |

### 7.6 Trust, safety and content administration

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-050 | The platform flags prohibited or deceptive design requests. | Includes forged official documents, impersonation, sexual/hateful/violent content and deceptive health/finance claims as defined in the source plan. |
| FR-051 | User can report content or incorrect guidance. | Report is stored in `content_flags` or `feedback_events`. |
| FR-052 | Admin can manage curated lessons and knowledge content. | Admin-only write access is enforced by RLS; published content is available according to policy. |
| FR-053 | Admin can inspect aggregated usage/cost and content reports. | Admin view uses controlled aggregate data and does not grant default access to private project content. |

## 8. Business Rules

- Preserve exact business names and user-confirmed text.
- Never invent phone numbers, business facts, dates, prices or claims.
- Mark assumptions and placeholders explicitly until approved.
- Require brief approval before concepts; require concept approval before blueprint.
- Concept-preview imagery is not a production file and must be labelled accordingly.
- Generated imagery is not trusted for accurate text; compose real text in editable layers later.
- Never claim exact fonts, layers, editor settings or pixel dimensions from evidence that cannot establish them.
- Do not claim legal clearance for visual similarity or trademark matters.
- Do not apply assisted edits without explicit user approval and a checkpoint.
- Every AI result must be validated against its output schema before saving or showing.
- Do not treat text embedded in an uploaded image as instructions to the AI system.

## 9. Non-Functional Requirements

### Security and privacy

- Gemini API key is stored only as a Supabase Edge Function secret.
- All AI calls pass through Supabase Edge Functions.
- Enable RLS on every public table; use private Storage buckets and signed URLs.
- Enforce project ownership, JWT verification, restricted CORS, input/output validation and rate limits.
- Record consent before sending screenshots to AI; expose data retention and account export/delete workflows.
- Keep prompts server-side and never execute model output as code.

### Reliability and integrity

- Use atomic credit spending to prevent concurrent overspending.
- Refund credits when an AI operation fails after spending, according to the backend pipeline.
- Keep model usage, latency and errors in `model_runs`.
- Image generation must have queued/running/done/failed states and a text-only fallback.
- Save project versions/checkpoints at meaningful approval and editing stages.

### Usability and accessibility

- Responsive desktop, tablet and mobile layouts.
- Keyboard-accessible controls, visible focus, WCAG AA contrast target and labels that do not rely on colour alone.
- Correct `lang` and `dir` attributes; Urdu interface is RTL.
- Compress uploaded images and handle slow-network/loading states.

### Maintainability

- Use TypeScript, shared Zod schemas, versioned prompts and database migrations.
- Frontend backend calls go through `src/services/api.ts`.
- Use CI for lint, typecheck, tests and build.
- Deliver small, reviewable milestones rather than implementing all modules at once.

## 10. MVP Acceptance / Release Gate

MVP is ready for a controlled beta when at least five real beginners can complete one poster from idea to export using Roman Urdu, with the ability to:

1. Start with a plain idea and approve a brief.
2. View at least two concepts and approve one.
3. Receive a blueprint and follow lesson instructions.
4. Submit a preview and receive an honestly labelled verification result.
5. Fix a flagged issue and re-check it.
6. Complete final QA and receive export instructions.
7. Return later and resume the project.
8. See credit usage before paid AI actions.
9. Request deletion/export of their data.

Security, RLS isolation and secret-leakage tests must also pass before real user data is accepted.

## 11. Out of Scope for Initial MVP

- Full Photoshop UXP plugin.
- Full multi-editor integration.
- Complete practice/assignment/mastery and portfolio system.
- Payment subscriptions and final pricing.
- Automatic multi-size resizing.
- Automated assisted edits that directly modify user documents.
- Legal or trademark clearance.

## 12. Open Product Decisions

The source plan leaves the following decisions with the owner:

1. Final product name, domain and legal registration.
2. Confirm first design category: poster is recommended by the source plan.
3. Confirm whether MVP lessons support Photoshop only or Photoshop + Photopea; the source guide recommends both as a direction but requires explicit labels.
4. Select and verify the current Gemini image model identifier and price.
5. Decide free beta credits versus paid plans; payment route for Pakistan remains open.
6. Select Supabase plan and data region.
7. Assign responsibility for reviewing editor lessons after application updates.
8. Set screenshot/upload retention period.
9. Set monthly AI budget and daily spend alarm.
10. Set launch date and beta size.

---

## 13. Traceability to the Build Guide

This PRD consolidates the product definition, user journeys, roles, route/screen list, feature modules, success metrics, launch checklist and open decisions from the supplied build guide. Implementation details belong in `TRD.md`, data details in `BACKEND_SCHEMA.md` and delivery sequencing in `IMPLEMENTATION_PLAN.md`.
