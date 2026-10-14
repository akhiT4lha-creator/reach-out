"use client";

import { motion, useAnimate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { StoryModal } from "@/components/stories/StoryModal";
import { stories, type Story } from "@/data/stories";
import { cn } from "@/lib/utils";

// Up to 8 drifting story bubbles. The drift is decorative; every bubble is a real
// button that screen readers and keyboards can reach. Hover/focus pauses and focuses it.

type Spot = {
  /** desktop position (% of hero) */
  d: [number, number];
  /** phone position (% of bubble field), or null = hidden on phones */
  m: [number, number] | null;
  /** sits behind the headline: softened until hovered/focused */
  behind?: boolean;
};

const spots: Spot[] = [
  { d: [50, 6], m: [0, 0] },
  { d: [70, 2], m: [54, 3] },
  { d: [82, 30], m: [27, 34] },
  { d: [60, 38], m: [0, 66] },
  { d: [76, 64], m: [55, 64] },
  { d: [52, 70], m: null },
  { d: [30, 76], m: null, behind: true },
  { d: [36, 2], m: null, behind: true },
];

const MAX_BUBBLES = 8;

function seeded(i: number) {
  // stable "random" so server and client agree
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function Bubble({ story, spot, index, onOpen }: { story: Story; spot: Spot; index: number; onOpen: (s: Story) => void }) {
  const { loops } = useMotionPrefs();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!scope.current) return;
    controls.current?.stop();
    if (!loops) {
      controls.current = animate(scope.current, { x: 0, y: 0 }, { duration: 0.2 });
      return;
    }
    const r = seeded(index);
    const ax = 18 + r * 26;
    const ay = 14 + seeded(index + 11) * 22;
    controls.current = animate(
      scope.current,
      { x: [0, ax, -ax * 0.6, 0], y: [0, -ay, ay * 0.7, 0] },
      { duration: 10 + r * 6, repeat: Infinity, ease: "easeInOut", delay: r * 2 },
    );
    return () => controls.current?.stop();
  }, [loops, animate, scope, index]);

  const pause = () => {
    setActive(true);
    controls.current?.pause();
  };
  const resume = () => {
    setActive(false);
    if (loops) controls.current?.play();
  };

  const tint = ["bg-lavender/20", "bg-sky/20", "bg-sage/20", "bg-apricot/20"][index % 4];

  return (
    <div
      ref={scope}
      className={cn(
        "absolute",
        spot.m ? "block" : "hidden md:block",
        "left-[var(--mx)] top-[var(--my)] md:left-[var(--dx)] md:top-[var(--dy)]",
        active ? "z-30" : spot.behind ? "z-0" : "z-10",
      )}
      style={
        {
          "--dx": `${spot.d[0]}%`,
          "--dy": `${spot.d[1]}%`,
          "--mx": `${spot.m?.[0] ?? 0}%`,
          "--my": `${spot.m?.[1] ?? 0}%`,
        } as React.CSSProperties
      }
    >
      <motion.button
        type="button"
        onClick={() => onOpen(story)}
        onHoverStart={pause}
        onHoverEnd={resume}
        onFocus={pause}
        onBlur={resume}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: active ? 1.08 : 1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, opacity: { duration: 0.8, delay: 0.2 + index * 0.08 } }}
        aria-label={`Read ${story.displayName}'s story, age ${story.age}: ${story.opening}`}
        className={cn(
          index % 2 ? "blob-alt" : "blob",
          tint,
          "flex size-36 flex-col items-center justify-center gap-1 p-4 text-center backdrop-blur-md transition-[filter,opacity] duration-500 md:size-44 md:p-5",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_12px_40px_rgb(20_27_48/0.25)] morning:shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_12px_40px_rgb(120_80_60/0.12)]",
          spot.behind && !active && "opacity-50 blur-[2px]",
        )}
      >
        <StoryAvatar seed={story.avatarSeed} size={40} decorative className="md:size-12" />
        <span className="font-heading text-[15px] font-semibold leading-tight">
          {story.displayName}, {story.age}
        </span>
        <span className="line-clamp-2 text-[13px] leading-snug text-muted-foreground md:line-clamp-3 md:text-sm">
          {story.opening}
        </span>
      </motion.button>
    </div>
  );
}

export function StoryBubbles({ className }: { className?: string }) {
  const [open, setOpen] = useState<Story | null>(null);
  const shown = stories.slice(0, Math.min(MAX_BUBBLES, spots.length));
  return (
    <>
      <div className={cn("relative", className)} role="group" aria-label="Stories from young people">
        {shown.map((s, i) => (
          <Bubble key={s.id} story={s} spot={spots[i]} index={i} onOpen={setOpen} />
        ))}
      </div>
      <StoryModal story={open} onClose={() => setOpen(null)} />
    </>
  );
}
