"use client";

import { motion } from "framer-motion";
import {
  ArrowArcLeft,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpenText,
  Info,
  ListBullets,
  PencilSimpleLine,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Buddy } from "@/components/avatar/Buddy";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { useCrisis } from "@/components/crisis/CrisisPanel";
import { BackgroundBlobs } from "@/components/hero/BackgroundBlobs";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { GuideAvatar } from "@/components/pulse/GuideAvatar";
import { Panel } from "@/components/pulse/Panel";
import { usePulse } from "@/components/pulse/PulseProvider";
import { ServiceSelect } from "@/components/pulse/ServiceSelect";
import { btn } from "@/components/pulse/ui";
import { CalmToggle, Logo, ThemeToggle } from "@/components/site/SiteNav";
import { extraStarter, guides, type Guide } from "@/data/pulse/guides";
import { DEFAULT_DRAFT } from "@/data/pulse/product";
import { getService } from "@/data/pulse/services";
import { LIMITS, type AnswerError, type AnswerRequest, type AnswerResponse, type ConnectionStatus } from "@/lib/pulse/contract";
import { cn } from "@/lib/utils";
import { ChatAnswer } from "./ChatAnswer";

// The conversation lives ONLY in this component's memory. It is never written to storage,
// and resets when the visitor refreshes, switches guide, changes service or presses Clear.

type Exchange = { question: string; answer: AnswerResponse };
type Connection = "checking" | "live" | "offline";

