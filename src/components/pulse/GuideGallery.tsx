"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import { guides, stylePreferences, type GuideId } from "@/data/pulse/guides";
import { cn } from "@/lib/utils";
import { GuideAvatar } from "./GuideAvatar";
import { usePulse } from "./PulseProvider";
import { btn, chip } from "./ui";

/** The four guides, shown by personality type: pick one, then start a chat. */
export function GuideGallery() {
  const { startChat } = usePulse();
  const [picked, setPicked] = useState<GuideId>("ari");
  const g = guides.find((x) => x.id === picked)!;

  return (
    <div>
      <div role="group" aria-label="Preview by conversational preference" className="flex flex-wrap gap-2">
        {stylePreferences.map((p) => (
          <button key={p.guide} type="button" aria-pressed={picked === p.guide} onClick={() => setPicked(p.guide)} className={chip(picked === p.guide)}>
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-base text-muted-foreground">A style preference, not an assessment. All four are below.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <ul aria-label="Preview a guide" className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {guides.map((x, i) => {
            const on = x.id === picked;
            return (
              <li key={x.id}>
                <motion.button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${x.name}, ${x.role}`}
                  onClick={() => setPicked(x.id)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="group flex w-full flex-col items-center gap-2 rounded-[28px] p-1.5 text-center"
                >
                  <span
                    className={cn(
                      i % 2 ? "blob-alt" : "blob",
                      "block overflow-hidden transition-[box-shadow,opacity] duration-300",
                      on ? "shadow-[0_0_0_4px_var(--apricot)]" : "opacity-80 group-hover:opacity-100",
                    )}
                  >
                    <GuideAvatar id={x.id} size={112} decorative className="h-auto w-full rounded-none" />
                  </span>
                  <span className="font-heading text-base font-semibold leading-tight sm:text-lg">{x.role}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        <div aria-live="polite" className="relative overflow-hidden rounded-[32px] bg-surface p-6 md:p-8" style={{ ["--guide" as string]: g.color }}>
          <span aria-hidden className="blob absolute -right-14 -top-14 size-44 bg-[var(--guide)] opacity-25 blur-2xl" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="flex items-center gap-4">
                <GuideAvatar id={g.id} size={84} decorative className="blob" />
                <div>
                  <h3 className="text-3xl font-semibold">{g.name}</h3>
                  <p className="text-muted-foreground">{g.role}</p>
                </div>
              </div>
              <button type="button" onClick={() => startChat(g.id)} className={`${btn.primary} mt-6`}>
                Start with {g.name} <ArrowRight size={20} weight="bold" aria-hidden />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
