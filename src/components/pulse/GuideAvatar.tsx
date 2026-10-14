import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { getGuide, type GuideId } from "@/data/pulse/guides";
import { cn } from "@/lib/utils";

// The seven guides drawn in Reach Out's illustration style (DiceBear "Lorelei", CC0),
// on each guide's original PULSE colour. Theo, Ellis and Quinn keep their glasses.
const cache = new Map<GuideId, string>();

function uri(id: GuideId) {
  const hit = cache.get(id);
  if (hit) return hit;
  const g = getGuide(id)!;
  const src = createAvatar(lorelei, {
    seed: g.avatarSeed,
    backgroundColor: [g.color.replace("#", "").toLowerCase()],
    backgroundType: ["solid"],
    glassesProbability: g.glasses ? 100 : 0,
    // gentle closed-mouth smiles only, so every guide looks calm and friendly
    mouth: ["happy01", "happy02", "happy03", "happy04"],
  }).toDataUri();
  cache.set(id, src);
  return src;
}

export function GuideAvatar({
  id,
  size = 64,
  className,
  decorative = false,
}: {
  id: GuideId;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const g = getGuide(id)!;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI
    <img
      src={uri(id)}
      width={size}
      height={size}
      alt={decorative ? "" : `${g.name}, fictional AI guide`}
      draggable={false}
      className={cn("shrink-0 rounded-full", className)}
    />
  );
}
