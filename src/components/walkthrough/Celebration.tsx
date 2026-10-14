"use client";

import { motion } from "framer-motion";
import { useMotionPrefs } from "@/components/motion/MotionProvider";

// A soft, slow burst of rounded shapes in the site palette. Plays once.
// In Calm mode it's just a gentle glow fade.

const colors = ["#f5a97f", "#9cc5a1", "#a9c7e8", "#c3b1e1"];
const PIECES = 22;

function r(i: number, s: number) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function Celebration() {
  const { calm } = useMotionPrefs();

  if (calm) {
    return (
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(245_169_127/0.25),transparent_60%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: PIECES }).map((_, i) => {
        const angle = (i / PIECES) * Math.PI * 2 + r(i, 1) * 0.4;
        const dist = 120 + r(i, 2) * 220;
        const size = 8 + r(i, 3) * 14;
        const shape = i % 3 === 0 ? "rounded-[40%]" : "rounded-full";
        return (
          <motion.span
            key={i}
            className={`absolute left-1/2 top-[40%] ${shape}`}
            style={{ width: size, height: size, background: colors[i % 4], marginLeft: -size / 2, marginTop: -size / 2 }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: [0, Math.sin(angle) * dist - 30, Math.sin(angle) * dist + 40],
              opacity: [0, 1, 0],
              scale: [0.4, 1, 0.8],
              rotate: r(i, 4) * 180,
            }}
            transition={{ duration: 2.8 + r(i, 5), ease: [0.16, 1, 0.3, 1], delay: 0.15 + r(i, 6) * 0.25 }}
          />
        );
      })}
    </div>
  );
}
