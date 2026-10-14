"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { BackgroundBlobs } from "./BackgroundBlobs";
import { StoryBubbles } from "./StoryBubbles";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  return (
    <section className="relative isolate -mt-[76px] overflow-x-clip pt-[76px] md:min-h-[100dvh]">
      <BackgroundBlobs className="[mask-image:linear-gradient(to_bottom,black_65%,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Bubble field: own block on phones, fills the hero behind/right of the text on desktop */}
        <div className="pointer-events-none relative z-20 pt-10 md:flex md:min-h-[calc(100dvh-76px)] md:items-center md:pt-0">
          <div className="pointer-events-auto max-w-xl">
            <motion.p
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0}
              className="mb-4 inline-block rounded-full bg-surface-strong px-4 py-1.5 text-base font-semibold backdrop-blur"
            >
              Understand first. Decide later.
            </motion.p>
            <motion.h1
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0}
              className="text-[2.6rem] font-semibold leading-[1.08] tracking-tight md:text-6xl"
            >
              You don&apos;t need to know <span className="text-apricot-text">where to start.</span>
            </motion.h1>
            <motion.p variants={rise} initial="hidden" animate="show" custom={1} className="mt-5 max-w-md text-lg text-muted-foreground md:text-xl">
              Preview what contacting support involves, check the sources, and prepare a first question with seven AI guides.
            </motion.p>
            <motion.div variants={rise} initial="hidden" animate="show" custom={2} className="mt-8 flex flex-wrap gap-3">
              <motion.span whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                <Link
                  href="/start"
                  className="squish inline-flex h-14 items-center gap-2 rounded-full bg-apricot px-7 text-lg font-semibold text-ink shadow-[0_10px_30px_rgb(245_169_127/0.3)]"
                >
                  Help me get started <ArrowRight size={20} weight="bold" aria-hidden />
                </Link>
              </motion.span>
              <motion.span whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                <Link
                  href="#about"
                  className="squish inline-flex h-14 items-center rounded-full bg-surface-strong px-7 text-lg font-semibold backdrop-blur hover:bg-accent"
                >
                  See how it works
                </Link>
              </motion.span>
            </motion.div>
          </div>
        </div>
        <StoryBubbles className="mt-10 h-[440px] md:absolute md:inset-x-6 md:bottom-10 md:top-24 md:mt-0 md:h-auto" />
      </div>
    </section>
  );
}
