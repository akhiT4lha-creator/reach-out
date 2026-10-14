// The homepage sections, in reading order. The page AND the nav both use this list,
// so the nav always matches what's on the page. Reorder here, then in src/app/(site)/page.tsx.

export type SectionId = "about" | "why" | "first-step" | "prepare-question" | "guides" | "stories";

export const sections: { id: SectionId; nav: string }[] = [
  { id: "about", nav: "About" },
  { id: "why", nav: "Why it matters" },
  { id: "first-step", nav: "The process" },
  { id: "prepare-question", nav: "Your question" },
  { id: "guides", nav: "Guides" },
  { id: "stories", nav: "Stories" },
];

/** The three-step journey introduced in "About" and labelled on each step's section. */
export const journey: { id: SectionId; step: number; title: string; detail: string }[] = [
  { id: "first-step", step: 1, title: "Understand the process", detail: "See what contacting a service involves, one step at a time, with the source for each." },
  { id: "prepare-question", step: 2, title: "Prepare your question", detail: "Shape a first question in your own words. Nothing is sent for you." },
  { id: "guides", step: 3, title: "Talk it through", detail: "Choose one of seven AI guides with the same knowledge and a style you like." },
];
