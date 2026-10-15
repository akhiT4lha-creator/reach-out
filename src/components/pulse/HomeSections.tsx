"use client";

import { BookOpenText } from "@phosphor-icons/react";
import { nhsFinding } from "@/data/pulse/evidence";
import { EvidenceBar } from "./EvidenceBar";
import { usePulse } from "./PulseProvider";
import { cn } from "@/lib/utils";
import { btn } from "./ui";

export function EvidenceSection() {
  const { openSources } = usePulse();
  return (
    <div className="relative overflow-hidden rounded-[40px] bg-surface-strong p-6 md:p-12">
      <span aria-hidden className="blob absolute -left-20 -top-24 size-72 bg-apricot/20 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <p className="font-heading text-[5.5rem] font-semibold leading-none text-apricot-text md:text-[8rem]">
            {nhsFinding.didNotSeek}
            <span className="text-[0.45em]">%</span>
          </p>
          <h2 id="why-title" className="pb-2 text-3xl font-semibold md:pb-4 md:text-4xl">
            of 17–24s with a concern <span className="text-apricot-text">didn&apos;t seek help.</span>
          </h2>
        </div>
        <EvidenceBar className="mt-8" />
        <button type="button" onClick={() => openSources([nhsFinding.sourceEntryId], "evidence")} className={cn(btn.link, "mt-5 text-sm")}>
          <BookOpenText size={16} weight="duotone" aria-hidden /> NHS England, 2023: view the source
        </button>
      </div>
    </div>
  );
}
