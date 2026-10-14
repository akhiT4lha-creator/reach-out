"use client";

import { motion } from "framer-motion";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils";

// Buddy: a soft, non-human cloud-blob host. Not a person, not a known character.
// Buddy is PULSE's navigation and sharing mascot. Buddy is NOT an AI and not an eighth guide:
// everything Buddy says is scripted.
// States: idle (breathing + blinking), talking (mouth moves), happy (big smile, eyes closed).
// `bump` changes on each step so Buddy does a small hop of encouragement.

export type BuddyState = "idle" | "talking" | "happy";

export function Buddy({
  state = "idle",
  bump = 0,
  className,
}: {
  state?: BuddyState;
  bump?: number;
  className?: string;
}) {
  const { loops, calm } = useMotionPrefs();

  return (
    <motion.div
      key={bump}
      className={cn("relative aspect-square w-40 md:w-56", className)}
      initial={calm ? { opacity: 0.6 } : { y: 0, scale: 1 }}
      animate={calm ? { opacity: 1 } : { y: [0, -14, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: calm ? 0.2 : 0.7, ease: "easeInOut" }}
      role="img"
      aria-label={
        state === "happy" ? "Buddy, PULSE’s cloud-shaped mascot, smiling" : "Buddy, PULSE’s cloud-shaped mascot"
      }
    >
      {/* breathing */}
      <motion.svg
        viewBox="0 0 200 200"
        className="h-full w-full overflow-visible"
        animate={loops ? { scale: [1, 1.035, 1] } : { scale: 1 }}
        transition={loops ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        style={{ transformOrigin: "50% 80%" }}
        aria-hidden
      >
        <defs>
          <radialGradient id="buddy-body" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#d9cdf0" />
            <stop offset="55%" stopColor="#c3b1e1" />
            <stop offset="100%" stopColor="#a9c7e8" />
          </radialGradient>
        </defs>
        {/* soft shadow */}
        <ellipse cx="100" cy="184" rx="58" ry="8" fill="#141b30" opacity="0.18" />
        {/* body: a gentle cloud blob */}
        <path
          d="M100 30c22 0 36 12 42 26 20 2 36 18 36 40 0 14-6 26-16 34 4 6 6 13 6 20 0 18-16 30-36 30H66c-22 0-38-14-38-32 0-8 3-15 8-21-10-8-16-19-16-32 0-22 18-38 40-39 6-15 20-26 40-26z"
          fill="url(#buddy-body)"
        />
        {/* little highlight */}
        <ellipse cx="72" cy="66" rx="16" ry="9" fill="#fff" opacity="0.35" transform="rotate(-20 72 66)" />
        {/* cheeks */}
        <ellipse cx="62" cy="122" rx="12" ry="7" fill="#f5a97f" opacity={state === "happy" ? 0.75 : 0.5} />
        <ellipse cx="138" cy="122" rx="12" ry="7" fill="#f5a97f" opacity={state === "happy" ? 0.75 : 0.5} />

        {/* eyes */}
        {state === "happy" ? (
          <g stroke="#1e2a47" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M68 104q10-12 20 0" />
            <path d="M112 104q10-12 20 0" />
          </g>
        ) : (
          <motion.g
            fill="#1e2a47"
            animate={loops ? { scaleY: [1, 1, 0.1, 1, 1] } : { scaleY: 1 }}
            transition={loops ? { duration: 4.5, times: [0, 0.9, 0.94, 0.98, 1], repeat: Infinity } : { duration: 0 }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <ellipse cx="78" cy="102" rx="7" ry="9" />
            <ellipse cx="122" cy="102" rx="7" ry="9" />
            <circle cx="80" cy="98" r="2.2" fill="#fff" />
            <circle cx="124" cy="98" r="2.2" fill="#fff" />
          </motion.g>
        )}

        {/* mouth */}
        {state === "happy" ? (
          <path d="M84 126q16 18 32 0z" fill="#1e2a47" stroke="#1e2a47" strokeWidth="4" strokeLinejoin="round" />
        ) : state === "talking" ? (
          <motion.ellipse
            cx="100"
            cy="130"
            rx="9"
            ry="7"
            fill="#1e2a47"
            style={{ originX: 0.5, originY: 0.5 }}
            animate={loops ? { scaleY: [0.45, 1, 0.6, 0.9, 0.45] } : { scaleY: 0.7 }}
            transition={loops ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
          />
        ) : (
          <path d="M88 126q12 10 24 0" stroke="#1e2a47" strokeWidth="5" strokeLinecap="round" fill="none" />
        )}
      </motion.svg>
    </motion.div>
  );
}
