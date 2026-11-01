# UI/UX Design Brief

**Product:** AI Design Tutor & Creator  
**Document:** UI/UX Design Brief  
**Version:** 1.0  
**Source plan date:** 31 October 2026

---

## 1. Design Intent

Design a calm, clear and confidence-building workspace for people learning to create real designs. The interface should feel like a guided workshop rather than a complicated professional design application or a generic chatbot.

The product must help users understand three things at every stage:

1. **What am I doing now?**
2. **Why am I doing it?**
3. **What should I do next?**

The UI should support both quick progress and learning. It must never hide uncertainty or imply that a concept preview is a finished, editable design file.

## 2. Primary UX Principles

- Idea-first: one obvious entry point for a rough idea.
- Low cognitive load: show one manageable instruction at a time.
- Teach with context: explain what a tool does and why it is used here.
- Show before production: compare visual directions and obtain user approval.
- Progressive disclosure: keep the main instruction visible; expand detailed settings or theory when requested.
- Honest evidence: distinguish measured checks, AI opinions, estimates and unknowns.
- User control: visible approval and revision actions; no silent edits.
- Reversible progress: show version history and checkpoints.
- Language-aware: concise Roman Urdu/English labels and proper Urdu RTL behavior.
- Accessible: keyboard support, focus states, readable text and non-colour-only status indicators.

## 3. Audience and Context

### Primary user context

Users may be beginners or learners with varying experience levels, working in Photoshop or Photopea. They may describe a design in Roman Urdu, Urdu or English and may be unfamiliar with professional design vocabulary.

### Supported skill levels

- Beginner
- Basic
- Intermediate
- Advanced

The system should use these settings to tune explanation depth, not to hide essential warnings or verification limitations.

## 4. Information Architecture

Top-level product areas:

- Landing
- Authentication
- Dashboard
- New Project
- Project Brief
- Concepts
- Reference Analysis (V2)
- Blueprint
- Learning Workspace
- Editor Connection
- Review / QA
- Delivery
- Portfolio (V2)
- Settings
- Admin

The dashboard is the user's home. Each project owns its own brief, concepts, blueprint, lessons, submissions, verification history, QA findings and delivery record.

## 5. Navigation and Global UI

### Global application header

Include:

- Product mark/name (final branding is an owner decision).
- Navigation or compact breadcrumbs showing current project and stage.
- Language switcher.
- Current credits chip.
- User profile/settings menu.

### Credits behavior

- Show current credit balance in the header.
- Display the credit cost beside every paid AI action.
- Confirm high-cost actions such as image generation.
- Do not hide the credit cost until after the user clicks.

### Project navigation

Use a stage/progress indicator where appropriate:

Brief → Concepts → Blueprint → Learn → Review → Delivery.

Do not show later stages as available when their required approval gate has not been completed.

## 6. Core Screen Briefs

### 6.1 Landing page (`/`)

**Purpose:** Explain what the product does and move users into a first project.

**Required content:**

- Clear headline around idea-to-design learning.
- Short explanation of the flow.
- Example project or sample sequence.
- Supported outputs and editor/language context.
- Plans/credits information only when those details are decided.
- Primary CTA to start a project / sign up.

A guest can view a limited canned demo without consuming AI credits or saving projects.

### 6.2 Login / Signup (`/login`, `/signup`)

**Purpose:** Simple, trusted account access.

**Elements:**

- Email and password inputs.
- Google sign-in.
- Email confirmation feedback.
- Turnstile challenge where enabled.
- Clear validation and recoverable error messages.

### 6.3 Dashboard (`/app`)

**Purpose:** Help a returning user continue immediately.

**Primary elements:**

- “Start with an Idea” / “New Project” primary action.
- Recent project cards.
- Current stage/status and last-updated information.
- Credits chip and progress summary.
- Empty state for new accounts.

Project cards should not expose data from other users and should provide an obvious resume action.

### 6.4 New project chooser (`/app/new`)

Present four modes as understandable choices:

- Start with an idea.
- Learn from a reference image.
- Improve an existing design.
- Practice a design skill.

The MVP should clearly distinguish fully available functionality from later-phase functionality. Do not make unavailable options look active.

### 6.5 Brief builder (`/app/p/:id/brief`)

**Purpose:** Convert rough language into a reliable design brief.

**Layout and behavior:**

- Chat-like idea input at the beginning.
- Short clarification questions.
- Editable brief card.
- Separate sections for confirmed facts, assumptions and placeholders.
- Approve button and edit action.
- Optional preferences remain skippable.

**Critical UX rules:**

