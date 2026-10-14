// SERVER ONLY. Imported by the route handlers in src/app/api. Never import this from a client component.
//
// The pipeline for one chat question:
//   1. validateRequest   – shape, lengths, known guide/service.
//   2. safetyNotice      – a small keyword check that shows human help. Ours, not PULSE's original.
//   3. eligibleSources   – published records for this service + guide (drafts are excluded here).
//   4. provider.generate – the connected model. NONE IS CONNECTED in this repository.
//   5. checkOutput       – rejects or repairs anything the model was not allowed to say.
//
// The original PULSE backend, its personality prompts and its safety handling were not supplied
// with the exported HTML. See INTEGRATION.md for what a provider needs to do.

import { getGuide, isGuideId, type Guide } from "@/data/pulse/guides";
import { isServiceId } from "@/data/pulse/services";
import { eligibleSources, type SourceRecord } from "@/data/pulse/sources";
import { LIMITS, type AnswerRequest, type AnswerResponse, type AnswerStatus, type HistoryTurn } from "./contract";

/** What a provider returns. Sources are referenced by id only; the server attaches the records. */
export type ModelOutput = {
  text: string;
  status?: AnswerStatus;
  entry_ids: string[];
  essential?: { title: string; text: string };
  steps?: string[];
  draft?: string;
  notice?: string;
  switchTo?: string;
  suggestions?: string[];
};

export type ProviderContext = {
  request: AnswerRequest;
  guide: Guide;
  /** The ONLY records the model may use or cite. */
  eligible: SourceRecord[];
};

export interface AnswerProvider {
  name: string;
  generate(ctx: ProviderContext): Promise<ModelOutput>;
}

/**
 * Returns the connected provider, or null. Nothing is connected yet.
 * To connect one, implement AnswerProvider in its own server file, read its key from
 * process.env (never NEXT_PUBLIC_*), and return it here when the key is present.
 */
export function getProvider(): AnswerProvider | null {
  return null;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export function validateRequest(body: unknown): AnswerRequest | string {
  if (!body || typeof body !== "object") return "Send a JSON body.";
  const b = body as Record<string, unknown>;
  if (!isGuideId(b.guide)) return "Unknown guide.";
  if (!isServiceId(b.service)) return "Unknown service.";
  const question = str(b.question, LIMITS.question + 1).trim();
  if (!question) return "Ask a question first.";
  if (question.length > LIMITS.question) return `Keep questions under ${LIMITS.question} characters.`;
  const history: HistoryTurn[] = Array.isArray(b.history)
    ? b.history.slice(-LIMITS.history).map((t) => {
        const turn = (t ?? {}) as Record<string, unknown>;
        return {
          question: str(turn.question, LIMITS.question),
          answer: str(turn.answer, LIMITS.historyAnswer),
          entry_ids: Array.isArray(turn.entry_ids) ? turn.entry_ids.filter((x): x is string => typeof x === "string").slice(0, 20) : [],
        };
      })
    : [];
  return {
    guide: b.guide,
    service: b.service,
    question,
    mode: "live",
    history,
    draft: str(b.draft, LIMITS.draft),
  };
}

// Deliberately narrow. Keyword checks are limited and are not a safety assessment;
// a connected provider must still apply its own safety handling.
const URGENT = /\b(kill myself|suicid\w*|end my life|want to die|hurt myself|self[- ]?harm|overdose|not safe right now|in danger)\b/i;

export function safetyNotice(question: string): AnswerResponse | null {
  if (!URGENT.test(question)) return null;
  return {
    mode: "system",
    status: "urgent",
    text: "It sounds like you might need support right now. PULSE can’t help in an emergency and nobody is monitoring this chat. Please contact a person who can help: call 999 if you are in immediate danger, NHS 111 for urgent mental health support, Samaritans on 116 123, or Childline on 0800 1111 if you are under 19.",
    sources: [],
    entry_ids: [],
    notice: "This is an automatic safety notice, not an AI reply. It is triggered by a short list of words and is not an assessment.",
  };
}

const STATUSES: AnswerStatus[] = ["answered", "unknown", "clarify", "urgent"];

/**
 * Enforces the knowledge boundary on model output:
 * - cited ids must be in the eligible set (others are dropped, and a notice is added)
 * - source records come from the register, never from the model
 * - switchTo must be a real guide; lists and strings are capped
 */
export function checkOutput(out: ModelOutput, eligible: SourceRecord[]): AnswerResponse {
  const text = str(out?.text, 6000).trim();
  if (!text) throw new Error("empty");
  const allowed = new Map(eligible.map((s) => [s.entry_id, s]));
  const ids = Array.isArray(out.entry_ids) ? [...new Set(out.entry_ids.filter((id) => typeof id === "string"))] : [];
  const kept = ids.filter((id) => allowed.has(id));
  const dropped = ids.length - kept.length;
  const list = (v: unknown, n: number, max: number) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()).slice(0, n).map((x) => x.slice(0, max)) : undefined;
  const notice = [str(out.notice, 600), dropped ? "Some references were removed because they are not in this service’s published sources." : ""]
    .filter(Boolean)
    .join(" ");
  return {
    mode: "live",
    status: STATUSES.includes(out.status as AnswerStatus) ? (out.status as AnswerStatus) : "answered",
    text,
    essential:
      out.essential && typeof out.essential.title === "string" && typeof out.essential.text === "string"
        ? { title: out.essential.title.slice(0, 120), text: out.essential.text.slice(0, 1200) }
        : undefined,
    steps: list(out.steps, 8, 300),
    draft: out.draft ? str(out.draft, LIMITS.draft) : undefined,
    sources: kept.map((id) => allowed.get(id)!),
    entry_ids: kept,
    notice: notice || undefined,
    switchTo: getGuide(out.switchTo)?.id,
    suggestions: list(out.suggestions, 4, 160),
  };
}

export { eligibleSources };
