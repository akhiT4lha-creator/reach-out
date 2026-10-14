"use client";

import { ArrowRight, ArrowUpRight, BookOpenText, Lifebuoy, PencilSimpleLine } from "@phosphor-icons/react";
import { useCrisis } from "@/components/crisis/CrisisPanel";
import { GuideAvatar } from "@/components/pulse/GuideAvatar";
import { usePulse } from "@/components/pulse/PulseProvider";
import { btn } from "@/components/pulse/ui";
import { getGuide, type Guide } from "@/data/pulse/guides";
import type { AnswerResponse } from "@/lib/pulse/contract";

const statusLabel: Partial<Record<AnswerResponse["status"], string>> = {
  unknown: "Not stated in the source",
  clarify: "Let’s clarify",
  urgent: "Safety notice",
};

/** Renders every field the original PULSE front end read from /api/answer. */
export function ChatAnswer({
  guide,
  answer,
  isLatest,
  busy,
  live,
  onCompose,
}: {
  guide: Guide;
  answer: AnswerResponse;
  isLatest: boolean;
  busy: boolean;
  live: boolean;
  onCompose: (text: string) => void;
}) {
  const { setDraft, openPanel, openSources, startChat } = usePulse();
  const { open: openCrisis } = useCrisis();
  const switchGuide = getGuide(answer.switchTo);

  return (
    <div className="flex gap-3 md:gap-4">
      <GuideAvatar id={guide.id} size={40} decorative className="mt-1 hidden size-10 self-start sm:block" />
      <div className="min-w-0 flex-1 rounded-[28px] rounded-tl-lg bg-surface p-5 md:p-6">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span className="font-heading text-base">{guide.name}</span>
          <span className="rounded-full bg-sky/20 px-2.5 py-0.5">{answer.mode === "live" ? "AI reply" : "System notice"}</span>
          {statusLabel[answer.status] && <span className="rounded-full bg-apricot/25 px-2.5 py-0.5">{statusLabel[answer.status]}</span>}
        </p>
        <p className="mt-3 whitespace-pre-wrap break-words">{answer.text}</p>

        {answer.essential && (
          <details open className="mt-4 rounded-[20px] bg-sage/15 p-4 text-base">
            <summary className="cursor-pointer font-semibold">{answer.essential.title}</summary>
            <p className="mt-2">{answer.essential.text}</p>
          </details>
        )}

        {answer.steps && answer.steps.length > 0 && (
          <ol className="mt-4 list-decimal space-y-1 pl-6 text-base">
            {answer.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        )}

        {answer.draft && (
          <div className="mt-4 rounded-[20px] bg-lavender/15 p-4">
            <p className="font-heading text-lg leading-snug">&ldquo;{answer.draft}&rdquo;</p>
            <button
              type="button"
              onClick={() => {
                setDraft(answer.draft!);
                openPanel("draft");
              }}
              className={`${btn.link} mt-1`}
            >
              <PencilSimpleLine size={16} weight="bold" aria-hidden /> Edit or copy this question
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
          {answer.sources.length > 0 && (
            <button type="button" onClick={() => openSources(answer.sources)} className={btn.link}>
              <BookOpenText size={18} weight="duotone" aria-hidden /> {answer.sources.length === 1 ? "Check the source" : "Check the sources"}
            </button>
          )}
          {answer.status === "urgent" && (
            <button type="button" onClick={openCrisis} className={btn.link}>
              <Lifebuoy size={18} weight="duotone" aria-hidden /> Show human help
            </button>
          )}
        </div>

        {answer.notice && (
          <details className="mt-3 text-base text-muted-foreground">
            <summary className="cursor-pointer font-semibold">About this answer</summary>
            <p className="mt-1">{answer.notice}</p>
          </details>
        )}

        {switchGuide && (
          <button type="button" onClick={() => startChat(switchGuide.id)} className={`${btn.secondary} mt-4`}>
            Switch to {switchGuide.name} <ArrowRight size={16} weight="bold" aria-hidden />
          </button>
        )}

        {isLatest && answer.mode === "live" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => onCompose("Please explain your last answer more simply.")} className={btn.secondary}>
              Explain that more simply
            </button>
            <button type="button" onClick={() => openPanel("draft")} className={btn.secondary}>
              Help me draft a question
            </button>
          </div>
        )}

        {isLatest && answer.suggestions && answer.suggestions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {answer.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy || !live}
                onClick={() => onCompose(s)}
                className="squish inline-flex min-h-11 items-center gap-2 rounded-full bg-lavender/20 px-4 py-2 text-left text-base font-semibold hover:bg-lavender/30 disabled:opacity-50"
              >
                {s} <ArrowUpRight size={14} weight="bold" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
