// ILLUSTRATIVE EXAMPLES FOR THE PROTOTYPE.
// Always label these as examples. They are NOT approved community contributions, and they are
// never used as sources for the PULSE guides. Genuine contributions need secure submission
// and human review, which do not exist yet (see `genuineStories` below).
// These stories were written for the hackathon demo. They are not real people.
// Every story follows the same arc: talked to a guide, the guide encouraged them to speak to a
// specific person, they did, and here's what changed. First person, two or three sentences.
// Safe-story rules: focus on the act of reaching out and what helped.
// No details of distress, no methods, weights or quantities. Hope and recovery only.

export type StoryTag = "friend" | "family" | "school" | "gp";

export type Story = {
  id: string;
  displayName: string;
  age: number;
  avatarSeed: string;
  reachedOutTo: string;
  opening: string;
  body: string[];
  whatHelped: string;
  tags: StoryTag[];
  illustrative: true;
};

export const storyTagLabels: Record<StoryTag, string> = {
  friend: "Talked to a friend",
  family: "Talked to family",
  school: "Talked to a teacher",
  gp: "Saw a GP",
};

export const stories: Story[] = [
  {
    id: "sami",
    displayName: "Sami",
    age: 16,
    avatarSeed: "sami-dusk",
    reachedOutTo: "My best friend",
    opening: "I told my guide I'd felt rubbish for weeks.",
    body: [
      "I told my guide I'd felt rubbish for weeks.",
      "My guide asked who already knew me well, and encouraged me to message my best friend, Jay.",
      "We went for a walk after school, and now I'm not carrying it all on my own.",
    ],
    whatHelped: "Saying it badly was fine. I didn't need the perfect words.",
    tags: ["friend"],
    illustrative: true,
  },
  {
    id: "priya",
    displayName: "Priya",
    age: 15,
    avatarSeed: "priya-sage",
    reachedOutTo: "My form tutor",
    opening: "I asked my guide how to tell someone about school.",
    body: [
      "I asked my guide how to tell someone about school.",
      "My guide suggested my form tutor, Ms Okafor, and helped me work out how to start.",
      "I stayed behind after registration, and now she checks in with me every Friday.",
    ],
    whatHelped: "She asked me what I wanted, instead of deciding for me.",
    tags: ["school"],
    illustrative: true,
  },
  {
    id: "kofi",
    displayName: "Kofi",
    age: 17,
    avatarSeed: "kofi-sky",
    reachedOutTo: "My older sister",
    opening: "I didn't know how to say I needed help.",
    body: [
      "I didn't know how to say I needed help.",
      "My guide asked who I felt most at ease with, and encouraged me to start with my sister, Ama.",
      "I told her while we were washing up, and a couple of weeks later she came with me to the GP.",
    ],
    whatHelped: "Having someone come with me for the next step.",
    tags: ["family"],
    illustrative: true,
  },
  {
    id: "maddie",
    displayName: "Maddie",
    age: 14,
    avatarSeed: "maddie-lavender",
    reachedOutTo: "My auntie",
    opening: "I started with a guide, not ready to tell anyone yet.",
    body: [
      "I started with a guide, not ready to tell anyone yet.",
      "We worked out that my auntie was the adult I felt most OK with, and my guide encouraged me to tell her.",
      "I told her a week later, and now I've got someone to go to when things feel heavy.",
    ],
    whatHelped: "Practising what I wanted to say somewhere safe first.",
    tags: ["family"],
    illustrative: true,
  },
  {
    id: "rhys",
    displayName: "Rhys",
    age: 18,
    avatarSeed: "rhys-apricot",
    reachedOutTo: "My GP",
    opening: "I told my guide I could handle it all on my own.",
    body: [
      "I told my guide I could handle it all on my own.",
      "My guide encouraged me to see my GP anyway, and to write a few notes on my phone first.",
      "I read my notes out at the appointment, and I walked out with a plan and a local service to try.",
    ],
    whatHelped: "Writing notes on my phone so I didn't have to remember.",
    tags: ["gp"],
    illustrative: true,
  },
  {
    id: "amara",
    displayName: "Amara",
    age: 16,
    avatarSeed: "amara-bloom",
    reachedOutTo: "My dad",
    opening: "I asked my guide how to open up at home.",
    body: [
      "I asked my guide how to open up at home.",
      "My guide suggested trying my dad, at a moment that felt easy rather than a big sit-down talk.",
      "I told him in the car after netball, and now “car chat?” is our thing whenever I need to talk.",
    ],
    whatHelped: "Picking a moment that felt easy, not a big sit-down talk.",
    tags: ["family"],
    illustrative: true,
  },
  {
    id: "tomas",
    displayName: "Tomás",
    age: 15,
    avatarSeed: "theo-cloud",
    reachedOutTo: "Our school counsellor",
    opening: "I told my guide I didn't want a big fuss at school.",
    body: [
      "I told my guide I didn't want a big fuss at school.",
      "My guide encouraged me to speak to our school counsellor, starting in the smallest way I could.",
      "I left a note in the box outside her room, she found me the next day, and now I know who to go to.",
    ],
    whatHelped: "A small, low-pressure first step, like a note in a box.",
    tags: ["school"],
    illustrative: true,
  },
  {
    id: "leila",
    displayName: "Leila",
    age: 17,
    avatarSeed: "leila-moon",
    reachedOutTo: "My mum",
    opening: "My closest friend had moved away, so I tried a guide.",
    body: [
      "My closest friend had moved away, so I tried a guide.",
      "My guide encouraged me to tell someone nearby, and we landed on my mum.",
      "I told her that weekend, and things at home have felt easier since.",
    ],
    whatHelped: "Having someone close by who knows.",
    tags: ["family"],
    illustrative: true,
  },
  {
    id: "jordan",
    displayName: "Jordan",
    age: 19,
    avatarSeed: "jordan-tide",
    reachedOutTo: "My flatmate",
    opening: "Typing felt easier than talking, so I tried a guide.",
    body: [
      "Typing felt easier than talking, so I tried a guide.",
      "My guide asked who was around me day to day, and encouraged me to talk to my flatmate.",
      "I told them that week, and we went along to my uni's wellbeing team together.",
    ],
    whatHelped: "Starting with the way of talking that felt easiest for me.",
    tags: ["friend"],
    illustrative: true,
  },
];

/** Genuine, human-reviewed contributions published with consent. None exist yet. */
export const genuineStories: Story[] = [];

/** Shown wherever a story is read. From PULSE's reflection boundary. */
export const storyBoundary =
  "One person’s experience, not professional guidance or a promise of what will happen for someone else. Stories are not sources for PULSE’s guides.";

export function getStory(id: string) {
  return stories.find((s) => s.id === id);
}
