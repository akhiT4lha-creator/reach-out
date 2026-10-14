"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, EnvelopeSimple, Leaf, ShieldCheck, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { avatarChoices, StoryAvatar } from "@/components/avatar/StoryAvatar";
import { Buddy } from "@/components/avatar/Buddy";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Celebration } from "@/components/walkthrough/Celebration";
import { addSubmission } from "@/lib/submissions";
import { cn } from "@/lib/utils";

const ageRanges = ["Under 13", "13 to 15", "16 to 18", "19 to 21", "22 to 25"];
const people = ["A friend", "Family", "A teacher", "School counsellor", "A GP", "A helpline", "Someone else"];
// Demo only: no email is ever sent. The code is shown on screen.
const DEMO_CODE = "123456";

type Form = {
  displayName: string;
  ageRange: string;
  reachedOutTo: string;
  story: string;
  avatarSeed: string;
  email: string;
  code: string;
  consent: boolean;
};

const empty: Form = {
  displayName: "",
  ageRange: "",
  reachedOutTo: "",
  story: "",
  avatarSeed: avatarChoices[0],
  email: "",
  code: "",
  consent: false,
};

const QUESTIONS = 8;
const fieldClass =
  "h-14 rounded-[20px] border-0 bg-surface-strong px-5 text-lg md:text-lg placeholder:text-muted-foreground/90 focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]";

