# App Flow — User and Admin Experience

**Product:** AI Design Tutor & Creator  
**Document:** App Flow  
**Version:** 1.0  
**Source plan date:** 31 October 2026

---

## 1. Experience Model

The application is organized around saved design projects. A user can enter through an idea, a reference image, an existing design or a practice assignment. The initial MVP prioritizes the **Idea-to-Final poster workflow**.

The main experience is progressive: users approve the brief, approve a concept, follow the production blueprint and lessons, submit evidence, correct issues and receive delivery guidance. The app must not skip approval gates or represent uncertain checks as verified facts.

## 2. Roles and Access

| Role | Entry experience | Access boundaries |
|---|---|---|
| Guest | Landing page, examples, limited canned demo | Cannot save a project or use paid AI calls |
| Registered user | Dashboard, own projects, credits and settings | Own records/files only; cannot view another user’s data |
| Paid user (later) | Registered user experience plus later entitlements | Exact limits/features are not defined yet |
| Admin/content editor | Admin console for curated content and operations | No default access to private user project content |
| Support (optional) | User-shared support items | Only explicitly shared content |

## 3. Route Map

| Route | Screen | Entry / purpose |
|---|---|---|
| `/` | Landing | Explain product, sample flow, supported outputs, plans and CTA |
| `/login` | Login | Email or Google sign-in |
| `/signup` | Signup | Account creation, confirmation and Turnstile |
| `/app` | Dashboard | Recent projects, new-project entry, credits and progress |
| `/app/new` | New project chooser | Choose Idea / Reference / Improve / Practice |
| `/app/p/:id/brief` | Brief builder | Clarify, edit and approve project brief |
| `/app/p/:id/concepts` | Concept gallery | Compare, revise and approve concepts |
| `/app/p/:id/analysis` | Reference analysis | Reference image and clickable hotspots (V2) |
| `/app/p/:id/blueprint` | Production blueprint | Canvas, content, assets, layers and roadmap |
| `/app/p/:id/learn/:stepId` | Learning workspace | Lesson checklist, instruction, canvas/example and mentor |
| `/app/connect` | Editor connection | Choose Photoshop / Photopea; later plugin connection |
| `/app/p/:id/review` | Review workspace | QA findings, rubric and correction flow |
| `/app/p/:id/delivery` | Delivery | Exports, source files, recap and handoff notes |
| `/app/portfolio` | Portfolio | Finished work and skills (V2) |
| `/app/settings` | Settings | Language, skill level, app/version, privacy and data actions |
| `/admin` | Admin | Lessons, knowledge, usage, reports and flags |

## 4. First-Time User Flow

```text
Landing page
   ↓
Sign up / Login
   ↓
Email confirmation / Google authentication
   ↓
Basic preferences
(language, skill level, Photoshop/Photopea, app version)
   ↓
Dashboard
   ↓
New Project
```

### 4.1 Authentication behavior

1. Guest opens landing page and can view examples or a limited demo.
2. Guest selects Sign up or Login.
3. User authenticates with email or Google.
4. Email confirmation is required for email-based signup.
5. Cloudflare Turnstile is applied to signup and selected high-cost actions according to the security policy.
6. Auth trigger creates a profile and a credit ledger signup grant (source-plan starting amount: 50 credits).
7. User chooses or confirms language, skill level and editor details.
8. User lands on the dashboard.

## 5. Dashboard Flow

Dashboard should make three actions immediately clear:

- Start a new project.
- Resume a recent project.
- Check current credits and progress.

Project cards should show title, category, current status, last updated time and a resume action. A user with no projects sees an empty state encouraging the first project.

```text
Dashboard
  ├── New Project → Project Mode Chooser
  ├── Recent Project → Resume at saved stage/current step
  ├── Credits → View balance / credit explanation
  └── Settings → Language / skill / editor / privacy
```

## 6. New Project Mode Chooser

The user chooses one mode:

| Mode | User intent | First action |
|---|---|---|
| Idea | “I have an idea for a design.” | Enter a plain-language idea |
| Reference | “I want to understand and learn from this reference.” | Upload a reference image (V2 / MVP v0.2) |
| Improve | “I already have a design and want feedback.” | Upload design and describe its purpose |
| Practice | “I want to learn by doing a challenge.” | Pick a category/assignment (V2) |

For MVP, Idea is the fully supported mode. Other modes may be disabled, labelled as coming later or implemented only where the release scope explicitly allows them.

## 7. Journey A — Idea-to-Final (Core MVP)

### 7.1 Flow overview

```text
New Project → Enter Idea → AI Intake
                              ↓
                  Ask essential missing facts
                              ↓
                     Editable Brief Card
                              ↓
                       User Approves
                              ↓
                 Deliverable Recommendations
                              ↓
                Generate 2–3 Concept Directions
                              ↓
                Optional Concept Preview Images
                              ↓
                  User Revises or Approves
                              ↓
                   Production Blueprint
                              ↓
                    Lesson Plan Generation
                              ↓
                     Learning Workspace
                              ↓
                 Build Step → Submit Preview
                              ↓
                       Verification
                    ↙       ↓        ↘
                 Passed   Failed    Unknown
                   ↓       ↓          ↓
                  Next   Fix Guide   Explain limits / ask evidence
                           ↓
                       Re-submit
                           ↓
                       Re-verify
                              ↓
                         Final QA
                              ↓
                    Export / Delivery Guide
                              ↓
                 Project Recap + Save Checkpoint
                              ↓
                        Dashboard
```

