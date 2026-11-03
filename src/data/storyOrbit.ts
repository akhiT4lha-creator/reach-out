import { stories } from "./stories";

// What each bubble in the hero's "Our Stories" orbit shows. PLACEHOLDER: swap this array for real
// content. `id` must match a story in stories.ts, because clicking a bubble opens that story.

export type OrbitStory = {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  /** Short text shown when a bubble is hovered. Keep it under about 100 characters. */
  preview: string;
};

export const orbitStories: OrbitStory[] = stories.map((s) => ({
  id: s.id,
  name: s.displayName,
  age: s.age,
  avatarSeed: s.avatarSeed,
  preview: s.body[2],
}));
