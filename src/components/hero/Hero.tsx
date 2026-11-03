"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { StoryOrbit } from "./StoryOrbit";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  return (
    <section className="relative isolate -mt-[76px] overflow-clip bg-[var(--orbit-bg)] pt-[76px] md:min-h-[100dvh]">
      {/* Text then stories on phones. Side by side from tablet up, with the orbit running to the screen's edge. */}
      <div className="relative grid grid-cols-[minmax(0,1fr)] md:min-h-[calc(100dvh-76px)] md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
        <div className="relative z-20 flex flex-col items-start justify-center px-4 pt-10 md:py-10 md:pl-[max(1.5rem,calc((100vw-72rem)/2))] md:pr-0">
          <motion.div variants={rise} initial="hidden" animate="show" custom={0} className="organic-card bg-surface-strong p-7 backdrop-blur md:p-8 lg:p-10">
            <h1 className="text-[2.6rem] font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
              You don&apos;t need to know <span className="text-apricot-text">where to start.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground lg:text-xl">
              Start with a guide. They&apos;ll help you work out who to talk to, and what you might say.
            </p>
          </motion.div>
          <motion.div variants={rise} initial="hidden" animate="show" custom={1} className="mt-8">
            <motion.span className="inline-block" whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
              <Link
                href="/start"
                className="squish inline-flex h-14 items-center gap-2 rounded-full bg-apricot px-7 text-lg font-semibold text-ink shadow-[0_10px_30px_rgb(245_169_127/0.3)]"
              >
                Help me get started <ArrowRight size={20} weight="bold" aria-hidden />
              </Link>
            </motion.span>
          </motion.div>
          <motion.p variants={rise} initial="hidden" animate="show" custom={2} className="mt-4 text-sm text-muted-foreground">
            Our Stories are examples written for this prototype, not real people.
          </motion.p>
        </div>
        <StoryOrbit />
      </div>
    </section>
  );
}
