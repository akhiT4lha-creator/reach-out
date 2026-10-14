// The guided start at /start. Buddy hosts it with SCRIPTED lines: Buddy is a navigation mascot,
// not an AI and not one of the seven guides. Each choice opens a working feature directly.

export type Stage = "options" | "unsure" | "guides" | "process" | "draft" | "stories";

export const buddyLines: Record<Stage, string> = {
  options: "Hi, I’m Buddy. Choose whichever feels useful. You can go back, skip this, or just look around.",
  unsure: "That’s fine. Start small. You don’t need to describe your situation.",
  guides: "All seven guides share the same knowledge. Pick the conversational style you’d like.",
  process: "Here’s one step at a time, and where each step comes from.",
  draft: "Edit it until it sounds like you. Nothing is sent for you.",
  stories: "These are example stories written for this prototype. Real contributions aren’t open yet.",
};

export const honesty =
  "Buddy is PULSE’s mascot. These are scripted navigation prompts, not an AI conversation. PULSE is not a counsellor and won’t diagnose or give advice.";

export const startChoices: { stage: Stage; title: string; detail: string }[] = [
  { stage: "process", title: "Understand what happens first", detail: "See one supported step at a time." },
  { stage: "draft", title: "Help me prepare a question", detail: "Open an editable question. Nothing is sent." },
  { stage: "guides", title: "Choose an AI guide", detail: "Pick a conversational style, then try a question." },
  { stage: "stories", title: "Read someone’s story", detail: "Example stories, clearly labelled." },
  { stage: "unsure", title: "I’m not sure where to start", detail: "Choose between a process preview and a starter question." },
];
