"use client";

import { useEffect, useState } from "react";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils";

// Buddy's speech bubble. The text types in gently and can be skipped with the
// "Show all" button. In Calm mode it appears instantly. The typed text is hidden from
// screen readers; the parent announces the full line once via a persistent aria-live region.
// Render with key={text} so each new line types from the start.

export function SpeechBubble({
  text,
  onTypingChange,
  className,
}: {
  text: string;
  onTypingChange?: (typing: boolean) => void;
  className?: string;
}) {
  const { calm } = useMotionPrefs();
  // The parent keys this component by `text`, so a new line starts fresh.
  const [typed, setShown] = useState(0);
  const shown = calm ? text.length : typed;
  const typing = shown < text.length;

  useEffect(() => {
    onTypingChange?.(typing);
  }, [typing, onTypingChange]);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setShown((n) => Math.min(text.length, n + 1)), 28);
    return () => clearTimeout(t);
  }, [shown, typing, text.length]);

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative rounded-[28px] bg-surface-strong p-5 font-heading text-xl leading-snug shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur md:p-7 md:text-2xl"
      >
        {/* visual text, with the full line reserved underneath so the bubble never jumps in size */}
        <span aria-hidden className="grid">
          <span className="invisible col-start-1 row-start-1">{text}</span>
          <span className="col-start-1 row-start-1">
            {text.slice(0, shown)}
            {typing && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-[3px] rounded-full bg-apricot" />}
          </span>
        </span>
        {/* tail pointing down at Buddy (desktop, where Buddy sits under the bubble) */}
        <span
          aria-hidden
          className="absolute left-24 top-full hidden h-5 w-7 bg-surface-strong [clip-path:polygon(0_0,100%_0,25%_100%)] md:block"
        />
      </div>
      {/* space stays reserved so Buddy doesn't jump when typing finishes */}
      <button
        type="button"
        onClick={() => setShown(text.length)}
        tabIndex={typing ? 0 : -1}
        aria-hidden={!typing}
        className={cn(
          "ml-auto mt-2 block rounded-full px-3 py-1 text-base font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground",
          !typing && "invisible",
        )}
      >
        Show all
      </button>
    </div>
  );
}
