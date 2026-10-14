# PULSE → Reach Out migration checklist

Source: `PULSE-Website.html` (standalone export, embedded React bundle and data).
Status key: **Done** = rebuilt and working · **Needs backend** = UI and contract ready, no model connected ·
**Unavailable** = not built, stated honestly in the UI.

| PULSE capability / content | Now lives in | Status |
| --- | --- | --- |
| Identity: "PULSE · FIRST LOOK", "Understand first. Decide later.", "A first look. Before your first step.", "independent student prototype" | `src/data/pulse/product.ts`, hero, nav logo, footer, metadata | Done |
| Seven guides: ids, names, roles, voices, intros, starters, sample openings (`Oe`, `Ie`) | `src/data/pulse/guides.ts` | Done |
| Guide portraits | `GuideAvatar.tsx`: redrawn in Reach Out's DiceBear style on each guide's original colour (glasses kept for Theo, Ellis, Quinn) | Done (restyled) |
| Guide gallery, conversational-preference chips, "Start with [name]" | `GuideGallery.tsx` (home `#guides`) | Done |
| Shared source access for all seven (final behaviour of the export) | `ALL_GUIDES` in `sources.ts` | Done |
| Guided start: five choices, "not sure" branch, guide picker, Back / Skip / urgent help | `/start` (`Walkthrough.tsx`, `data/walkthrough.ts`), replacing Reach Out's placeholder steps | Done |
| Service contexts: Childline, fictional school, "your school" (`De`, `Me`, `Ne`) | `src/data/pulse/services.ts`, `ServiceSelect.tsx` | Done |
| Process preview: one step at a time, view all, per-step sources, Childline confidentiality note | `ProcessExplorer.tsx` (home `#first-step`, `/start`, process panel) | Done |
| External contact links with "nothing is transferred" note | Process panel, question editor | Done |
| Editable first question, copy, review with a guide; kept across guide switches; reset by Clear | `DraftEditor.tsx`, `PulseProvider.tsx` | Done |
| NHS statistic (44.6% / 55.4%, base 374, Table 3.5, ~previous year), bar, limitations, hypothesis, publication link | `evidence.ts`, `EvidenceBar.tsx`, `EvidenceSection`, evidence panel | Done |
| Source register: all 16 records incl. the unpublished draft, full metadata | `src/data/pulse/sources.ts` | Done |
| Source inspection | `SourceCard.tsx`, sources side panel (with "back to" process/evidence) | Done |
| Read-only reviewer workspace | `/review` | Done (read-only) |
| Reviewer sign-in, document extraction, durable publishing | n/a | Unavailable |
| Chat UI: guide rail, service context, starters into editable composer, own questions, clear, switch guide, return to latest | `/chat/[guide]` (`ChatApp.tsx`) | Done |
| All response fields (status labels, essential, steps, draft, sources, notice, switchTo, suggestions, urgent) | `ChatAnswer.tsx` | Done (checked with a temporary test provider, then removed) |
| Loading, error, retry, connection-unavailable states | `ChatApp.tsx` | Done |
| `/api/answer` contract and server-side eligibility / output checks | `src/lib/pulse/contract.ts`, `server.ts`, `app/api/*` | Done |
| Real generated replies, personality prompts, original safety handling | n/a (not supplied in the export) | Needs backend: see `INTEGRATION.md` |
| Urgent help: 999 / A&E, NHS 111, Samaritans, Childline, "PULSE isn't monitored", NHS link, check date | Reach Out crisis panel + `helplines.ts` | Done |
| Privacy, session behaviour, limitations, "one model, seven personalities" | "How PULSE works" panel, `product.ts` | Done (rewritten for this runtime) |
| Windows/Ollama download and local-model claims | Removed: not true here | Removed |
| PULSE stories chapter ("no approved stories yet", reader boundary, Buddy host) | Reach Out story wall/bubbles/reader + `genuineStories` (empty) + `storyBoundary` | Done |
| Sharing flow: anonymity / pseudonym / first name, private follow-up, consent, preview, submission disabled | `ShareFlow.tsx` (replaces Reach Out's localStorage + fake code flow) | Done (preview only) |
| Secure story submission, moderation, withdrawal | n/a | Unavailable |
| PULSE's old layout, global CSS, typography, editorial aesthetic | Not imported (by design) | n/a |

## Reach Out changes worth knowing

- `/reach-out` → `/start` and `/admin` → `/review` (temporary redirects in `next.config.ts`).
- Removed: `src/lib/submissions.ts` (localStorage "submissions"), the demo `/admin` moderation page, the simulated
  email code, the placeholder walkthrough steps and `StepAnswer`/`Celebration`.
- Buddy is now described as a mascot everywhere (no longer "an AI guide").
- Two example-story characters were renamed so they don't share names with guides: Theo → Tomás (`/stories/tomas`),
  Leila's friend Noor → Hana.