### 7.2 Step-by-step behavior

| Step | User action | System behavior | Saved record / endpoint |
|---|---|---|---|
| 1. Start | Enter idea in Roman Urdu, Urdu or English | Create a project and save original idea | `projects` |
| 2. Intake | Submit idea | Interpret request, detect category/language, identify missing facts and optional preferences | `ai-intake` |
| 3. Clarify | Answer essential questions or skip optional ones | Ask no more than three required questions per round; do not invent information | `project_briefs` draft |
| 4. Brief | Review/edit brief | Display facts, assumptions and placeholders distinctly | `project_briefs` |
| 5. Approve | Confirm brief | Store approved state/version; unlock concepts | `project_briefs.approved` |
| 6. Package | Review suggested deliverables | Recommend optional business-specific deliverables with reasons | `deliverables` |
| 7. Concepts | Generate directions | Generate 2–3 options with palettes, layout, mood and warnings | `ai-concepts`, `concepts` |
| 8. Preview | Optionally request concept image | Start async image job and show Realtime progress | `ai-image`, `generation_jobs` |
| 9. Select | Approve or request a revision | Save approval or create a new concept version with revision note | `concepts` |
| 10. Blueprint | Continue after approval | Generate canvas, content, asset, layer and export plan | `ai-blueprint`, `blueprints` |
| 11. Lesson plan | Start learning | Generate ordered lesson steps using blueprint and reviewed knowledge | `ai-lesson`, `project_steps` |
| 12. Learn | Perform current step | Show one manageable action, expected result, common mistake and recovery | `project_steps` |
| 13. Ask mentor | Ask question / explain simpler | Send small, relevant project context; stream response | `ai-mentor` |
| 14. Submit | Upload preview or screenshot | Record consent, process metadata and store file privately | `submissions` |
| 15. Verify | Request check | Combine browser metrics with vision review; return passed/failed/unknown and limitations | `ai-verify`, `verification_results` |
| 16. Correct | Follow manual fix instructions | Explain what, where, why and how to fix; do not apply edits automatically in MVP | `ai-correction`, `correction_proposals` |
| 17. Re-test | Submit corrected preview | Run verification again and retain history | `submissions`, `verification_results` |
| 18. Final QA | Request review | Compare against rubric; show objective vs subjective findings | `ai-qa`, `qa_reviews` |
| 19. Delivery | View export guide | Show export formats/settings, file naming and handoff notes | `exports` |
| 20. Finish | Save and exit | Save recap/checkpoint and resume location | `project_versions`, `projects` |

### 7.3 Approval gates

- No concept generation before a brief is approved.
- No blueprint before a concept is approved.
- No assisted edit in later phases before explicit approval and checkpoint.
- A user can revise the brief or concept; downstream outputs may need regeneration when approved source facts change.

## 8. Journey B — Reference-to-Final (MVP v0.2 / V2)

```text
New Project → Reference Mode → Upload Image
   ↓
AI Reference Analysis
   ↓
Image + Region Hotspots + Estimate Notice
   ↓
User selects hotspot / asks about element
   ↓
Layer plan + estimated techniques
   ↓
Lesson plan
   ↓
Same Learn → Submit → Verify → Correct → QA → Delivery flow as Journey A
```

The analyzer may estimate category, layout regions, palette, typography traits, hierarchy, effects, techniques and canvas ratio. It must state that exact font names, layers and settings cannot be known from the reference image alone. Similarity reminders are not legal clearance.

## 9. Journey C — Improve Existing Design

```text
New Project → Improve Mode → Upload Design + Purpose
   ↓
AI QA / Rubric Review
   ↓
Findings grouped: Critical / Important / Polish
   ↓
User chooses issue(s) to address
   ↓
Manual fix instructions (MVP)
   ↓
User applies fix in editor
   ↓
Submit new preview → Re-check
   ↓
Before/after comparison → Delivery
```

Assisted edits via Photopea scripting are not part of MVP; if introduced in V2, require user approval and a checkpoint.

## 10. Journey D — Practice

```text
Practice Mode → Choose Category / Assignment
   ↓
Show rubric and learning objective
   ↓
User creates independently
   ↓
Hint ladder: Nudge → Partial → Targeted → Full Step → Worked Example
   ↓
Submit work → Critique
   ↓
Record skills/mastery → Portfolio / Next exercise
```

This journey is V2 scope and should not delay the MVP poster flow.

## 11. Learning Workspace Interaction Flow

### Desktop layout

