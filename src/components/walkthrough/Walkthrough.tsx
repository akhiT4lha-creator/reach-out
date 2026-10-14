"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lifebuoy } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Buddy, type BuddyState } from "@/components/avatar/Buddy";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { useCrisis } from "@/components/crisis/CrisisPanel";
import { BackgroundBlobs } from "@/components/hero/BackgroundBlobs";
import { DraftEditor } from "@/components/pulse/DraftEditor";
import { GuideAvatar } from "@/components/pulse/GuideAvatar";
import { ProcessExplorer } from "@/components/pulse/ProcessExplorer";
import { usePulse } from "@/components/pulse/PulseProvider";
import { ServiceSelect } from "@/components/pulse/ServiceSelect";
import { btn } from "@/components/pulse/ui";
import { CalmToggle, Logo, ThemeToggle } from "@/components/site/SiteNav";
import { StoryModal } from "@/components/stories/StoryModal";
import { guides, type GuideId } from "@/data/pulse/guides";
import { getService } from "@/data/pulse/services";
import { genuineStories, stories, type Story } from "@/data/stories";
import { buddyLines, honesty, startChoices, type Stage } from "@/data/walkthrough";
import { cn } from "@/lib/utils";
import { ProgressPath } from "./ProgressPath";
import { SpeechBubble } from "./SpeechBubble";

// PULSE's guided start, in Reach Out's walkthrough layout. Choices open real features directly.
// Nothing here is stored: all choices live in page memory.

const titles: Record<Stage, string> = {
  options: "What would be useful right now?",
  unsure: "Not sure? Start small.",
  guides: "What kind of conversation do you prefer?",
  process: "What happens first",
  draft: "Your first question",
  stories: "Someone’s first step",
};

