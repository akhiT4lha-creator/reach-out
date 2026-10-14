import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { cn } from "@/lib/utils";

// Illustrated avatars (never photos). DiceBear "Lorelei" by Lisa Wischofsky, CC0 1.0.
// Backgrounds use the site palette so every face sits softly in the design.
const palette = ["f5a97f", "9cc5a1", "a9c7e8", "c3b1e1"];

function svgFor(seed: string) {
  return createAvatar(lorelei, {
    seed,
    backgroundColor: palette,
    backgroundType: ["solid"],
    radius: 50,
  }).toDataUri();
}

export function StoryAvatar({
  seed,
  name,
  size = 56,
  className,
  decorative = false,
}: {
  seed: string;
  name?: string;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI, no optimisation needed
    <img
      src={svgFor(seed)}
      width={size}
      height={size}
      alt={decorative || !name ? "" : `Illustrated avatar for ${name}`}
      className={cn("shrink-0 rounded-full", className)}
      draggable={false}
    />
  );
}

export const avatarChoices = ["sky-pebble", "sage-fern", "apricot-sun", "lavender-dream", "tide-shell", "moon-moss"];