- Ask no more than three required questions per round.
- Preserve exact business name spelling.
- Never display an AI-invented phone number, opening date, price or offer as confirmed.

### 6.6 Concept gallery (`/app/p/:id/concepts`)

**Purpose:** Let users compare directions before production.

**Each concept card should show:**

- Concept title and one-line idea.
- Mood and audience fit.
- Palette with hex values.
- Typography direction (not unverified exact-font claims).
- Layout and symbol/image treatment.
- Pros and limitations.
- Placeholder warnings.
- Preview image, where available.
- Approve and revise-with-note actions.

Use side-by-side comparison on wide screens and a stacked/swipeable layout on smaller screens. Every generated image must carry the label:

> Concept preview — not a final file / not a real photo.

The UI must make concept approval a clear gate before the blueprint stage.

### 6.7 Blueprint (`/app/p/:id/blueprint`)

**Purpose:** Present the approved production plan in a usable format.

Use clear sections or tabs for:

- Brief and approved concept summary.
- Canvas dimensions, aspect ratio, DPI and output intent.
- Content checklist.
- Palette and typography hierarchy.
- Assets and source/license notes.
- Layer/group plan.
- Tool/technique sequence.
- Milestone checks.
- Export formats and file naming.

Show estimated or unconfirmed values distinctly from confirmed values.

### 6.8 Learning workspace (`/app/p/:id/learn/:stepId`)

This is the most important application screen.

#### Desktop layout

| Area | Content |
|---|---|
| Left | Lesson checklist, ordered steps, completion states |
| Center | Target example, current canvas/editor or screenshot |
| Right | Current instruction card and mentor chat |
| Bottom | Progress, Previous, Verify, Need help, Next |

#### Instruction card content

- Step title.
- Objective (“what you will achieve”).
- Tool name and how to recognize it.
- Menu/panel path and shortcut, with menu fallback.
- What the tool does.
- Why it is being used in this design.
- Ordered actions (up to about five).
- Settings and expected result.
- Common mistakes.
- Practice mini-task.
- Verification criteria and recovery instruction.

#### Interaction controls

- Previous.
- Next.
- Repeat.
- Explain simpler.
- Show example.
- Ask AI.
- Verify.
- Need help.
- “This step didn’t match my screen” feedback.

Show the current manageable action by default. Keep theory, alternate paths and additional detail expandable.

#### Mobile behavior

Convert the three panels into tabs:

- Instruction
- Canvas
- Chat

Keep step progress and the current action easy to access. A mobile second-screen view may emphasize the current step, checklist and upload button.

### 6.9 Review workspace (`/app/p/:id/review`)

**Purpose:** Show the submitted design beside prioritized findings.

Use:

- Preview image.
- QA rubric categories.
- Findings grouped as Critical / Important / Polish.
- Objective versus subjective distinction.
- Where/why/fix information.
- Before/after or prior-submission history.
- Re-check action.

Do not use one absolute “design score” as the only result. The source plan calls for category-level findings and separation of objective from subjective assessment.

### 6.10 Delivery (`/app/p/:id/delivery`)

**Purpose:** Help users produce and hand off the correct files.

Include:

- Export format guide (PNG/JPG/PDF/SVG/PSD as applicable).
- Web, social and print export settings.
- File naming guidance.
- Editable vs flattened explanation.
- Print shop handoff notes.
- Completed checklist and learning recap.
- Project summary download.

### 6.11 Settings (`/app/settings`)

Include:

- Language: English / Roman Urdu / Urdu.
- Skill level.
- Editor: Photoshop / Photopea / Other.
- Editor version.
- Privacy and consent information.
- Export data and delete account actions.

### 6.12 Admin (`/admin`)

Provide admin-only areas for:

- Lesson and lesson-step management.
- Knowledge chunks and app/version review metadata.
- QA rubrics.
- Categories, package templates and canvas presets.
- Usage/cost aggregates.
- Feedback, incorrect instruction reports and content flags.

Do not make private user projects browsable by default.

## 7. Design System Guidance

The supplied source plan does **not** decide the final brand palette, logo, font system or component theme. Those remain open brand decisions. Until a brand identity is approved:

- Use a restrained neutral interface foundation.
- Reserve stronger accent styling for primary actions and meaningful status.
- Maintain readable contrast for instructional text and tool labels.
- Avoid relying on colour alone for pass/fail/unknown states.
- Use consistent spacing, border, surface and typography tokens across screens.
- Keep generated concept palettes separate from the application UI theme.

### 7.1 Components to standardize

