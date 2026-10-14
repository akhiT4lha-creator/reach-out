"use client";

import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { AnswerType } from "@/data/walkthrough";
import { cn } from "@/lib/utils";

// Renders one answer control, chosen by `answer.kind` in src/data/walkthrough.ts.
export function StepAnswer({
  answer,
  question,
  value,
  onChange,
}: {
  answer: AnswerType;
  question: string;
  value: string | string[] | number | undefined;
  /** Receives an updater so quick repeated taps never lose a selection. */
  onChange: (update: (prev: string | string[] | number | undefined) => string | string[] | number) => void;
}) {
  const id = useId();

  if (answer.kind === "chips") {
    const selected = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    const toggle = (o: string) => {
      if (answer.multiple) {
        onChange((prev) => {
          const cur = Array.isArray(prev) ? prev : [];
          return cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o];
        });
      } else {
        onChange(() => o);
      }
    };
    return (
      <div
        role={answer.multiple ? "group" : "radiogroup"}
        aria-label={question}
        className="flex flex-wrap gap-3"
      >
        {answer.options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              role={answer.multiple ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => toggle(o)}
              className={cn(
                "squish h-14 rounded-full px-6 text-lg font-semibold transition-colors",
                on ? "bg-apricot text-ink" : "bg-surface-strong hover:bg-accent",
              )}
            >
              {o}
            </button>
          );
        })}
        {answer.multiple && <p className="w-full text-base text-muted-foreground">Pick as many as you like.</p>}
      </div>
    );
  }

  if (answer.kind === "text") {
    return (
      <div>
        <label htmlFor={id} className="sr-only">
          {question}
        </label>
        <Textarea
          id={id}
          name="answer"
          autoComplete="off"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(() => v);
          }}
          placeholder={answer.placeholder}
          maxLength={answer.maxLength}
          className="min-h-32 rounded-[24px] border-0 bg-surface-strong p-5 text-lg md:text-lg placeholder:text-muted-foreground/90 focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          This stays on your screen and disappears when you leave. Nothing is saved.
        </p>
      </div>
    );
  }

  const n = typeof value === "number" ? value : Math.round((answer.min + answer.max) / 2);
  return (
    <div className="pt-4">
      <p className="mb-5 text-center font-heading text-4xl font-semibold text-apricot-text" aria-hidden>
        {n}
      </p>
      <Slider
        value={[n]}
        min={answer.min}
        max={answer.max}
        step={answer.step}
        onValueChange={(v) => onChange(() => (Array.isArray(v) ? v[0] : v))}
        aria-label={question}
        className="[&_[data-slot=slider-range]]:bg-apricot [&_[data-slot=slider-thumb]]:size-8 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-apricot [&_[data-slot=slider-thumb]]:shadow-[0_4px_14px_rgb(20_27_48/0.3)] [&_[data-slot=slider-track]]:h-3 [&_[data-slot=slider-track]]:bg-foreground/15 [&_[data-slot=slider-thumb]:has(:focus-visible)]:outline-3 [&_[data-slot=slider-thumb]:has(:focus-visible)]:outline-solid [&_[data-slot=slider-thumb]:has(:focus-visible)]:outline-offset-4 [&_[data-slot=slider-thumb]:has(:focus-visible)]:outline-[color:var(--ring)]"
      />
      <div className="mt-3 flex justify-between text-base text-muted-foreground">
        <span>{answer.minLabel}</span>
        <span>{answer.maxLabel}</span>
      </div>
    </div>
  );
}
