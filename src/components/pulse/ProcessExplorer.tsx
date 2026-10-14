"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpenText, ChatsCircle, PencilSimpleLine } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { ProgressPath } from "@/components/walkthrough/ProgressPath";
import { getService } from "@/data/pulse/services";
import { cn } from "@/lib/utils";
import { usePulse, type SourcesBack } from "./PulseProvider";
import { btn, chip } from "./ui";

/**
 * Reach Out's guided-step pattern applied to a support process:
 * one step at a time, Back / Next, a "view all steps" option, and the source behind every step.
 */
export function ProcessExplorer({
  onDraft,
  onGuide,
  sourcesBack = null,
}: {
  onDraft: () => void;
  onGuide: () => void;
  sourcesBack?: SourcesBack;
}) {
  const { service, process, setProcess, openSources } = usePulse();
  const svc = getService(service);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const step = Math.min(process.step, svc.steps.length - 1);
  const last = step === svc.steps.length - 1;

  useEffect(() => {
    if (moved.current) {
      heading.current?.focus({ preventScroll: true });
      moved.current = false;
    }
  }, [step, process.all, process.opened]);

  const go = (n: number) => {
    moved.current = true;
    setProcess({ step: n, all: false });
  };

  const boundary = (
    <p className="rounded-[20px] bg-lavender/15 px-5 py-3 text-base">
      <span className="font-semibold">{svc.description}.</span> {svc.boundary}
    </p>
  );

  if (!process.opened) {
    return (
      <div className="space-y-5">
        {boundary}
        <p className="max-w-xl text-muted-foreground">Look at one step, check where it comes from, then decide what you want to do next.</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              moved.current = true;
              setProcess({ opened: true, step: 0, all: false });
            }}
            className={btn.primary}
          >
            Show me what happens first <ArrowRight size={20} weight="bold" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              moved.current = true;
              setProcess({ opened: true, all: true });
            }}
            className={btn.ghost}
          >
            View all steps
          </button>
        </div>
      </div>
    );
  }

  const sourceButton = (ids: string[], label = "See where this step comes from") =>
    ids.length > 0 ? (
      <button type="button" onClick={() => openSources(ids, sourcesBack)} className={btn.link}>
        <BookOpenText size={18} weight="duotone" aria-hidden /> {label}
      </button>
    ) : (
      <p className="text-base text-muted-foreground">No source is connected for this step.</p>
    );

  return (
    <div className="space-y-5">
      {boundary}
      <nav aria-label="Process steps" className="flex flex-wrap items-center gap-2">
        {svc.steps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-current={!process.all && step === i ? "step" : undefined}
            onClick={() => go(i)}
            className={chip(!process.all && step === i)}
          >
            Step {i + 1}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={process.all}
          onClick={() => {
            moved.current = true;
            setProcess({ all: !process.all });
          }}
          className={chip(process.all)}
        >
          View all steps
        </button>
      </nav>

      {process.all ? (
        <div>
          <h3 ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">
            All steps for {svc.name}
          </h3>
          <ol className="mt-4 grid gap-3">
            {svc.steps.map((s, i) => (
              <li key={i} className={cn("flex gap-4 rounded-[24px] p-5", ["bg-sky/15", "bg-sage/15", "bg-lavender/15", "bg-apricot/15"][i % 4])}>
                <span aria-hidden className="blob grid size-10 shrink-0 place-items-center bg-surface-strong font-heading text-lg font-semibold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-lg leading-snug">{s}</p>
                  {svc.stepNotes?.[i] && <p className="mt-1 text-base text-muted-foreground">{svc.stepNotes[i]}</p>}
                  <div className="mt-1">{sourceButton(svc.stepSources[i], "Source for this step")}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="rounded-[28px] bg-surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ProgressPath current={step + 1} total={svc.steps.length} />
            <span className="text-base text-muted-foreground">
              {svc.name} · step {step + 1} of {svc.steps.length}
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${service}-${step}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 ref={heading} tabIndex={-1} className="mt-5 text-2xl font-semibold outline-none md:text-3xl">
                {svc.steps[step]}
              </h3>
              {svc.stepNotes?.[step] && <p className="mt-3 rounded-[20px] bg-apricot/15 px-5 py-3 text-base">{svc.stepNotes[step]}</p>}
              <div className="mt-3">{sourceButton(svc.stepSources[step])}</div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" disabled={step === 0} onClick={() => go(step - 1)} className={btn.ghost}>
              <ArrowLeft size={18} weight="bold" aria-hidden /> Previous
            </button>
            {last ? (
              <button type="button" onClick={onDraft} className={btn.primarySm}>
                Prepare my first question <ArrowRight size={18} weight="bold" aria-hidden />
              </button>
            ) : (
              <button type="button" onClick={() => go(step + 1)} className={btn.primarySm}>
                What happens next? <ArrowRight size={18} weight="bold" aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onDraft} className={btn.secondary}>
          <PencilSimpleLine size={18} weight="duotone" aria-hidden /> Help me find the words
        </button>
        <button type="button" onClick={onGuide} className={btn.secondary}>
          <ChatsCircle size={18} weight="duotone" aria-hidden /> Ask an AI guide about this
        </button>
      </div>
    </div>
  );
}
