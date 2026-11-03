// PULSE: FIRST LOOK identity, purpose and boundary copy.
// Privacy wording describes THIS Next.js runtime. Update it if the runtime changes
// (for example when a model provider is connected). Do not copy the old export's claims
// about local Ollama processing or a Windows download: neither exists here.

export const product = {
  name: "PULSE",
  edition: "FIRST LOOK",
  fullName: "PULSE: FIRST LOOK",
  motto: "Understand first. Decide later.",
  tagline: "A first look. Before your first step.",
  status: "An independent student prototype. Not a support service.",
  purpose:
    "Work out who to talk to and prepare what you might say, with a guide as your first step.",
};

/** The editable first-question template. */
export const DEFAULT_DRAFT =
  "Before I make a request, could you explain who would see it and what happens next?";

export const howItWorks = [
  {
    title: "Choose a personality",
    body: "Four guides share the same sources and abilities. Choose a conversational style, not a topic. They aren’t real people or clinicians.",
  },
  {
    title: "Ask a process question",
    body: "Ask in your own words, or try an opening question. When guides are connected, every chat reply comes from them, apart from labelled system and safety notices. Personality changes the tone, not the available knowledge. There is no scripted chat mode.",
  },
  {
    title: "Then talk to someone",
    body: "Your guide can suggest who to speak to, such as someone at home, a teacher, a school counsellor, your GP or a friend you trust. Check the sources, prepare your words and decide when to use them. Nothing is sent for you.",
  },
];

export const privacy = {
  memory:
    "Your conversation stays in page memory. It clears when you refresh, close the tab, switch guides or press Clear. Your first question stays while you move around the site or switch guides, so you can revise it with any personality. Clear also resets that question.",
  storage:
    "PULSE does not write conversations or your first question to a database or to browser storage. The only things this site saves in your browser are your Calm mode and theme choices.",
  model:
    "Guides aren’t connected in this version, so nothing you type is sent anywhere. If they are connected later through an outside provider, pressing Send would pass your current question, up to eight recent question-and-answer turns, your draft question and the eligible source records through this site’s server to that provider. That provider’s retention terms would then apply.",
  links: "External source and contact links open other websites. Nothing from PULSE is transferred to them.",
};

export const limitations = [
  "Guides are a first step, not the solution. Their job is to point you towards someone in your life who can help.",
  "No diagnosis, counselling, symptom assessment or treatment advice.",
  "A missing answer stays missing. Guides should say when a source does not cover something.",
  "Automated checks can miss errors. Inspect the linked source for important details.",
  "Public-source implementation checks are not independent service approval.",
];
