# PULSE: FIRST LOOK

**Understand first. Decide later.** A first look, before your first step.

PULSE helps young people understand what contacting a support service involves *before* deciding what to share.
Visitors can preview a service's process step by step, check where every claim comes from, prepare an editable
first question, read example stories, and (once a model is connected) talk it through with one of seven AI guides.

It is built inside the **Reach Out** prototype (London AI Campus x GSK: AI for Youth Wellbeing): Reach Out sets the
look and interactions; PULSE sets the product, its knowledge boundaries and its capabilities.

> An independent student prototype. Not a support service. The AI guides never diagnose, counsel, assess symptoms or
> give treatment advice. Buddy is the site's mascot, not an AI.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

No environment variables are needed. **No AI model is connected**, so the chat shows an honest
"AI connection unavailable" state. See [`INTEGRATION.md`](INTEGRATION.md) to connect one.

## Pages

| Route | What it is |
| --- | --- |
| `/` | In reading order: hero → About (what PULSE is, the 3-step path) → Why it matters (NHS evidence) → Step 1 the process → Step 2 your question → Step 3 the guides → stories → sharing preview |
| `/start` | Guided start hosted by Buddy. Each choice opens a working tool (process, question, guides, stories, "not sure"). `/reach-out` redirects here |
| `/chat/[guide]` | Conversation with one of seven guides (`ari`, `noor`, `theo`, `maya`, `ellis`, `robin`, `quinn`) |
| `/stories/[id]` | An example story with "what helped", the reading boundary, and next steps |
| `/share` | Sharing preview: anonymity choices, private follow-up, consent, publication preview. Submission is disabled |
| `/review` | Read-only source register (reviewer preview). `/admin` redirects here |
| `/api/status`, `/api/answer` | Model connection status and the chat endpoint (see `INTEGRATION.md`) |

Panels available everywhere: **My question** (editor), **process preview**, **evidence**, **how PULSE works**, **sources**,
and **Need help now?** (urgent human help).

## Where things live

| What | File |
| --- | --- |
| Homepage section order (also drives the nav) | `src/data/pulse/sections.ts` |
| Seven guides (names, voices, intros, starters) | `src/data/pulse/guides.ts` |
| Source register (every record, incl. the draft) | `src/data/pulse/sources.ts` |
| Service contexts and process steps | `src/data/pulse/services.ts` |
| NHS finding and its limitations | `src/data/pulse/evidence.ts` |
| Identity, privacy and limitation copy, question template | `src/data/pulse/product.ts` |
| Guided start (Buddy's scripted lines, choices) | `src/data/walkthrough.ts` |
| Example stories | `src/data/stories.ts` |
| Helplines | `src/data/helplines.ts` |
| API contract | `src/lib/pulse/contract.ts` |
| Server pipeline (validation, eligibility, output checks, provider slot) | `src/lib/pulse/server.ts` |

See [`MIGRATION.md`](MIGRATION.md) for where every feature of the original PULSE export ended up.

## Safety and privacy built in

- **Need help now?** is on every screen and opens instantly (no animation): 999, NHS 111, Childline, Shout,
  Samaritans, plus A&E and NHS urgent-help guidance. Re-check every number before launch.
- **No accounts, tracking or analytics.** Conversations and the first question live in page memory only and vanish on
  refresh. The only things stored in the browser are the Calm mode and theme choices.
- **Knowledge boundary.** Guides may only use *published* records for the chosen service. The server, not the browser,
  decides which records a model sees, and strips any citation outside that set. Draft records never reach answers.
- **Stories.** The repository's stories are illustrative examples and are always labelled that way. No genuine
  contributions exist yet. Stories are never used as AI sources. Sharing is a preview: there is no secure storage,
  moderation or withdrawal route, so nothing is sent or saved.
- **Calm mode** and the device's reduced-motion setting stop all floating and looping motion.

## Built with

Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI), Framer Motion, DiceBear avatars, Phosphor icons.
Fonts: Fredoka (headings) and Atkinson Hyperlegible (body). See `CREDITS.md`.
