"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpenText, Lifebuoy, ArrowCounterClockwise } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Buddy, type BuddyState } from "@/components/avatar/Buddy";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { useCrisis } from "@/components/crisis/CrisisPanel";
import { BackgroundBlobs } from "@/components/hero/BackgroundBlobs";
import { CalmToggle, Logo, ThemeToggle } from "@/components/site/SiteNav";
import { getAvatarLine, intro, steps, TOTAL_STEPS, type Answers } from "@/data/walkthrough";
import { stories } from "@/data/stories";
import { Celebration } from "./Celebration";
import { ProgressPath } from "./ProgressPath";
import { SpeechBubble } from "./SpeechBubble";
import { StepAnswer } from "./StepAnswer";

// Answers live ONLY in this component's memory. They are never stored or sent,
// and vanish when the visitor leaves the page or closes the tab.

export function Walkthrough() {
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = steps
  const [answers, setAnswers] = useState<Answers>({});
  const [line, setLine] = useState(intro.avatarLine);
  const [typing, setTyping] = useState(false);
  const stepChanged = useRef(false);
  const { open: openCrisis } = useCrisis();

  const current = steps.find((s) => s.id === step);
  const isFinale = step === TOTAL_STEPS;

  useEffect(() => {
    let alive = true;
    getAvatarLine(step, answers).then((l) => alive && setLine(l));
    return () => {
      alive = false;
    };
    // Buddy's line is fetched per step; answers are passed as context for the future model.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // After a step change, move keyboard focus to the new step's heading (once it has mounted).
  const focusHeading = useCallback((el: HTMLHeadingElement | null) => {
    if (el && stepChanged.current) {
      el.focus();
      stepChanged.current = false;
    }
  }, []);

  const onTypingChange = useCallback((t: boolean) => setTyping(t), []);

  const buddyState: BuddyState = isFinale ? "happy" : typing ? "talking" : "idle";
  const go = (n: number) => {
    stepChanged.current = true;
    setStep(Math.min(TOTAL_STEPS, Math.max(0, n)));
  };
  const hasAnswer = current ? answers[current.id] !== undefined && answers[current.id] !== "" && !(Array.isArray(answers[current.id]) && (answers[current.id] as string[]).length === 0) : false;
  const storyPick = stories[(Object.keys(answers).length * 3) % stories.length];

  return (
    <div className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <BackgroundBlobs className="opacity-70" />

      <header className="relative z-10 px-4 pt-3 md:px-6">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3">
          <Logo />
          <div className="hidden sm:block">{step > 0 && <ProgressPath current={step} total={TOTAL_STEPS} />}</div>
          <div className="flex items-center gap-2">
            <CalmToggle compact />
            <ThemeToggle />
            <CrisisButton className="hidden md:inline-flex" />
          </div>
        </div>
        {step > 0 && (
          <div className="mt-2 flex justify-center sm:hidden">
            <ProgressPath current={step} total={TOTAL_STEPS} />
          </div>
        )}
      </header>

      <main id="main" className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-28 pt-6 md:px-6 md:pb-10 md:pt-10">
        {isFinale && <Celebration key="party" />}

        <div className="grid flex-1 gap-6 [grid-template-areas:'bubble'_'answer'_'buddy'] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-x-14 md:[grid-template-areas:'bubble_answer'_'buddy_answer']">
          {/* Buddy's speech bubble */}
          <div className="[grid-area:bubble] md:self-end">
            <SpeechBubble key={line} text={line} onTypingChange={onTypingChange} />
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              Buddy says: {line}
            </p>
          </div>

          {/* Buddy */}
          <div className="flex items-end [grid-area:buddy] md:items-start md:pl-10">
            <div className="relative">
              <Buddy state={buddyState} bump={step} className="w-28 md:w-56" />
            </div>
          </div>

          {/* Interaction area */}
          <div className="flex flex-col [grid-area:answer] md:justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-labelledby={`wt-title-${step}`}
                className="rounded-[32px] bg-surface p-6 md:p-9"
              >
                {step === 0 && (
                  <>
                    <h1 ref={focusHeading} tabIndex={-1} id="wt-title-0" className="outline-none text-3xl font-semibold md:text-4xl">
                      Let&apos;s take one small step.
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                      Five short moments, about two minutes. You can skip anything, go back, or stop whenever you like.
                    </p>
                    <p className="mt-5 rounded-[20px] bg-lavender/15 px-5 py-4 text-base">{intro.honesty}</p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <button type="button" onClick={() => go(1)} className="squish inline-flex h-14 items-center gap-2 rounded-full bg-apricot px-7 text-lg font-semibold text-ink">
                        Let&apos;s start <ArrowRight size={20} weight="bold" aria-hidden />
                      </button>
                      <Link href="/" className="rounded-full px-4 py-3 font-semibold hover:bg-surface-strong">
                        Not right now
                      </Link>
                    </div>
                  </>
                )}

                {current && !isFinale && current.question && current.answer && (
                  <>
                    <h2 ref={focusHeading} tabIndex={-1} id={`wt-title-${step}`} className="outline-none text-2xl font-semibold md:text-3xl">
                      {current.question}
                    </h2>
                    <div className="mt-6">
                      <StepAnswer
                        answer={current.answer}
                        question={current.question}
                        value={answers[current.id]}
                        onChange={(update) => setAnswers((a) => ({ ...a, [current.id]: update(a[current.id]) }))}
                      />
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-3">
                      <button type="button" onClick={() => go(step - 1)} className="squish inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface-strong">
                        <ArrowLeft size={18} weight="bold" aria-hidden /> Back
                      </button>
                      <button type="button" onClick={() => go(step + 1)} className="squish inline-flex h-14 items-center gap-2 rounded-full bg-apricot px-7 text-lg font-semibold text-ink">
                        {hasAnswer ? "Next" : "Skip"} <ArrowRight size={20} weight="bold" aria-hidden />
                      </button>
                    </div>
                  </>
                )}

                {isFinale && (
                  <>
                    <h2 ref={focusHeading} tabIndex={-1} id={`wt-title-${step}`} className="outline-none text-3xl font-semibold md:text-4xl">
                      That&apos;s a real first step.
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      Whenever you feel ready, the people who care about you would want to hear from you.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href={`/stories/${storyPick.id}`} className="squish inline-flex h-14 items-center gap-2 rounded-full bg-apricot px-6 text-lg font-semibold text-ink">
                        <BookOpenText size={22} weight="duotone" aria-hidden /> Read someone&apos;s story
                      </Link>
                      <button type="button" onClick={openCrisis} className="squish inline-flex h-14 items-center gap-2 rounded-full bg-sage px-6 text-lg font-semibold text-ink">
                        <Lifebuoy size={22} weight="duotone" aria-hidden /> Find support
                      </button>
                    </div>
                    <p className="mt-6 rounded-[20px] bg-lavender/15 px-5 py-4 text-base">{intro.honesty}</p>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <button type="button" onClick={() => go(step - 1)} className="squish inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface-strong">
                        <ArrowLeft size={18} weight="bold" aria-hidden /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAnswers({});
                          go(0);
                        }}
                        className="squish inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface-strong"
                      >
                        <ArrowCounterClockwise size={18} weight="bold" aria-hidden /> Start again
                      </button>
                    </div>
                  </>
                )}
              </motion.section>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
