"use client";

import { ArrowRight, ArrowSquareOut, Check, Copy } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { LIMITS } from "@/lib/pulse/contract";
import { getService } from "@/data/pulse/services";
import { cn } from "@/lib/utils";
import { usePulse } from "./PulseProvider";
import { btn, field } from "./ui";

/**
 * The editable first question. Shared across the site (page memory only).
 * Nothing is ever sent to a support service. When live AI is connected, the current draft
 * is included with a chat question so a guide can help refine it.
 */
export function DraftEditor({ onReview, className }: { onReview?: () => void; className?: string }) {
  const { draft, setDraft, service } = usePulse();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const id = useId();
  const svc = getService(service);

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="font-heading text-xl font-semibold">
        My first question
      </label>
      <textarea
        id={id}
        name="first-question"
        autoComplete="off"
        value={draft}
        maxLength={LIMITS.draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setCopied(false);
        }}
        rows={4}
        className={cn(field, "mt-3 min-h-36 resize-y font-heading text-xl leading-snug")}
      />
      <p className="mt-1 text-right text-sm tabular-nums text-muted-foreground">
        {draft.length} / {LIMITS.draft}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={copy} className={btn.primarySm}>
          {copied ? <Check size={18} weight="bold" aria-hidden /> : <Copy size={18} weight="bold" aria-hidden />}
          {copied ? "Copied" : "Copy question"}
        </button>
        {onReview && (
          <button type="button" onClick={onReview} className={btn.secondary}>
            Review wording with an AI guide <ArrowRight size={18} weight="bold" aria-hidden />
          </button>
        )}
      </div>
      <p className="mt-3 text-base text-muted-foreground" aria-live="polite">
        {copyError
          ? "Copy isn’t available here. Select the question and copy it yourself."
          : copied
            ? "Copied to your clipboard. You decide where to use it."
            : "This stays in page memory until you press Clear or reload. Nothing is sent for you."}
      </p>
      {svc.contact && (
        <div className="mt-5 rounded-[20px] bg-sky/15 p-4 text-base">
          <a href={svc.contact} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold underline underline-offset-4 hover:no-underline">
            Open {svc.name}’s contact options <ArrowSquareOut size={16} weight="bold" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="mt-1 text-muted-foreground">Opens another website. No message or conversation is transferred.</p>
        </div>
      )}
    </div>
  );
}
