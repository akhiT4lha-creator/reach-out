// The four PULSE guides, imported from PULSE-Website.html (`Oe` and `Ie` in the export).
// They are conversational styles on ONE shared backend, not specialists for different conditions.
// Every guide has the same knowledge and abilities, and the same job: pointing young people towards
// the right real person in their life. Buddy is the navigation mascot, never a guide.

export type GuideId = "ari" | "noor" | "theo" | "maya";

export type Guide = {
  id: GuideId;
  name: string;
  /** Short style label, e.g. "Warm & easy-going". */
  role: string;
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
  "Who could I talk to first?",
  "How do I bring it up with them?",
  "Help me find the words to ask.",
];

/** Added to every guide's starter list in the chat welcome. */
export const extraStarter = "What can I ask before sharing personal details?";

export const guides: Guide[] = [
  {
    id: "ari",
    name: "Ari",
    role: "Warm & easy-going",
    voice: "Warm, easy-going and unhurried",
    intro:
      "Hi, I’m Ari. We can start wherever you like and keep things simple, then work out who might be good to talk to. What’s on your mind?",
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
    voice: "Calm, candid and straightforward",
    intro: "Hi, I’m Noor. I’ll be clear about what I can help with, and who’s better placed to help with the rest. What would you like to talk through?",
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
    voice: "Patient, thoughtful and steady",
    intro: "Hi, I’m Theo. We can slow things down and take one thing at a time, including who you might want to speak to. Where would you like to begin?",
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
    voice: "Friendly, expressive and collaborative",
    intro:
      "Hi, I’m Maya. You don’t need to have the perfect words. We can work out who you’d feel OK talking to, and how you might start.",
    starters,
    sampleOpening: "Not sure how to word it? We can work on that together.",
    color: "#E4D6B5",
    ink: "#8D7538",
    avatarSeed: "pulse-maya",
    glasses: false,
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
  { guide: "maya", label: "Friendly and chatty" },
];
