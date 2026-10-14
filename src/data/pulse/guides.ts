// The seven PULSE AI guides, imported from PULSE-Website.html (`Oe` and `Ie` in the export).
// They are conversational styles on ONE shared model backend, not seven trained models and
// not specialists for different conditions. Every guide has the same knowledge and abilities.
// Buddy is the navigation mascot, never an eighth guide.

export type GuideId = "ari" | "noor" | "theo" | "maya" | "ellis" | "robin" | "quinn";

export type Guide = {
  id: GuideId;
  name: string;
  /** Short style label, e.g. "Warm & easy-going". */
  role: string;
  short: string;
  /** Voice description shown above the chat welcome. */
  voice: string;
  intro: string;
  starters: string[];
  /** Illustrative opening line shown in previews. Not a generated reply. */
  sampleOpening: string;
  /** Portrait background and accent (from the original PULSE palette). */
  color: string;
  ink: string;
  /** DiceBear seed + glasses, keeping each guide's look consistent across the site. */
  avatarSeed: string;
  glasses: boolean;
};

const starters = [
  "What happens when I first get in touch?",
  "Who can see what I share?",
  "Help me find the words to ask.",
];

/** Added to every guide's starter list in the chat welcome. */
export const extraStarter = "What can I ask before sharing personal details?";

export const guides: Guide[] = [
  {
    id: "ari",
    name: "Ari",
    role: "Warm & easy-going",
    short: "An unhurried place to start",
    voice: "Warm, easy-going and unhurried",
    intro:
      "Hi, I’m Ari. We can start wherever you like and keep things simple. What would you like to understand before reaching out?",
    starters,
    sampleOpening: "We can keep this simple. What would you like to know?",
    color: "#D7DDC7",
    ink: "#587047",
    avatarSeed: "pulse-ari",
    glasses: false,
  },
  {
    id: "noor",
    name: "Noor",
    role: "Calm & straightforward",
    short: "Clear answers, no fuss",
    voice: "Calm, candid and straightforward",
    intro: "Hi, I’m Noor. I’ll be clear about what we know and what we don’t. What would you like to talk through?",
    starters,
    sampleOpening: "What would you like explained? I’ll keep it clear.",
    color: "#E4CFC0",
    ink: "#A96E54",
    avatarSeed: "pulse-noor",
    glasses: false,
  },
  {
    id: "theo",
    name: "Theo",
    role: "Patient & thoughtful",
    short: "Room to take your time",
    voice: "Patient, thoughtful and steady",
    intro: "Hi, I’m Theo. We can slow things down and work through one thing at a time. Where would you like to begin?",
    starters,
    sampleOpening: "We can take one part at a time. Where shall we start?",
    color: "#D0DCD9",
    ink: "#5B7C77",
    avatarSeed: "pulse-theo",
    glasses: true,
  },
  {
    id: "maya",
    name: "Maya",
    role: "Friendly & expressive",
    short: "A conversational approach",
    voice: "Friendly, expressive and collaborative",
    intro:
      "Hi, I’m Maya. You don’t need to have the perfect words. We can talk through your questions and work out how you want to ask them.",
    starters,
    sampleOpening: "Not sure how to word it? We can work on that together.",
    color: "#E4D6B5",
    ink: "#8D7538",
    avatarSeed: "pulse-maya",
    glasses: false,
  },
  {
    id: "ellis",
    name: "Ellis",
    role: "Quiet & reassuring",
    short: "Space without pressure",
    voice: "Quiet, gentle and respectful of pauses",
    intro: "Hi, I’m Ellis. There’s no pressure to decide anything here. We can explore what you want to know, at your pace.",
    starters,
    sampleOpening: "There’s no rush. You can start with a small question.",
    color: "#D8CDBF",
    ink: "#857060",
    avatarSeed: "pulse-ellis",
    glasses: true,
  },
  {
    id: "robin",
    name: "Robin",
    role: "Practical & encouraging",
    short: "A little clarity to act on",
    voice: "Practical, encouraging and down-to-earth",
    intro:
      "Hi, I’m Robin. We can make the process feel less complicated and find a useful next step. What’s on your mind about getting in touch?",
    starters,
    sampleOpening: "Want to look at what the first step could involve?",
    color: "#D5D9E3",
    ink: "#637088",
    avatarSeed: "pulse-robin",
    glasses: false,
  },
  {
    id: "quinn",
    name: "Quinn",
    role: "Curious & reflective",
    short: "Make sense of things together",
    voice: "Curious, reflective and precise",
    intro: "Hi, I’m Quinn. We can explore your questions and check the information together. What would you like to make sense of?",
    starters,
    sampleOpening: "What would you like to understand before reaching out?",
    color: "#E0CFCE",
    ink: "#9B6D6A",
    avatarSeed: "pulse-quinn-reflect",
    glasses: true,
  },
];

export const guideIds = guides.map((g) => g.id);

export function getGuide(id: string | null | undefined): Guide | undefined {
  return guides.find((g) => g.id === id);
}

export function isGuideId(id: unknown): id is GuideId {
  return typeof id === "string" && guideIds.includes(id as GuideId);
}

/** Conversational preference chips on the home page. A style preference, not an assessment. */
export const stylePreferences: { guide: GuideId; label: string }[] = [
  { guide: "noor", label: "Clear and direct" },
  { guide: "theo", label: "One part at a time" },
  { guide: "ellis", label: "Quiet and gentle" },
];
