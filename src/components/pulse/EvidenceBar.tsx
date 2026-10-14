"use client";

import { motion } from "framer-motion";
import { nhsFinding } from "@/data/pulse/evidence";

/** The NHS split as one rounded bar, labelled directly. Grows in once, then stays still. */
export function EvidenceBar({ className }: { className?: string }) {
  const { didNotSeek, sought } = nhsFinding;
  return (
    <div className={className}>
      <div
        role="img"
        aria-label={`${didNotSeek} percent did not seek help or advice; ${sought} percent sought help or advice`}
        className="flex h-14 gap-1.5 overflow-hidden rounded-full"
      >
        <motion.span
          className="flex items-center rounded-l-full bg-apricot pl-5 font-heading text-lg font-semibold text-ink"
          style={{ width: `${didNotSeek}%`, originX: 0 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {didNotSeek}%
        </motion.span>
        <span className="flex flex-1 items-center justify-end rounded-r-full bg-sage/35 pr-5 font-heading text-lg font-semibold">
          {sought}%
        </span>
      </div>
      <div className="mt-2 flex justify-between gap-4 text-base text-muted-foreground" aria-hidden>
        <span>Did not seek help or advice</span>
        <span className="text-right">Sought help or advice</span>
      </div>
    </div>
  );
}
