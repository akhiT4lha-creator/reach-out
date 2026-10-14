"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Five stepping stones joined by a gently growing path. No percentages.
export function ProgressPath({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <ol className="flex items-center" aria-label={`Step ${Math.max(current, 1)} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const done = n < current;
          const here = n === current;
          return (
            <li key={n} className="flex items-center" aria-current={here ? "step" : undefined}>
              {i > 0 && (
                <span className="relative h-1 w-6 overflow-hidden rounded-full bg-foreground/15 md:w-10">
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full bg-sage"
                    initial={false}
                    animate={{ scaleX: n <= current ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              )}
              <motion.span
                initial={false}
                animate={{ scale: here ? 1.25 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                className={cn(
                  "grid size-4 place-items-center rounded-full transition-colors duration-500",
                  done && "bg-sage",
                  here && "bg-apricot shadow-[0_0_0_5px_rgb(245_169_127/0.25)]",
                  !done && !here && "bg-foreground/20",
                )}
              >
                <span className="sr-only">
                  Step {n}
                  {done ? ", done" : here ? ", current" : ""}
                </span>
              </motion.span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
