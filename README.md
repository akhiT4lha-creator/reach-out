# Reach Out

Hackathon prototype for **London AI Campus x GSK: AI for Youth Wellbeing**.
A calm, warm site where young people read hopeful stories of others who reached out,
then take their own first step with **Buddy**, a friendly AI guide.

> Not a replacement for professional help. Buddy is an AI and never diagnoses, assesses risk or gives advice.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Deploy: push to GitHub and import the repo in Vercel. No settings or environment variables are needed.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero with drifting story bubbles, team insight, story wall with filters, share-your-story |
| `/stories/[id]` | Full story, "What helped me", then signposting |
| `/reach-out` | 5-step walkthrough with Buddy (intro + 4 placeholder steps + encouragement finale) |
| `/share` | Share your story, one question at a time |
| `/admin` | Demo moderation list: approve or reject submissions |

## Placeholders to fill in

- **Team insight + target user:** `src/app/(site)/page.tsx` (search for `TEAM INSIGHT`).
- **Walkthrough questions and Buddy's lines:** `src/data/walkthrough.ts`. Each step picks its answer type:
  `chips` (tappable options, optionally `multiple`), `text` (short answer) or `slider`.
- **Stories:** `src/data/stories.ts`. These are illustrative examples, written for the prototype.

## Connecting the team's AI model

Everything Buddy says goes through **one function**: `getAvatarLine(step, answers)` in `src/data/walkthrough.ts`.
It is already `async`, so you can replace its body with a call to your model API and the UI will keep working.

**Safety rule (read before connecting):** Buddy must never diagnose, assess risk, label feelings as a condition,
counsel, or give clinical advice. It only encourages reaching out to a trusted person and signposts real services
(`src/data/helplines.ts`). Check every model reply and fall back to the placeholder line if it breaks the rule or the call fails.
Walkthrough answers must stay in memory only; they are never stored.

## Safety and privacy built in

- **"Need help now?"** is on every screen: top bar on desktop, floating bottom-right on phones. It opens instantly
  (no animation) with tap-to-call/text links for 999, NHS 111, Childline, Shout and Samaritans.
- **No accounts, tracking or analytics.** Walkthrough answers live only in page memory.
- **Shared stories never go live automatically.** In this demo they are saved in the browser's localStorage as
  `pending` and only appear on `/admin`. Email is required so moderators can verify a story; it is only shown on `/admin`.
  The 6-digit check is simulated (code `123456`, nothing is sent). A real service needs a secure backend and a login for `/admin`.
- **Calm mode** (top bar) and the device's **reduced motion** setting both stop all floating, drifting and looping motion.

## Built with

Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI), Framer Motion, DiceBear avatars, Phosphor icons.
Fonts: Fredoka (headings) and Atkinson Hyperlegible (body). See `CREDITS.md` for borrowed components.