- **Left panel:** step checklist and completion status.
- **Center panel:** target example, embedded canvas or uploaded screenshot.
- **Right panel:** current instruction card and AI mentor.
- **Bottom controls:** progress, Verify, Need help, Previous and Next.

### Mobile layout

Panels become tabs:

- Instruction
- Canvas
- Chat

A compact mobile/second-screen view may show the current step, checklist and upload action.

### Step controls

- Previous / Next.
- Repeat instruction.
- Explain simpler.
- Show example.
- Ask AI.
- Verify current step.
- Need help.
- “This step didn’t match my screen” feedback.

The workspace shows only the current action by default; additional details can expand progressively.

## 12. Verification Result Flow

Every verification result uses one of five methods:

- `editor_verified`
- `screenshot_reviewed`
- `preview_reviewed`
- `user_confirmed`
- `not_verified`

The UI groups results into:

1. **Passed:** what passed and the evidence.
2. **Needs fixing:** where, why, severity and manual fix.
3. **Unknown:** what could not be established and what evidence is required.
4. **Next actions:** the next recommended user step.
5. **Limitations:** what the submitted evidence cannot prove.

A screenshot alone cannot prove exact document pixel dimensions; request an Image Size or New Document dialog screenshot where dimensions must be confirmed.

## 13. Delivery Flow

The delivery page contains:

- Final approved preview / export references.
- Format guidance (PNG, JPG, PDF, SVG, PSD where applicable).
- Settings for web, social or print.
- Naming guidance.
- Editable versus flattened file explanation.
- Print-shop handoff notes such as CMYK/RGB, bleed, flatten/outline where relevant.
- Project recap, completed lesson steps and export checklist.
- Project summary download and return-to-dashboard action.

## 14. Admin Flow

```text
Admin Login
   ↓
Role check (`is_admin()` / RLS)
   ↓
Admin Dashboard
   ├── Lessons & lesson steps
   ├── Knowledge chunks and editor/version metadata
   ├── QA rubrics
   ├── Categories / package templates / canvas presets
   ├── Usage and AI cost aggregates
   ├── Feedback and wrong-instruction reports
   └── Content flags / moderation queue
```

Admin can edit/publish curated content and inspect operational reports. Private projects remain inaccessible by default. A user-shared support item is the permitted support path described by the product plan.

## 15. Project Status Model

The source plan defines these project statuses:

`draft → brief_approved → concept_approved → blueprint_ready → learning → review → delivered → archived`

Not every status must be visited by every mode. The backend must validate allowed transitions and prevent a user from skipping required approval gates.

### Step status model

`todo → in_progress → submitted → verified → done`

Optional state: `skipped`.

### Image job status model

`queued → running → done` or `failed`.

## 16. Empty, Loading and Error States

| Situation | UX response |
|---|---|
| No projects | Empty dashboard with a clear “Start with an Idea” action |
| No brief facts yet | Ask only required questions; display optional preferences separately |
| AI concept generation running | Skeleton cards and clear progress state |
| Image generation fails | Keep text concepts and moodboard palette; allow user to continue |
| Insufficient credits | Show required cost and current balance; offer no hidden retry |
| Rate limited | Explain that the action is temporarily unavailable and preserve work |
| AI output invalid | Friendly retry message; apply credit refund rule |
| Upload too large/unsupported | Explain allowed formats and size limit; preserve project state |
| Verification cannot determine a property | Put it under Unknown and explain the evidence needed |
| Realtime disconnect | Show reconnecting state and allow status refresh |
| Editor embed unavailable | Provide screenshot/preview upload fallback |

## 17. Privacy and Destructive Actions

- Before screenshot submission to AI, record consent and explain what data is sent.
- Allow crop/blur before upload.
- Use private storage and signed URLs.
- Provide account export and deletion routes.
- Deletion should cover user data and associated storage; record appropriate audit events.
- Support access is restricted to explicitly shared content.

## 18. MVP Flow Test Scenario

A tester enters: “Mere hotel ka logo aur opening poster banana hai.” The expected flow:

1. System identifies the request as hotel branding/promotional work.
2. It asks only for missing required details such as the exact hotel name, opening date and contact/offer where relevant.
3. It preserves unconfirmed information as placeholders and does not invent phone numbers.
4. User approves the brief.
5. User reviews suggested deliverables and selects the poster for the first MVP path.
6. System presents at least two concept directions and clearly labels generated previews.
7. User approves one concept.
8. System produces blueprint and lessons.
9. User follows instructions, uploads a preview, receives an honest result and fixes any issue.
10. User completes QA and follows export instructions.
11. Project is saved and can be resumed from the dashboard.

---

## 19. Flow Dependencies

- Authentication and profile must exist before saving user projects.
- Project ownership and credits must be checked before AI requests.
- Brief approval unlocks concept generation.
- Concept approval unlocks blueprint generation.
- Blueprint and reviewed knowledge are inputs to lesson generation.
- Submission and consent precede verification.
- QA and delivery depend on the latest relevant project evidence.
- Every major approval or delivery stage should create a checkpoint/version as specified in the implementation plan.