export function Walkthrough() {
  const pulse = usePulse();
  const { startStage, consumeStartStage, chatSeed, takeChatSeed, service, startChat, openPanel } = pulse;
  const { open: openCrisis } = useCrisis();
  const [stage, setStage] = useState<Stage>(startStage);
  const [cameFromUnsure, setCameFromUnsure] = useState(false);
  const [seed, setSeed] = useState(chatSeed);
  const [picked, setPicked] = useState<GuideId>("ari");
  const [story, setStory] = useState<Story | null>(null);
  const [typing, setTyping] = useState(false);
  const moved = useRef(false);
  const svc = getService(service);

  // Opened from elsewhere with a target stage and starter question: take them once.
  useEffect(() => {
    consumeStartStage();
    if (chatSeed) takeChatSeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusHeading = useCallback((el: HTMLHeadingElement | null) => {
    if (el && moved.current) {
      el.focus();
      moved.current = false;
    }
  }, []);
  const onTypingChange = useCallback((t: boolean) => setTyping(t), []);

  const go = (s: Stage) => {
    moved.current = true;
    setStage(s);
  };
  const back = () => {
    if (stage === "guides" && cameFromUnsure) {
      setCameFromUnsure(false);
      go("unsure");
    } else go("options");
  };

  const isTool = stage !== "options" && stage !== "unsure";
  const line = buddyLines[stage];
  const buddyState: BuddyState = typing ? "talking" : stage === "draft" ? "happy" : "idle";
  const g = guides.find((x) => x.id === picked)!;

  return (
    <div className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <BackgroundBlobs className="opacity-70" />

      <header className="relative z-10 px-4 pt-3 md:px-6">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3">
          <Logo />
          <div className="hidden sm:block">
            <ProgressPath current={isTool ? 2 : 1} total={2} />
          </div>
          <div className="flex items-center gap-2">
            <CalmToggle compact />
            <ThemeToggle />
            <CrisisButton className="hidden md:inline-flex" />
          </div>
        </div>
      </header>

      <main id="main" className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-28 pt-6 md:px-6 md:pb-10 md:pt-10">
        <div className="grid flex-1 gap-6 [grid-template-areas:'bubble'_'answer'_'buddy'] md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-x-12 md:[grid-template-areas:'bubble_answer'_'buddy_answer']">
          <div className="[grid-area:bubble] md:self-end">
            <SpeechBubble key={line} text={line} onTypingChange={onTypingChange} />
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              Buddy says: {line}
            </p>
          </div>

          <div className="flex items-end [grid-area:buddy] md:items-start md:pl-10">
            <div>
              <Buddy state={buddyState} bump={startChoices.findIndex((c) => c.stage === stage) + 1} className="w-24 md:w-48" />
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">{honesty}</p>
            </div>
          </div>

          <div className="flex flex-col [grid-area:answer] md:justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-labelledby={`start-${stage}`}
                className="rounded-[32px] bg-surface p-6 md:p-9"
              >
                <p className="text-base font-semibold text-muted-foreground">{isTool ? "Step 2 · Open a tool" : "Step 1 · Choose a useful path"}</p>
                <h1 ref={focusHeading} tabIndex={-1} id={`start-${stage}`} className="mt-1 text-3xl font-semibold outline-none md:text-4xl">
                  {titles[stage]}
                </h1>

                {stage === "options" && (
                  <ul className="mt-6 grid gap-3">
                    {startChoices.map((c) => (
                      <li key={c.stage}>
                        <ChoiceButton title={c.title} detail={c.detail} onClick={() => go(c.stage)} />
                      </li>
                    ))}
                  </ul>
                )}

                {stage === "unsure" && (
                  <>
                    <p className="mt-3 text-muted-foreground">
                      You can see what contacting support involves, or choose an AI guide and try a process question.
                    </p>
                    <div className="mt-6 grid gap-3">
                      <ChoiceButton title="Show me the support process" detail="Explore the steps and their sources." onClick={() => go("process")} />
                      <ChoiceButton
                        title="Try a starter question"
                        detail="Choose a guide. You can edit the question before sending."
                        onClick={() => {
                          setSeed(svc.guideQuestion);
                          setCameFromUnsure(true);
                          go("guides");
                        }}
                      />
                    </div>
                  </>
                )}

                {stage === "guides" && (
                  <>
                    <p className="mt-3 text-muted-foreground">All seven share the same knowledge and capabilities. This is a style preference, not an assessment.</p>
                    <div role="group" aria-label="Guide styles" className="mt-5 grid gap-2 sm:grid-cols-2">
                      {guides.map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={picked === x.id}
                          onClick={() => setPicked(x.id)}
                          className={cn(
                            "squish flex items-center gap-3 rounded-[22px] p-2 pr-4 text-left transition-colors",
                            picked === x.id ? "bg-lavender text-ink" : "bg-surface-strong hover:bg-accent",
                          )}
                        >
                          <GuideAvatar id={x.id} size={40} decorative />
                          <span>
                            <span className="block font-heading font-semibold">{x.name}</span>
                            <span className={cn("block text-sm", picked === x.id ? "text-ink/80" : "text-muted-foreground")}>{x.role}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-4 rounded-[24px] bg-lavender/15 p-4">
                      <GuideAvatar id={g.id} size={64} decorative className="blob" />
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Example of {g.name}’s voice</p>
                        <p className="font-heading text-xl leading-snug">&ldquo;{g.sampleOpening}&rdquo;</p>
                        <p className="text-sm text-muted-foreground">Illustrative wording, not a generated reply.</p>
                      </div>
                    </div>
                    {seed && (
                      <p className="mt-4 text-base">
                        <span className="font-semibold">Starting question: </span>
                        {seed} <span className="text-muted-foreground">(you can edit it in the chat)</span>
                      </p>
                    )}
                    <button type="button" onClick={() => startChat(g.id, seed || svc.guideQuestion)} className={`${btn.primary} mt-5`}>
                      Start with {g.name} <ArrowUpRight size={20} weight="bold" aria-hidden />
                    </button>
                    <p className="mt-3 text-sm text-muted-foreground">Opening a guide starts a new chat. A connected AI model is needed to send questions.</p>
                  </>
                )}

                {stage === "process" && (
                  <div className="mt-5 space-y-5">
                    <ServiceSelect />
                    <ProcessExplorer
                      onDraft={() => go("draft")}
                      onGuide={() => {
                        setSeed(svc.guideQuestion);
                        go("guides");
                      }}
                    />
                  </div>
                )}

                {stage === "draft" && (
                  <div className="mt-5">
                    <DraftEditor
                      onReview={() => {
                        setSeed("Help me refine the wording of my first question.");
                        go("guides");
                      }}
                    />
                  </div>
                )}

                {stage === "stories" && (
                  <>
                    <p className="mt-3 text-muted-foreground">
                      {genuineStories.length === 0
                        ? "No real contributions have been published yet. These examples were written for this prototype."
                        : "Personal experiences, shared with permission."}
                    </p>
                    <ul className="mt-5 grid gap-3">
                      {stories.slice(0, 3).map((s, i) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => setStory(s)}
                            className={cn(
                              "squish flex w-full items-center gap-4 rounded-[24px] p-4 text-left hover:bg-surface-strong",
                              ["bg-lavender/15", "bg-sky/15", "bg-sage/15"][i],
                            )}
                          >
                            <StoryAvatar seed={s.avatarSeed} size={48} decorative />
                            <span className="min-w-0">
                              <span className="block font-heading text-lg font-semibold">
                                {s.displayName}, {s.age} <span className="text-sm font-normal text-muted-foreground">· example</span>
                              </span>
                              <span className="line-clamp-2 text-base text-muted-foreground">{s.opening}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/#stories" className={btn.secondary}>
                        All stories
                      </Link>
                      <button type="button" onClick={() => go("draft")} className={btn.primarySm}>
                        Prepare my own question <ArrowRight size={18} weight="bold" aria-hidden />
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5">
                  <button type="button" disabled={stage === "options"} onClick={back} className={btn.ghost}>
                    <ArrowLeft size={18} weight="bold" aria-hidden /> Back
                  </button>
                  <div className="flex flex-wrap items-center gap-1">
                    <Link href="/" className={btn.ghost}>
                      Skip · explore freely
                    </Link>
                    <button type="button" onClick={openCrisis} className={btn.ghost}>
                      <Lifebuoy size={18} weight="duotone" aria-hidden /> Urgent help
                    </button>
                  </div>
                </div>
                {stage === "process" && (
                  <button type="button" onClick={() => openPanel("how")} className={`${btn.link} mt-2 text-base`}>
                    How PULSE uses sources
                  </button>
                )}
              </motion.section>
            </AnimatePresence>
          </div>
        </div>
      </main>
      <StoryModal story={story} onClose={() => setStory(null)} />
    </div>
  );
}

function ChoiceButton({ title, detail, onClick }: { title: string; detail: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="squish group flex w-full items-center justify-between gap-4 rounded-[24px] bg-surface-strong px-5 py-4 text-left transition-colors hover:bg-accent"
    >
      <span>
        <span className="block font-heading text-lg font-semibold">{title}</span>
        <span className="block text-base text-muted-foreground">{detail}</span>
      </span>
      <ArrowRight size={20} weight="bold" aria-hidden className="shrink-0 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
