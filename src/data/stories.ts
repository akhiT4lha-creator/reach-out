// ILLUSTRATIVE EXAMPLES FOR THE PROTOTYPE.
// Always label these as examples. They are NOT approved community contributions, and they are
// never used as sources for the PULSE AI guides. Genuine contributions need secure submission
// and human review, which do not exist yet (see `genuineStories` below).
// These stories were written for the hackathon demo. They are not real people.
// Safe-story rules: focus on the act of reaching out and what helped.
// No details of distress, no methods, weights or quantities. Hope and recovery only.

export type StoryTag = "friend" | "family" | "school" | "helpline" | "gp";

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
  helpline: "Called a helpline",
  gp: "Saw a GP",
};

export const stories: Story[] = [
  {
    id: "sami",
    displayName: "Sami",
    age: 16,
    avatarSeed: "sami-dusk",
    reachedOutTo: "My best friend",
    opening: "I typed the message about six times before I sent it.",
    body: [
      "I typed the message about six times before I sent it. In the end it just said: “Can we talk later? Not about anything big, I just feel a bit rubbish.”",
      "Jay replied in about a minute. We went for a walk after school and I mostly talked about nothing, then about the stuff that had been sitting on me for weeks.",
      "He didn't fix anything, and he didn't need to. He just said he was glad I told him, and that he'd felt like that too sometimes. A month later we both went to our school's wellbeing drop-in together.",
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
    opening: "I stayed behind after registration and asked if she had five minutes.",
    body: [
      "I stayed behind after registration and asked Ms Okafor if she had five minutes. My hands were shaking a bit, which felt silly.",
      "I told her I'd been finding it hard to focus and that I didn't really feel like myself. She listened properly and then asked what I wanted to happen next, which I didn't expect.",
      "She helped me book a chat with the school counsellor and checked in with me every Friday. It's a small thing, but knowing someone at school knew made the days feel lighter.",
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
    opening: "My sister noticed before I said anything, but I still had to say it.",
    body: [
      "My sister Ama noticed before I said anything, but I still had to be the one to say it out loud. We were washing up and I just went, “I think I need some help.”",
      "She didn't make it weird. She asked if I wanted her to come with me to talk to Mum, and she did.",
      "We went to the GP together a couple of weeks later. Having her in the waiting room made the whole thing feel normal, like any other appointment.",
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
    reachedOutTo: "Childline",
    opening: "I didn't want to talk to anyone I knew, so I used Childline's online chat.",
    body: [
      "I didn't want to talk to anyone I knew yet, so I used Childline's online chat one evening. I liked that I could type and take my time.",
      "The counsellor was really kind. They didn't rush me, and they helped me think about which adult in my life I might feel OK talking to.",
      "A week later I told my auntie. Practising on the chat first made it so much easier to find the words.",
    ],
    whatHelped: "Practising what I wanted to say somewhere safe first.",
    tags: ["helpline"],
    illustrative: true,
  },
  {
    id: "rhys",
    displayName: "Rhys",
    age: 18,
    avatarSeed: "rhys-apricot",
    reachedOutTo: "My GP",
    opening: "I booked the appointment online so I didn't have to ring.",
    body: [
      "I booked the appointment online so I didn't have to ring up. I wrote a few notes on my phone because I knew I'd forget everything once I sat down.",
      "I basically read my notes out. The GP said that was really helpful and talked me through some options, including a local service for young people.",
      "It wasn't an instant fix, but walking out of there I felt like I'd started something. That felt huge.",
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
    opening: "I told my dad in the car, because then we didn't have to look at each other.",
    body: [
      "I told my dad in the car on the way back from netball, because then we didn't have to look at each other.",
      "He was quiet for a bit and I panicked, but then he said, “Thank you for telling me. We'll figure it out together.”",
      "Now we have a thing where I can just say “car chat?” and he knows I want to talk. It's become one of my favourite parts of the week.",
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
    opening: "There was a box outside the counsellor's room where you could leave a note.",
    body: [
      "There was a box outside the counsellor's room where you could leave a note with your name. I walked past it for about two weeks.",
      "When I finally dropped one in, she found me the next day and we booked a time. It was just a room with comfy chairs and a box of tissues nobody made you use.",
      "We met a few times. Mostly she helped me work out what I actually needed, and who else I could lean on.",
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
    reachedOutTo: "A friend online",
    opening: "My closest friend lives two hours away, so I sent her a voice note.",
    body: [
      "My closest friend Hana lives two hours away now, so I sent her a voice note at about 11pm saying I'd been struggling.",
      "She called me the next morning and we talked for ages. She encouraged me to tell someone nearby as well, and helped me plan what to say.",
      "I told my mum that weekend. Hana texted me afterwards to ask how it went, which meant a lot.",
    ],
    whatHelped: "A friend who cheered me on to tell someone else too.",
    tags: ["friend"],
    illustrative: true,
  },
  {
    id: "jordan",
    displayName: "Jordan",
    age: 19,
    avatarSeed: "jordan-tide",
    reachedOutTo: "Shout (text line)",
    opening: "Texting felt easier than talking, so I texted SHOUT to 85258.",
    body: [
      "Texting felt way easier than talking, so one night I texted SHOUT to 85258. I wasn't even sure what I'd say.",
      "The volunteer was calm and friendly. By the end I felt steadier and had a plan to talk to my flatmate and my uni's wellbeing team.",
      "I did both that week. I'm still glad that first message was just a text.",
    ],
    whatHelped: "Starting with the way of talking that felt easiest for me.",
    tags: ["helpline"],
    illustrative: true,
  },
];

/** Genuine, human-reviewed contributions published with consent. None exist yet. */
export const genuineStories: Story[] = [];

/** Shown wherever a story is read. From PULSE's reflection boundary. */
export const storyBoundary =
  "One person’s experience, not professional guidance or a promise of what will happen for someone else. Stories are not sources for PULSE’s AI guides.";

export function getStory(id: string) {
  return stories.find((s) => s.id === id);
}
