// ALL Reach Out walkthrough content lives here.
// Steps 1-4 are PLACEHOLDERS. Questions will come from the team's research
// and, later, from the team's AI model via getAvatarLine() below.

export type AnswerType =
  | { kind: "chips"; options: string[]; multiple?: boolean }
  | { kind: "text"; placeholder: string; maxLength: number }
  | { kind: "slider"; min: number; max: number; step: number; minLabel: string; maxLabel: string };

export type Step = {
  id: number;
  /** What Buddy says (placeholder until the model is connected). */
  avatarLine: string;
  /** The question shown in the interaction area. Step 5 has none. */
  question?: string;
  answer?: AnswerType;
  placeholder: boolean;
};

export type Answers = Record<number, string | string[] | number | undefined>;

export const intro = {
  avatarLine:
    "Hi, I'm Buddy. I'm here to help you take one small step towards talking to someone you trust. We'll go slowly, and you can stop any time.",
  honesty:
    "This isn't a replacement for professional help. Buddy is an AI, not a person, and won't diagnose or give advice.",
};

export const steps: Step[] = [
  {
    id: 1,
    avatarLine: "[Buddy line for step 1, TBD from research] Let's start with something easy.",
    question: "[Step 1 question - TBD from research]",
    answer: { kind: "chips", options: ["[Option A]", "[Option B]", "[Option C]", "[Option D]"] },
    placeholder: true,
  },
  {
    id: 2,
    avatarLine: "[Buddy line for step 2, TBD from research] There's no wrong answer here.",
    question: "[Step 2 question - TBD from research]",
    answer: { kind: "text", placeholder: "[Short answer placeholder]", maxLength: 200 },
    placeholder: true,
  },
  {
    id: 3,
    avatarLine: "[Buddy line for step 3, TBD from research] Just go with your gut.",
    question: "[Step 3 question - TBD from research]",
    answer: { kind: "slider", min: 0, max: 10, step: 1, minLabel: "[Low label]", maxLabel: "[High label]" },
    placeholder: true,
  },
  {
    id: 4,
    avatarLine: "[Buddy line for step 4, TBD from research] Nearly there. You're doing really well.",
    question: "[Step 4 question - TBD from research]",
    answer: { kind: "chips", options: ["[Option A]", "[Option B]", "[Option C]"], multiple: true },
    placeholder: true,
  },
  {
    id: 5,
    avatarLine: "You've already done the hardest part: thinking about it. You can do this.",
    placeholder: true,
  },
];

export const TOTAL_STEPS = steps.length;

/**
 * MODEL HOOK. Every line Buddy says goes through this one function.
 *
 * Today it returns the placeholder line from `steps`. Later, the team can
 * replace the body with a call to their model API, using `answers` as context.
 *
 * ┌──────────────────────────────── SAFETY RULE ────────────────────────────────┐
 * │ Buddy must NEVER diagnose, assess risk, label feelings as a condition,      │
 * │ counsel, or give clinical or medical advice. Buddy only encourages the      │
 * │ young person to reach out to a trusted person, and signposts real services  │
 * │ (see src/data/helplines.ts). If a model reply breaks this rule, or the      │
 * │ call fails, fall back to the placeholder line below. Never show raw model   │
 * │ output without a safety check. Answers must stay in memory only.            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
export async function getAvatarLine(step: number, answers: Answers): Promise<string> {
  void answers; // used once the model is connected
  if (step === 0) return intro.avatarLine;
  return steps.find((s) => s.id === step)?.avatarLine ?? intro.avatarLine;
}
