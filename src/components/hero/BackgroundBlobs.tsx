// Adapted from https://github.com/codse/animata/blob/HEAD/animata/background/blurry-blob.tsx (MIT)
// Changes: Framer Motion drift instead of CSS keyframes, site palette, screen blend for dark themes,
// several blobs, and motion switched off in Calm mode / reduced motion / hidden tab.
"use client";

import { motion } from "framer-motion";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils";

const blobs = [
  { color: "var(--lavender)", className: "-left-24 top-10 size-[22rem] md:size-[30rem]", dx: 60, dy: 40, d: 14 },
  { color: "var(--apricot)", className: "right-[-6rem] top-1/3 size-[18rem] md:size-[26rem]", dx: -50, dy: 50, d: 17 },
  { color: "var(--sky)", className: "bottom-[-6rem] left-1/3 size-[20rem] md:size-[28rem]", dx: 40, dy: -40, d: 19 },
  { color: "var(--sage)", className: "right-1/4 top-[-5rem] size-[14rem] md:size-[20rem]", dx: -30, dy: 30, d: 12 },
];

export function BackgroundBlobs({ className }: { className?: string }) {
  const { loops } = useMotionPrefs();
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={cn("blob absolute opacity-[0.22] blur-3xl morning:opacity-40", b.className)}
          style={{ background: b.color }}
          animate={loops ? { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.08, 1] } : { x: 0, y: 0, scale: 1 }}
          transition={loops ? { duration: b.d, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
      ))}
    </div>
  );
}