export function ShareFlow({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState(0);
  const [f, setF] = useState<Form>(empty);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const moved = useRef(false);
  const id = useId();
  const errId = `${id}-err`;

  // Move focus to the new question's heading, but only after the visitor moves (never on page load).
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && moved.current) {
      el.focus({ preventScroll: false });
      moved.current = false;
    }
  }, []);
  const goTo = (n: number) => {
    moved.current = true;
    setQ(n);
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  function validate(): string | null {
    switch (q) {
      case 1:
        return f.ageRange ? null : "Pick the age range that fits you.";
      case 2:
        return f.reachedOutTo ? null : "Choose who you reached out to.";
      case 3:
        return f.story.trim().length >= 40 ? null : "Write a little more, even a few sentences is perfect.";
      case 5:
        return /^[^\s@,;<>]+@[^\s@,;<>]+\.[a-z]{2,}$/i.test(f.email.trim()) ? null : "Enter an email address like name@example.com.";
      case 6:
        return f.code.trim() === DEMO_CODE ? null : "That code doesn't match. For this demo it's 123456.";
      case 7:
        return f.consent ? null : "Please tick the box so we know it's OK to review and share your story.";
      default:
        return null;
    }
  }

  function next() {
    const e = validate();
    if (e) {
      setError(e);
      return;
    }
    if (q < QUESTIONS - 1) {
      goTo(q + 1);
      return;
    }
    addSubmission({
      displayName: f.displayName.trim() || "Anonymous",
      ageRange: f.ageRange,
      reachedOutTo: f.reachedOutTo,
      story: f.story.trim(),
      avatarSeed: f.avatarSeed,
      email: f.email.trim(),
      emailVerified: true,
      consent: true,
    });
    moved.current = true;
    setDone(true);
  }

  const errorProps = error ? { "aria-invalid": true, "aria-describedby": errId } : {};

  if (done) {
    return (
      <div className="relative overflow-hidden rounded-[32px] bg-surface p-8 text-center md:p-12">
        <Celebration />
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
          <Buddy state="happy" className="mx-auto w-32 md:w-40" />
          <h3 ref={headingRef} tabIndex={-1} className="mt-4 scroll-mt-60 text-3xl font-semibold outline-none">
            Thank you for sharing.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            A real person reads every story before anything goes up. Nothing you sent is on the site yet, and we&apos;ll
            only use your email to check it&apos;s genuine.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setF(empty);
                goTo(0);
                setDone(false);
              }}
              className="squish h-12 rounded-full bg-surface-strong px-5 font-semibold hover:bg-accent"
            >
              Share another
            </button>
            <Link href="/" className="squish inline-flex h-12 items-center rounded-full bg-apricot px-5 font-semibold text-ink">
              Back to stories
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("relative grid gap-6 rounded-[32px] bg-surface p-6 md:p-10", !compact && "md:grid-cols-[180px_1fr] md:gap-10")}>
      <div className={cn("flex items-center gap-4", !compact && "md:flex-col md:items-start")}>
        <Buddy state={q === 3 ? "talking" : "idle"} bump={q} className="w-20 shrink-0 md:w-32" />
        <p className="text-base text-muted-foreground">
          {q < 3 ? "Take your time. Skip anything optional." : q < 5 ? "Write it like a note to a friend." : "Almost done."}
        </p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="min-w-0"
      >
        {/* progress */}
        <div className="mb-6 flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: QUESTIONS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 rounded-full transition-[background-color,opacity] duration-500",
                i === q ? "w-8 bg-apricot" : "w-2",
                i < q ? "bg-sage" : i > q ? "bg-foreground/20" : "",
              )}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Question {q + 1} of {QUESTIONS}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={q}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[260px]"
          >
            {q === 0 && (
              <Field title="What should we call you?" hint="Optional. A nickname or made-up name is great." headingRef={headingRef} htmlFor={`${id}-name`}>
                <Input
                  id={`${id}-name`}
                  name="nickname"
                  value={f.displayName}
                  onChange={(e) => set("displayName", e.target.value)}
                  placeholder="e.g. Sky…"
                  autoComplete="off"
                  maxLength={30}
                  className={fieldClass}
                />
              </Field>
            )}

            {q === 1 && (
              <Field title="How old are you?" hint="Just a range, so readers know it's someone like them." headingRef={headingRef} htmlFor={`${id}-age`}>
                <select
                  id={`${id}-age`}
                  name="ageRange"
                  value={f.ageRange}
                  onChange={(e) => set("ageRange", e.target.value)}
                  className={cn(fieldClass, "w-full appearance-none [&_option]:bg-popover [&_option]:text-popover-foreground bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat outline-none")}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a99fbd' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                  {...errorProps}
                >
                  <option value="" disabled>
                    Choose an age range
                  </option>
                  {ageRanges.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {q === 2 && (
              <Field title="Who did you reach out to?" headingRef={headingRef} groupLabel>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Who did you reach out to?" {...errorProps}>
                  {people.map((p) => (
                    <Chip key={p} selected={f.reachedOutTo === p} onClick={() => set("reachedOutTo", p)}>
                      {p}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}

            {q === 3 && (
              <Field title="Tell us what happened." headingRef={headingRef} htmlFor={`${id}-story`}>
                <ul className="mb-4 grid gap-2 text-base">
                  <Tip icon={<Leaf size={20} weight="duotone" />}>Focus on what helped, and how reaching out went.</Tip>
                  <Tip icon={<ShieldCheck size={20} weight="duotone" />}>Leave out details of harm. Hope is what helps others most.</Tip>
                  <Tip icon={<Sparkle size={20} weight="duotone" />}>Don&apos;t include anything that could identify you or anyone else.</Tip>
                </ul>
                <Textarea
                  id={`${id}-story`}
                  name="story"
                  autoComplete="off"
                  value={f.story}
                  onChange={(e) => set("story", e.target.value)}
                  placeholder="What made you reach out, and what happened after…"
                  maxLength={2000}
                  className="min-h-40 rounded-[24px] border-0 bg-surface-strong p-5 text-lg md:text-lg placeholder:text-muted-foreground/90 focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                  {...errorProps}
                />
                <p className="mt-2 text-right text-sm text-muted-foreground">{f.story.length} / 2000</p>
              </Field>
            )}

            {q === 4 && (
              <Field title="Pick an avatar." hint="It'll appear next to your story instead of a photo." headingRef={headingRef} groupLabel>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6" role="radiogroup" aria-label="Pick an avatar">
                  {avatarChoices.map((seed, i) => (
                    <button
                      key={seed}
                      type="button"
                      role="radio"
                      aria-checked={f.avatarSeed === seed}
                      aria-label={`Avatar ${i + 1}`}
                      onClick={() => set("avatarSeed", seed)}
                      className={cn(
                        "squish grid place-items-center rounded-full p-1 transition-[box-shadow,opacity]",
                        f.avatarSeed === seed ? "shadow-[0_0_0_3px_var(--apricot)]" : "opacity-80 hover:opacity-100",
                      )}
                    >
                      <StoryAvatar seed={seed} size={72} decorative />
                    </button>
                  ))}
                </div>
              </Field>
            )}

            {q === 5 && (
              <Field
                title="What's your email?"
                hint="Only our moderators see this, to check your story is real. It's never shown on the site."
                headingRef={headingRef}
                htmlFor={`${id}-email`}
              >
                <div className="relative">
                  <EnvelopeSimple size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={f.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="name@example.com"
                    className={cn(fieldClass, "pl-14")}
                    {...errorProps}
                  />
                </div>
              </Field>
            )}

            {q === 6 && (
              <Field
                title="Check your inbox."
                hint={`We'd normally email a 6-digit code to ${f.email || "you"}.`}
                headingRef={headingRef}
                htmlFor={`${id}-code`}
              >
                <p className="mb-4 rounded-[20px] bg-lavender/20 px-5 py-3 text-base">
                  Demo only: nothing is sent. Your code is <strong className="font-heading tracking-widest">123456</strong>.
                </p>
                <Input
                  id={`${id}-code`}
                  name="code"
                  spellCheck={false}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={f.code}
                  onChange={(e) => set("code", e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code…"
                  className={cn(fieldClass, "max-w-xs text-center font-heading text-2xl tracking-[0.4em] md:text-2xl")}
                  {...errorProps}
                />
              </Field>
            )}

            {q === 7 && (
              <Field title="One last thing." headingRef={headingRef} groupLabel>
                <div className="flex items-center gap-4 rounded-[24px] bg-surface-strong p-5">
                  <StoryAvatar seed={f.avatarSeed} size={56} decorative />
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-semibold">
                      {f.displayName.trim() || "Anonymous"}, {f.ageRange}
                    </p>
                    <p className="line-clamp-2 text-base text-muted-foreground">{f.story}</p>
                  </div>
                </div>
                <label className="mt-5 flex cursor-pointer items-start gap-4 rounded-[20px] p-2 text-lg">
                  <Checkbox
                    checked={f.consent}
                    onCheckedChange={(c) => set("consent", c === true)}
                    className="mt-1 size-6 rounded-lg border-2 border-foreground/40 data-checked:border-apricot data-checked:bg-apricot data-checked:text-ink [&_svg]:size-4"
                    {...errorProps}
                  />
                  <span>I&apos;m happy for this to be shared on the site after it&apos;s been reviewed.</span>
                </label>
              </Field>
            )}
          </motion.div>
        </AnimatePresence>

        <p id={errId} role="alert" className="min-h-7 text-base font-semibold text-apricot-text">
          {error}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setError(null);
              goTo(Math.max(0, q - 1));
            }}
            className={cn("squish inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface-strong", q === 0 && "invisible")}
          >
            <ArrowLeft size={18} weight="bold" aria-hidden /> Back
          </button>
          <button type="submit" className="squish inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-apricot px-6 font-semibold text-ink">
            {q === QUESTIONS - 1 ? (
              <>
                Send for review <CheckCircle size={20} weight="bold" aria-hidden />
              </>
            ) : q === 0 && !f.displayName.trim() ? (
              <>
                Skip <ArrowRight size={18} weight="bold" aria-hidden />
              </>
            ) : (
              <>
                Next <ArrowRight size={18} weight="bold" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  title,
  hint,
  children,
  headingRef,
  htmlFor,
  groupLabel,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  headingRef: React.Ref<HTMLHeadingElement>;
  htmlFor?: string;
  groupLabel?: boolean;
}) {
  return (
    <div>
      <h3 ref={headingRef} tabIndex={-1} className="scroll-mt-32 text-2xl font-semibold outline-none md:text-3xl">
        {htmlFor && !groupLabel ? <label htmlFor={htmlFor}>{title}</label> : title}
      </h3>
      {hint && <p className="mt-2 text-base text-muted-foreground">{hint}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Chip({ selected, children, ...props }: { selected: boolean } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        "squish h-12 rounded-full px-5 text-base font-semibold transition-colors",
        selected ? "bg-apricot text-ink" : "bg-surface-strong hover:bg-accent",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Tip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-[18px] bg-sage/15 px-4 py-2.5">
      <span className="mt-0.5 shrink-0 text-sage-text" aria-hidden>
        {icon}
      </span>
      {children}
    </li>
  );
}
