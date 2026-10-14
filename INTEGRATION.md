# Connecting an AI model

## What exists, and what doesn't

The PULSE material supplied was a **standalone HTML export** (`liveConfigured: false, local: false,
reason: "standalone"`). It called `POST /api/answer` but did **not** include that backend, its model configuration,
its full server-side personality prompts or its safety handling. None of those exist in this repository, and nothing
here should be described as the original PULSE prompts.

What this repository *does* provide:

- `GET /api/status` → `{ liveConfigured, reason, provider? }`. The chat reads this on load.
- `POST /api/answer` with the original request shape, returning `503 not_configured` until a provider exists.
- `src/lib/pulse/contract.ts`: typed request/response, shared by browser and server.
- `src/lib/pulse/server.ts`: the pipeline below, with an empty provider slot (`getProvider()` returns `null`).

## The pipeline (`src/lib/pulse/server.ts`)

1. **`validateRequest`**: known guide and service, question ≤ 800 chars, draft ≤ 1200, history ≤ 8 turns.
2. **`safetyNotice`**: a short keyword list that returns a labelled *system* notice (not an AI reply) pointing to
   human help. This is new, deliberately narrow, and **not** a safety assessment. A real provider must add its own.
3. **`eligibleSources(service, guide)`**: published records for that service (or `"all"`). Drafts are excluded.
4. **`provider.generate({ request, guide, eligible })`**: returns `ModelOutput` (sources by `entry_id` only).
5. **`checkOutput`**: drops any cited id outside the eligible set (and says so in the answer's notice), rebuilds
   source records from the register, validates `switchTo`, caps every field.

## Request (from the browser)

```json
{ "guide": "noor", "question": "…", "service": "childline", "mode": "live",
  "history": [{ "question": "…", "answer": "…", "entry_ids": ["cl-privacy"] }],
  "draft": "Before I make a request, could you explain…" }
```

## Response fields the UI renders

`mode` (`live` | `system`), `status` (`answered` | `unknown` | `clarify` | `urgent`), `text`, `essential {title,text}`,
`steps[]`, `draft`, `sources[]`, `entry_ids[]`, `notice`, `switchTo`, `suggestions[]`.
`status: "urgent"` opens the human-help panel automatically. A returned `draft` replaces the visitor's first question.
Errors: `{ error, code }` with `400 bad_request`, `503 not_configured`, `502 provider_error | invalid_output`.

## To connect a provider

1. Create `src/lib/pulse/providers/<name>.ts` implementing `AnswerProvider`.
2. Read the API key from a **server-only** env var (never `NEXT_PUBLIC_*`). Add it in Vercel → Settings → Environment Variables.
3. Return it from `getProvider()` when the key is set. `/api/status` will then report `liveConfigured: true`
   and the Send button activates.
4. Write the seven personality prompts. They are **new** prompts, not reconstructions of the originals: same knowledge
   and abilities for every guide, tone only. Each must:
   - answer only from the `eligible` records and cite them by `entry_id`;
   - return `status: "unknown"` when the records don't cover the question (a missing answer stays missing);
   - never diagnose, counsel, assess symptoms or give treatment advice;
   - never invent policies, response times, confidentiality promises or endorsements;
   - treat the school record as fictional and "your school" as unknown.
5. Ask the model for JSON matching `ModelOutput`, parse defensively, and let `checkOutput` do the rest.
6. Update the privacy copy in `src/data/pulse/product.ts` (`privacy.model`) to name the provider and its retention terms.
7. Test all seven guides against all three services before launch, including refusals and the urgent path.
