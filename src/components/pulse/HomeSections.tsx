"use client";

import { ArrowRight, BookOpenText } from "@phosphor-icons/react";
import Link from "next/link";
import { Buddy } from "@/components/avatar/Buddy";
import { StepLabel } from "./AboutSection";
import { nhsFinding } from "@/data/pulse/evidence";
import { getService } from "@/data/pulse/services";
import { DraftEditor } from "./DraftEditor";
import { EvidenceBar } from "./EvidenceBar";
import { ProcessExplorer } from "./ProcessExplorer";
import { usePulse } from "./PulseProvider";
import { ServiceSelect } from "./ServiceSelect";
import { btn } from "./ui";

export function FirstStepExplorer() {
  const { service, openPanel, openStart } = usePulse();
  const svc = getService(service);
  return (
    <div className="mt-8 grid min-w-0 gap-6 [&>*]:min-w-0">
      <ServiceSelect />
      <ProcessExplorer onDraft={() => openPanel("draft")} onGuide={() => openStart("guides", svc.guideQuestion)} />
    </div>
  );
}

export function QuestionInvite() {
  const { openStart } = usePulse();
  return (
    <div className="grid gap-8 rounded-[32px] bg-surface p-6 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-12 md:p-10">
      <div>
        <StepLabel step={2} />
        <Buddy className="w-24 md:w-32" />
        <h2 id="prepare-question-title" className="mt-4 text-4xl font-semibold md:text-5xl">Not sure what to say?</h2>
        <p className="mt-4 text-muted-foreground">
          Start with a process question. Edit it until it sounds like you, then decide whether to use it.
        </p>
      </div>
      <DraftEditor onReview={() => openStart("guides", "Help me refine the wording of my first question.")} />
    </div>
  );
}

export function EvidenceSection() {
  const { openPanel, openSources } = usePulse();
  return (
    <div className="relative overflow-hidden rounded-[40px] bg-surface-strong p-6 md:p-12">
      <span aria-hidden className="blob absolute -left-20 -top-24 size-72 bg-apricot/20 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14">
        <div>
          <p className="font-heading text-[5.5rem] font-semibold leading-none text-apricot-text md:text-[8rem]">
            {nhsFinding.didNotSeek}
            <span className="text-[0.45em]">%</span>
          </p>
          <p className="mt-2 font-heading text-xl">did not seek help or advice</p>
          <EvidenceBar className="mt-6" />
        </div>
        <div>
          <h2 id="why-title" className="text-4xl font-semibold md:text-5xl">Clarity is a place to begin.</h2>
          <p className="mt-4">
            Among surveyed 17–24-year-olds who reported a concern, {nhsFinding.didNotSeek}% did not seek help or advice. NHS England,
            2023, {nhsFinding.table}. Unweighted base: {nhsFinding.unweightedBase}.
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            {nhsFinding.period} The figure describes a group: it doesn’t tell us why, and it isn’t a PULSE result.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => openPanel("evidence")} className={btn.primarySm}>
              What does this mean? <ArrowRight size={18} weight="bold" aria-hidden />
            </button>
            <button type="button" onClick={() => openSources([nhsFinding.sourceEntryId], "evidence")} className={btn.secondary}>
              <BookOpenText size={18} weight="duotone" aria-hidden /> View the source
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinalCall() {
  const { openPanel } = usePulse();
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link href="/start" className={btn.primary}>
        Help me get started <ArrowRight size={20} weight="bold" aria-hidden />
      </Link>
      <button type="button" onClick={() => openPanel("draft")} className={btn.ghost}>
        Or go straight to my first question
      </button>
    </div>
  );
}
