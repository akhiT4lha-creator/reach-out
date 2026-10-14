"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { usePulse } from "@/components/pulse/PulseProvider";

/** From a story to the user's own first step: prepare a question, or choose a path. */
export function StoryNextStep() {
  const { openPanel } = usePulse();
  return (
    <>
      <button
        type="button"
        onClick={() => openPanel("draft")}
        className="squish inline-flex h-14 items-center gap-2 rounded-full bg-apricot px-7 text-lg font-semibold text-ink"
      >
        Prepare my first question <ArrowRight size={20} weight="bold" aria-hidden />
      </button>
      <Link href="/start" className="squish inline-flex h-14 items-center rounded-full bg-surface-strong px-6 text-lg font-semibold hover:bg-accent">
        Choose my next step
      </Link>
    </>
  );
}
