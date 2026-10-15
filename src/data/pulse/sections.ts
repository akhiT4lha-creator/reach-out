// The homepage sections, in reading order. The page AND the nav both use this list,
// so the nav always matches what's on the page. Reorder here, then in src/app/(site)/page.tsx.

export type SectionId = "why" | "guides" | "stories" | "share";

export const sections: { id: SectionId; nav: string }[] = [
  { id: "why", nav: "The facts" },
  { id: "guides", nav: "Guides" },
  { id: "stories", nav: "Stories" },
  { id: "share", nav: "Share" },
];