export function ChatApp({ guide }: { guide: Guide }) {
  const pulse = usePulse();
  const { draft, service, openPanel, takeChatSeed, chatSeed, clearSession } = pulse;
  const { open: openCrisis } = useCrisis();
  const { calm } = useMotionPrefs();
  const svc = getService(service);

  const [connection, setConnection] = useState<Connection>("checking");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [composer, setComposer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; question: string } | null>(null);
  const [seed] = useState(chatSeed);
  const [railOpen, setRailOpen] = useState(false);
  const [awayFromLatest, setAwayFromLatest] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const atBottom = useRef(true);
  /** While the chat scrolls itself, ignore scroll events so it isn't mistaken for the visitor scrolling up. */
  const autoScrollUntil = useRef(0);
  const requestId = useRef(0);
  const live = connection === "live";

  // Clear the one-off starter seed so it doesn't follow the visitor to the next chat.
  useEffect(() => {
    if (chatSeed) takeChatSeed();
    heading.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/status", { cache: "no-store" })
      .then((r) => r.json() as Promise<ConnectionStatus>)
      .then((s) => alive && setConnection(s.liveConfigured ? "live" : "offline"))
      .catch(() => alive && setConnection("offline"));
    return () => {
      alive = false;
    };
  }, []);

  // A new service means different sources: start the conversation afresh (the draft stays).
  const firstService = useRef(service);
  useEffect(() => {
    if (firstService.current === service) return;
    firstService.current = service;
    requestId.current++;
    setExchanges([]);
    setError(null);
    setLoading(false);
  }, [service]);

  const compose = useCallback((text: string) => {
    setComposer(text);
    requestAnimationFrame(() => input.current?.focus());
  }, []);

  // The draft panel's "Review wording with an AI guide" fills this composer.
  useEffect(() => {
    const on = (e: Event) => compose((e as CustomEvent<string>).detail);
    window.addEventListener("pulse:compose", on);
    return () => window.removeEventListener("pulse:compose", on);
  }, [compose]);

  const behavior = (): ScrollBehavior => (calm ? "instant" : "smooth");

  const mounted = useRef(false);
  useEffect(() => {
    const el = scroller.current;
    // Start at the top, so the welcome and any connection notice are visible.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!el) return;
    if (atBottom.current) {
      autoScrollUntil.current = Date.now() + 800;
      el.scrollTo({ top: el.scrollHeight, behavior: behavior() });
    }
    else setAwayFromLatest(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchanges.length, loading]);

  async function send(question: string) {
    const q = question.trim();
    if (!q || loading || !live) return;
    const id = ++requestId.current;
    atBottom.current = true;
    setAwayFromLatest(false);
    setLoading(true);
    setError(null);
    setComposer("");
    const body: AnswerRequest = {
      guide: guide.id,
      question: q,
      service,
      mode: "live",
      history: exchanges.slice(-LIMITS.history).map((x) => ({ question: x.question, answer: x.answer.text, entry_ids: x.answer.entry_ids })),
      draft,
    };
    try {
      const res = await fetch("/api/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json()) as AnswerResponse | AnswerError;
      if (!res.ok || "error" in data) {
        if (res.status === 503) setConnection("offline");
        throw new Error("error" in data ? data.error : "Something went wrong. Try again.");
      }
      if (id !== requestId.current) return;
      setExchanges((x) => [...x, { question: q, answer: data }]);
      if (data.draft) pulse.setDraft(data.draft);
      if (data.status === "urgent") openCrisis();
    } catch (e) {
      if (id !== requestId.current) return;
      setError({ message: e instanceof Error ? e.message : "Please try again.", question: q });
      setComposer(q);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  function clearAll() {
    const hasContent = exchanges.length > 0 || composer.trim() || draft !== DEFAULT_DRAFT;
    if (hasContent && !window.confirm("Clear this conversation and reset your first question? This can’t be undone.")) return;
    requestId.current++;
    clearSession();
  }

  const statusText =
    connection === "checking"
      ? "Checking the AI connection…"
      : live
        ? "Live AI · same knowledge, your choice of personality"
        : "AI connection unavailable";

  const rail = (onPick?: () => void) => (
    <nav aria-label="Choose an AI guide" className="grid gap-1.5">
      {guides.map((g) => {
        const here = g.id === guide.id;
        return (
          <Link
            key={g.id}
            href={`/chat/${g.id}`}
            onClick={onPick}
            aria-current={here ? "page" : undefined}
            className={cn("squish flex items-center gap-3 rounded-[22px] p-2 pr-3 transition-colors", here ? "bg-lavender/30" : "hover:bg-surface-strong")}
          >
            <GuideAvatar id={g.id} size={44} decorative />
            <span className="min-w-0">
              <span className="block font-heading text-lg font-semibold leading-tight">{g.name}</span>
              <span className="block text-sm text-muted-foreground">{g.role}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative isolate flex h-[100dvh] flex-col overflow-hidden">
      <BackgroundBlobs className="opacity-50" />

      <header className="relative z-10 px-3 pt-3 md:px-6">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 md:h-16">
          <Logo />
          <ServiceSelect compact className="hidden md:flex" />
          <div className="flex items-center gap-2">
            <CalmToggle compact />
            <ThemeToggle />
            <CrisisButton className="hidden md:inline-flex" />
            <CrisisButton variant="icon" className="md:hidden" />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-4 px-3 pb-3 md:grid-cols-[250px_minmax(0,1fr)] md:px-6 md:pb-6">
        <aside className="hidden min-h-0 flex-col overflow-y-auto rounded-[32px] bg-surface p-3 md:flex">
          <p className="px-2 pb-2 pt-1 text-sm font-semibold text-muted-foreground">Explore at your pace</p>
          {rail()}
          <div className="mt-auto grid gap-1 pt-4 [&>*]:h-11 [&>*]:whitespace-nowrap [&>*]:text-base">
            <button type="button" onClick={() => openPanel("journey")} className={cn(btn.ghost, "justify-start")}>
              <ListBullets size={18} weight="duotone" aria-hidden /> Preview the process
            </button>
            <button type="button" onClick={() => openPanel("draft")} className={cn(btn.ghost, "justify-start")}>
              <PencilSimpleLine size={18} weight="duotone" aria-hidden /> My first question
            </button>
            <Link href="/#guides" className={cn(btn.ghost, "justify-start")}>
              <ArrowArcLeft size={18} weight="duotone" aria-hidden /> All guides
            </Link>
          </div>
        </aside>

        <section aria-label={`Conversation with ${guide.name}`} className="relative flex min-h-0 flex-col overflow-hidden rounded-[32px] bg-surface">
          {/* top bar */}
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setRailOpen(true)}
                className="squish shrink-0 rounded-full md:hidden"
                aria-label={`Switch guide. Talking with ${guide.name}`}
              >
                <GuideAvatar id={guide.id} size={44} decorative />
              </button>
              <GuideAvatar id={guide.id} size={48} decorative className="hidden md:block" />
              <div className="min-w-0">
                <h1 ref={heading} tabIndex={-1} className="truncate text-xl font-semibold outline-none md:text-2xl">
                  {guide.name} <span className="font-sans text-sm font-normal text-muted-foreground">AI guide</span>
                </h1>
                <p className="truncate text-sm text-muted-foreground">{guide.role}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => openPanel("draft")} className="squish h-11 rounded-full px-2.5 text-sm font-semibold hover:bg-surface-strong md:px-3 md:text-base">
                My question
              </button>
              <button type="button" onClick={clearAll} className="squish h-11 rounded-full px-2.5 text-sm font-semibold hover:bg-surface-strong md:px-3 md:text-base" title="Clears this conversation and resets your first question">
                Clear
              </button>
            </div>
          </div>

          {/* connection status */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm text-muted-foreground md:px-6" role="status">
            <span className={cn("inline-block size-2 rounded-full", live ? "bg-sage" : connection === "checking" ? "bg-foreground/30" : "bg-apricot")} aria-hidden />
            {statusText}
            <button type="button" onClick={() => openPanel("how")} className="ml-auto inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:no-underline">
              How this works <Info size={14} weight="bold" aria-hidden />
            </button>
          </div>

          <div
            ref={scroller}
            onScroll={() => {
              const el = scroller.current;
              if (!el || Date.now() < autoScrollUntil.current) return;
              const near = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
              atBottom.current = near;
              if (near) setAwayFromLatest(false);
            }}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 md:px-8"
          >
            <div className="mx-auto max-w-3xl">
              <ServiceSelect compact className="mb-3 mt-2 md:hidden" />

              {connection === "offline" && (
                <div className="mt-3 flex items-center gap-4 rounded-[28px] bg-apricot/15 p-5">
                  <Buddy className="w-16 shrink-0 md:w-20" />
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-semibold">AI connection unavailable</p>
                    <p className="mt-1 text-base">
                      No AI model is connected to this version of PULSE, so {guide.name} can’t reply yet. You can still write a question here,
                      preview the process or prepare your first question.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5">
                      <button type="button" onClick={() => openPanel("journey")} className={btn.link}>
                        Preview the process <ArrowRight size={16} weight="bold" aria-hidden />
                      </button>
                      <button type="button" onClick={() => openPanel("draft")} className={btn.link}>
                        Prepare a question <ArrowUpRight size={16} weight="bold" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-base text-muted-foreground">
                <span>{svc.description}</span>
                <button type="button" onClick={() => openPanel("journey")} className={btn.link}>
                  See the steps <ArrowRight size={16} weight="bold" aria-hidden />
                </button>
              </div>

              <div role="log" aria-label="Guide conversation" aria-live="polite" className="mt-4 space-y-6">
                <div className={cn("rounded-[28px] p-5 md:p-7", exchanges.length ? "bg-transparent px-0 md:px-0" : "bg-surface-strong")}>
                  <p className="text-sm font-semibold text-muted-foreground">{guide.voice}</p>
                  <h2 className={cn("mt-1 font-semibold", exchanges.length ? "text-xl" : "text-2xl md:text-3xl")}>
                    {guide.name}: {guide.role.toLowerCase()}
                  </h2>
                  <p className="mt-2">{guide.intro}</p>
                  {exchanges.length === 0 && (
                    <>
                      {seed && (
                        <div className="mt-5 rounded-[22px] bg-lavender/15 p-4">
                          <p className="text-sm font-semibold text-muted-foreground">Your selected starting question</p>
                          <p className="mt-1 font-heading text-lg">{seed}</p>
                          <button type="button" onClick={() => compose(seed)} className={`${btn.link} mt-1`}>
                            Use this question <ArrowRight size={16} weight="bold" aria-hidden />
                          </button>
                        </div>
                      )}
                      <p className="mt-5 text-base text-muted-foreground">Choose a starter to put it in the box below. You can edit it before sending.</p>
                      <div className="mt-3 grid gap-2">
                        {[...guide.starters, extraStarter].map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={loading}
                            onClick={() => compose(s)}
                            className="squish flex min-h-12 items-center justify-between gap-3 rounded-[20px] bg-surface px-4 py-3 text-left font-semibold hover:bg-accent"
                          >
                            {s} <ArrowUpRight size={16} weight="bold" aria-hidden className="shrink-0" />
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-5">
                        <button type="button" onClick={() => input.current?.focus()} className={btn.link}>
                          Write my own question <ArrowRight size={16} weight="bold" aria-hidden />
                        </button>
                        <button type="button" onClick={() => openPanel("draft")} className={btn.link}>
                          Help me draft a first question <ArrowUpRight size={16} weight="bold" aria-hidden />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {exchanges.map((x, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-4">
                    <div className="ml-auto max-w-[85%] rounded-[24px] rounded-br-lg bg-apricot/25 px-5 py-4">
                      <p className="text-sm font-semibold">You</p>
                      <p className="whitespace-pre-wrap break-words">{x.question}</p>
                    </div>
                    <ChatAnswer guide={guide} answer={x.answer} isLatest={i === exchanges.length - 1} busy={loading} live={live} onCompose={compose} />
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3 text-base text-muted-foreground" role="status">
                    <Buddy state="talking" className="w-12 md:w-14" />
                    Preparing and checking your answer…
                  </div>
                )}

                {error && (
                  <div role="alert" className="rounded-[24px] bg-apricot/20 p-5">
                    <p className="font-semibold">{error.message}</p>
                    <p className="mt-1 text-base text-muted-foreground">Your question is back in the box below.</p>
                    {live && (
                      <button type="button" onClick={() => send(error.question)} className={`${btn.secondary} mt-3`}>
                        Try again
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {awayFromLatest && (
            <button
              type="button"
              onClick={() => {
                atBottom.current = true;
                setAwayFromLatest(false);
                autoScrollUntil.current = Date.now() + 800;
                scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: behavior() });
              }}
              className="squish absolute bottom-36 left-1/2 z-10 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-popover px-4 font-semibold shadow-[0_8px_24px_rgb(20_27_48/0.25)]"
            >
              Return to latest <ArrowDown size={16} weight="bold" aria-hidden />
            </button>
          )}

          <form
            className="border-t border-border px-3 pb-3 pt-3 md:px-6"
            onSubmit={(e) => {
              e.preventDefault();
              send(composer);
            }}
          >
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[26px] bg-surface-strong p-2 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[color:var(--ring)] focus-within:[outline-style:solid]">
              <label htmlFor="chat-question" className="sr-only">
                Ask about how support works
              </label>
              <textarea
                id="chat-question"
                ref={input}
                data-composer
                name="question"
                autoComplete="off"
                rows={2}
                maxLength={LIMITS.question}
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(composer);
                  }
                }}
                placeholder={live ? "What would you like to talk through?" : "Write a question (sending needs a connected AI)"}
                className="max-h-36 min-h-14 flex-1 resize-none bg-transparent px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground/90 md:text-lg"
              />
              <button
                type="submit"
                aria-label={live ? "Send question" : "Send question (unavailable: no AI model connected)"}
                disabled={loading || !live || !composer.trim()}
                className="squish grid size-12 shrink-0 place-items-center rounded-full bg-apricot text-ink disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ArrowUp size={22} weight="bold" aria-hidden />
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl px-2 text-sm text-muted-foreground">
              Keep personal details out. {guide.name} is an AI guide, not a counsellor.{" "}
              <button type="button" onClick={() => openPanel("how")} className="font-semibold underline underline-offset-4 hover:no-underline">
                Privacy &amp; how it works
              </button>
            </p>
          </form>
        </section>
      </div>

      <Panel open={railOpen} onClose={() => setRailOpen(false)} title="Switch guide" description="All seven share the same knowledge. Switching starts a new conversation; your first question stays.">
        {rail(() => setRailOpen(false))}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setRailOpen(false);
              openPanel("journey");
            }}
            className={btn.secondary}
          >
            <BookOpenText size={18} weight="duotone" aria-hidden /> Preview the process
          </button>
          <Link href="/#guides" onClick={() => setRailOpen(false)} className={btn.secondary}>
            All guides
          </Link>
        </div>
      </Panel>
    </div>
  );
}