- App shell/header and breadcrumbs.
- Credit chip and cost confirmation.
- Project card and stage indicator.
- Language selector.
- Idea input and clarification question.
- Confirmed fact / assumption / placeholder indicators.
- Brief card and approval footer.
- Concept card and palette swatch.
- Blueprint section/card.
- Lesson checklist item.
- Instruction card and expandable details.
- Mentor chat panel.
- Upload/drop zone and image preview.
- Verification status and finding cards.
- QA severity label.
- Export checklist.
- Empty, loading, error and retry states.

## 8. Verification and Status Language

Always pair status colour with icon and text. Use exactly the supported verification labels:

| Stored method | User-facing interpretation |
|---|---|
| `editor_verified` | Editor data was inspected (state which editor, e.g. Photopea) |
| `screenshot_reviewed` | A screenshot was reviewed; it may not prove document properties |
| `preview_reviewed` | An exported preview was reviewed |
| `user_confirmed` | The user confirmed the item; system did not independently verify it |
| `not_verified` | Evidence is insufficient for verification |

For every review, show Passed, Failed, Unknown, Next actions and Limitations. AI opinions on hierarchy, balance or mood fit must be identified as subjective notes.

## 9. Content and Microcopy Guidelines

- Use simple sentences and familiar language.
- Keep software tool names in English even when the explanation is Roman Urdu or Urdu.
- Avoid long paragraphs in lesson steps.
- Explain one action at a time.
- Use supportive, non-judgmental language for errors.
- Explicitly distinguish “preview”, “starter file” and “final editable file”.
- State when a value is estimated or a lesson source is not verified.
- Never imply the AI can see the user's live editor unless an actual adapter provides that data.

Example error copy can be localized by the app:

| Technical state | Roman Urdu direction |
|---|---|
| Insufficient credits | “Aap ke credits kafi nahi hain.” |
| Rate limit | “Abhi requests zyada hain. Thori dair baad dobara try karein.” |
| Invalid AI output | “AI ka jawab theek format mein nahi aaya. Dobara try karein; failed request ke credits wapas kiye jayenge.” |
| Upload rejected | Explain accepted file types and size limit |
| Unknown verification | “Is cheez ko is screenshot se confirm nahi kiya ja sakta.” |

## 10. Localization and RTL

- Translation resources: `en.json`, `ur-roman.json`, `ur.json`.
- Set `lang` and `dir` on the document.
- Urdu uses RTL; English and Roman Urdu use LTR.
- Prefer logical spacing/alignment utilities, not left/right-specific styling.
- Load Noto Nastaliq Urdu only when Urdu is active, with a fallback stack.
- Test mixed English tool names, numbers, hex codes and keyboard shortcuts inside Urdu text.
- Check line-height and diacritic clipping for Urdu fonts.

## 11. Responsive, Accessibility and Performance Requirements

- Test desktop, tablet and phone layouts.
- Keyboard navigation for menus, tabs, dialogs, concept approvals and lesson controls.
- Visible focus indicators.
- WCAG AA contrast target from the source plan.
- Status must not be conveyed by colour alone.
- Correct semantic labels and accessible names.
- Handle 3G/slow network behavior with skeletons and preserved drafts.
- Compress images before upload (source plan suggests a maximum long edge around 1600 px and WebP/JPEG where suitable).
- Lazy-load expensive browser tools such as `opencv.js` WASM.
- Handle Photopea/editor embed failure with a screenshot/preview fallback.

## 12. Important Trust and Safety UX

- Obtain consent before sending screenshot or preview content to AI.
- Show what will be sent and allow crop/blur of private areas.
- Keep uploaded content private and show images using short-lived signed URLs.
- Do not expose private screenshots to admin by default.
- Provide a report action for incorrect or unsafe guidance.
- Warn on reference similarity without stating legal clearance.
- Display AI-generated content notices where appropriate.

## 13. UX Acceptance Checklist

- A new user can find the first project action without assistance.
- Brief questions are limited, relevant and skippable when optional.
- Confirmed facts, assumptions and placeholders are visually distinct.
- User cannot accidentally skip brief/concept approval gates.
- Concept previews are clearly labelled and never appear as final files.
- Lesson workspace shows one current action and a clear next action.
- User can ask for simpler wording and ask the mentor a question.
- Verification shows method, evidence, failures, unknowns and limitations.
- Mobile panels switch cleanly to Instruction / Canvas / Chat tabs.
- English, Roman Urdu and Urdu layouts render correctly, including RTL.
- Keyboard navigation and contrast checks pass.
- Loading, offline/slow network, empty, failure and retry states are designed.
