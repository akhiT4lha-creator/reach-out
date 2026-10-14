"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, EnvelopeSimple, Leaf, LockSimple, ShieldCheck, Sparkle } from "@phosphor-icons/react";
import { useCallback, useId, useRef, useState } from "react";
import { avatarChoices, StoryAvatar } from "@/components/avatar/StoryAvatar";
import { Buddy } from "@/components/avatar/Buddy";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storyBoundary } from "@/data/stories";
import { cn } from "@/lib/utils";

// SHARING PREVIEW. Submissions are closed: there is no secure storage, human moderation or
// withdrawal route yet. Nothing here is sent, verified, saved to browser storage or published.
// The draft lives in this component's memory and is gone when the visitor leaves the page.

type Display = "anonymous" | "pseudonym" | "first-name";

type Form = {
  reachedOutTo: string;
  story: string;
  whatHelped: string;
  display: Display;
  name: string;
  avatarSeed: string;
  email: string;
  consent: boolean;
};

const empty: Form = {
  reachedOutTo: "",
  story: "",
  whatHelped: "",
  display: "anonymous",
  name: "",
  avatarSeed: avatarChoices[0],
  email: "",
  consent: false,
};

const people = ["A friend", "Family", "A teacher", "School counsellor", "A GP", "A helpline", "Someone else"];
const STEPS = ["Your first step", "How you appear publicly", "Optional private follow-up", "Review and consent"];
const displayOptions: [Display, string][] = [
  ["anonymous", "Anonymous to readers"],
  ["pseudonym", "A pseudonym"],
  ["first-name", "A public first name (optional)"],
];

const fieldClass =
  "h-14 rounded-[20px] border-0 bg-surface-strong px-5 text-lg md:text-lg placeholder:text-muted-foreground/90 focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]";
const areaClass =
  "rounded-[24px] border-0 bg-surface-strong p-5 text-lg md:text-lg placeholder:text-muted-foreground/90 focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]";

function attribution(f: Form) {
  return f.display === "anonymous" ? "Anonymous" : f.name.trim() || "Anonymous";
}

function validate(step: number, f: Form) {
  if (step === 0 && !f.story.trim()) return "Add a few words to try the publication preview. You don’t need a positive ending.";
  if (step === 1 && f.display === "pseudonym" && !f.name.trim()) return "Enter a pseudonym, or choose anonymous publication.";
  if (step === 2 && f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    return "Check the email format, or leave this optional field empty.";
  return null;
}

export function ShareFlow({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState(0);
  const [f, setF] = useState<Form>(empty);
  const [error, setError] = useState<string | null>(null);
  const moved = useRef(false);
  const id = useId();
  const errId = `${id}-err`;

  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && moved.current) {
      el.focus({ preventScroll: false });
      moved.current = false;
    }
  }, []);
  const goTo = (n: number) => {
    moved.current = true;
    setError(null);
    setQ(n);
  };

  // Any edit withdraws the preview consent tick, so consent always matches what is shown.
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v, ...(k === "consent" ? {} : { consent: false }) }));
    setError(null);
  };

  function next() {
    const e = validate(q, f);
    if (e) return setError(e);
    if (q < STEPS.length - 1) goTo(q + 1);
  }

  const errorProps = error ? { "aria-invalid": true, "aria-describedby": errId } : {};

  return (
    <div className={cn("relative grid gap-6 rounded-[32px] bg-surface p-6 md:p-10", !compact && "md:grid-cols-[180px_1fr] md:gap-10")}>
      <div className={cn("flex items-center gap-4", !compact && "md:flex-col md:items-start")}>
        <Buddy state={q === 0 ? "talking" : q === 3 ? "happy" : "idle"} bump={q} className="w-20 shrink-0 md:w-32" />
        <div>
          <p className="inline-block rounded-full bg-apricot/25 px-3 py-0.5 text-sm font-semibold">Sharing preview · submissions closed</p>
          <p className="mt-1 text-base text-muted-foreground">
            Try it with made-up details. Nothing is sent, saved or published. Leaving the page clears it.
          </p>
        </div>
      </div>

      <form
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="min-w-0"
      >
        <ol className="mb-6 flex items-center gap-1.5" aria-label="Sharing progress">
          {STEPS.map((s, i) => (
            <li
              key={s}
              aria-current={i === q ? "step" : undefined}
              className={cn(
                "h-2 rounded-full transition-[background-color,opacity] duration-500",
                i === q ? "w-8 bg-apricot" : "w-2",
                i < q ? "bg-sage" : i > q ? "bg-foreground/20" : "",
              )}
            >
              <span className="sr-only">
                Step {i + 1}: {s}
              </span>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={q}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[260px]"
          >
            <p className="text-sm font-semibold text-muted-foreground">
              Step {q + 1} of {STEPS.length}
            </p>
            <h3 ref={headingRef} tabIndex={-1} className="scroll-mt-32 text-2xl font-semibold outline-none md:text-3xl">
              {STEPS[q]}
            </h3>

            {q === 0 && (
              <div className="mt-4 space-y-5">
                <p className="text-base text-muted-foreground">
                  Who you approached, what happened, or what stayed uncertain. Mixed experiences belong here too.
                </p>
                <div>
                  <p className="font-semibold" id={`${id}-who`}>
                    Who did you reach out to? <span className="font-normal text-muted-foreground">(optional)</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${id}-who`}>
                    {people.map((p) => (
                      <button
                        key={p}
                        type="button"
                        role="radio"
                        aria-checked={f.reachedOutTo === p}
                        onClick={() => set("reachedOutTo", f.reachedOutTo === p ? "" : p)}
                        className={cn(
                          "squish h-11 rounded-full px-4 text-base font-semibold transition-colors",
                          f.reachedOutTo === p ? "bg-apricot text-ink" : "bg-surface-strong hover:bg-accent",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <ul className="grid gap-2 text-base">
                  <Tip icon={<Leaf size={20} weight="duotone" />}>Focus on reaching out and what happened. No uplifting ending is required.</Tip>
                  <Tip icon={<ShieldCheck size={20} weight="duotone" />}>Leave out details of harm and unnecessary health details.</Tip>
                  <Tip icon={<Sparkle size={20} weight="duotone" />}>Don&apos;t include contact details or anything that identifies you or anyone else.</Tip>
                </ul>
                <div>
                  <label htmlFor={`${id}-story`} className="font-semibold">
                    Your story
                  </label>
                  <Textarea
                    id={`${id}-story`}
                    name="story"
                    value={f.story}
                    onChange={(e) => set("story", e.target.value)}
                    placeholder="Try the preview with fictional details…"
                    maxLength={2400}
                    className={cn(areaClass, "mt-2 min-h-40")}
                    {...errorProps}
                  />
                  <p className="mt-1 text-right text-sm tabular-nums text-muted-foreground">{f.story.length} / 2400</p>
                </div>
                <div>
                  <label htmlFor={`${id}-helped`} className="font-semibold">
                    What helped you, if anything? <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <Textarea
                    id={`${id}-helped`}
                    name="whatHelped"
                    value={f.whatHelped}
                    onChange={(e) => set("whatHelped", e.target.value)}
                    maxLength={500}
                    className={cn(areaClass, "mt-2 min-h-20")}
                  />
                </div>
              </div>
            )}

            {q === 1 && (
              <div className="mt-4 space-y-5">
                <p className="text-base text-muted-foreground">You control the name readers see. You don&apos;t need to give your full name.</p>
                <fieldset>
                  <legend className="font-semibold">Public attribution</legend>
                  <div className="mt-2 grid gap-2">
                    {displayOptions.map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-[20px] px-5 py-4 text-lg transition-colors",
                          f.display === value ? "bg-lavender/30" : "bg-surface-strong hover:bg-accent",
                        )}
                      >
                        <input
                          type="radio"
                          name={`${id}-display`}
                          value={value}
                          checked={f.display === value}
                          onChange={() => set("display", value)}
                          className="size-5 accent-[var(--apricot)]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {f.display !== "anonymous" && (
                  <div>
                    <label htmlFor={`${id}-name`} className="font-semibold">
                      {f.display === "pseudonym" ? "Public pseudonym" : "Public first name (optional)"}
                    </label>
                    <Input
                      id={`${id}-name`}
                      name="publicName"
                      value={f.name}
                      onChange={(e) => set("name", e.target.value)}
                      maxLength={40}
                      className={cn(fieldClass, "mt-2")}
                      {...errorProps}
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {f.display === "first-name" ? "If left blank, the preview will say Anonymous." : "Choose a name that doesn’t identify anyone else."}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-semibold" id={`${id}-avatar`}>
                    Pick an illustration
                  </p>
                  <div className="mt-2 grid grid-cols-6 gap-2" role="radiogroup" aria-labelledby={`${id}-avatar`}>
                    {avatarChoices.map((seed, i) => (
                      <button
                        key={seed}
                        type="button"
                        role="radio"
                        aria-checked={f.avatarSeed === seed}
                        aria-label={`Illustration ${i + 1}`}
                        onClick={() => set("avatarSeed", seed)}
                        className={cn(
                          "squish grid place-items-center rounded-full p-1 transition-[box-shadow,opacity]",
                          f.avatarSeed === seed ? "shadow-[0_0_0_3px_var(--apricot)]" : "opacity-80 hover:opacity-100",
                        )}
                      >
                        <StoryAvatar seed={seed} size={56} decorative />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="rounded-[20px] bg-sky/15 px-5 py-3 text-base">
                  Anonymous publication doesn&apos;t necessarily mean anonymous collection. Any private follow-up details would be kept separate
                  from the public story.
                </p>
              </div>
            )}

            {q === 2 && (
              <div className="mt-4 space-y-4">
                <p className="text-base text-muted-foreground">
                  This preview has no reviewers or submission service. Use a made-up email or leave it blank.
                </p>
                <div className="rounded-[24px] bg-surface-strong/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <LockSimple size={16} weight="bold" aria-hidden /> Private: never part of the public story
                  </p>
                  <label htmlFor={`${id}-email`} className="mt-3 block font-semibold">
                    Follow-up email <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative mt-2">
                    <EnvelopeSimple size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    <Input
                      id={`${id}-email`}
                      name="followUpEmail"
                      type="email"
                      inputMode="email"
                      spellCheck={false}
                      value={f.email}
                      onChange={(e) => set("email", e.target.value)}
                      maxLength={254}
                      placeholder="name@example.com"
                      className={cn(fieldClass, "pl-14")}
                      {...errorProps}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No email is sent or verified. In a future service, only authorised reviewers should see it, for clarification or withdrawal
                    requests. That access process isn&apos;t built yet.
                  </p>
                </div>
                <p className="rounded-[20px] bg-sage/15 px-5 py-3 text-base">
                  <strong>Optional really means optional.</strong> You can continue without contact details. We won&apos;t ask for extra
                  disclosure to make a story seem more credible.
                </p>
              </div>
            )}

            {q === 3 && (
              <div className="mt-4 space-y-5">
                <p className="text-base text-muted-foreground">
                  This is how the public text would appear. Check it for identifying details: the preview doesn&apos;t remove them for you.
                </p>
                <article aria-label="Publication preview" className="overflow-hidden rounded-[28px] bg-surface-strong">
                  <p className="bg-lavender/25 px-5 py-2 text-sm font-semibold">Publication preview · not published</p>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <StoryAvatar seed={f.avatarSeed} size={52} decorative />
                      <div>
                        <p className="font-heading text-xl font-semibold">My first step</p>
                        <p className="text-base text-muted-foreground">
                          {attribution(f)}
                          {f.reachedOutTo && ` · reached out to ${f.reachedOutTo.toLowerCase()}`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {f.story
                        .trim()
                        .split(/\n\s*\n/)
                        .filter(Boolean)
                        .map((p, i) => (
                          <p key={i} className="whitespace-pre-wrap break-words">
                            {p}
                          </p>
                        ))}
                    </div>
                    {f.whatHelped.trim() && (
                      <p className="mt-4 rounded-[20px] bg-sage/15 p-4 font-heading text-lg">
                        <span className="text-sage-text">What helped me: </span>
                        {f.whatHelped.trim()}
                      </p>
                    )}
                    <p className="mt-4 text-sm text-muted-foreground">{storyBoundary}</p>
                  </div>
                </article>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {[
                    [0, "Edit story"],
                    [1, "Edit public name"],
                    [2, "Edit private follow-up"],
                  ].map(([n, label]) => (
                    <button key={label} type="button" onClick={() => goTo(n as number)} className="py-2 font-semibold underline underline-offset-4 hover:no-underline">
                      {label}
                    </button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-start gap-4 rounded-[20px] p-2 text-base">
                  <Checkbox
                    checked={f.consent}
                    onCheckedChange={(c) => set("consent", c === true)}
                    className="mt-1 size-6 rounded-lg border-2 border-foreground/40 data-checked:border-apricot data-checked:bg-apricot data-checked:text-ink [&_svg]:size-4"
                  />
                  <span>
                    I would consent to publication of the reviewed story with my chosen public attribution. This checkbox is part of the preview
                    and grants no actual publication permission.
                  </span>
                </label>
                <details className="rounded-[20px] bg-surface-strong/60 px-5 py-4 text-base">
                  <summary className="cursor-pointer font-semibold">How review and withdrawal would work</summary>
                  <p className="mt-2">
                    Before opening submissions, PULSE needs secure storage, authorised human reviewers and a working withdrawal route. Review
                    would check permission, identifying details and suitability. Nothing should publish before review and consent are complete.
                  </p>
                  <p className="mt-2">
                    Moderation or email checks wouldn&apos;t prove an experience is authentic. For this preview, leave the page to erase the
                    draft: there is no submitted copy to withdraw.
                  </p>
                </details>
                <p className="rounded-[20px] bg-apricot/15 px-5 py-3 text-base">
                  Submission is unavailable. Secure collection, storage, human moderation and withdrawal must be ready before stories can be
                  accepted.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <p id={errId} role="alert" className="min-h-7 text-base font-semibold text-apricot-text">
          {error}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, q - 1))}
            className={cn("squish inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface-strong", q === 0 && "invisible")}
          >
            <ArrowLeft size={18} weight="bold" aria-hidden /> Back
          </button>
          {q < STEPS.length - 1 ? (
            <button type="submit" className="squish inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-apricot px-6 font-semibold text-ink">
              {q === 2 ? "Review preview" : "Continue"} <ArrowRight size={18} weight="bold" aria-hidden />
            </button>
          ) : (
            <button type="button" disabled className="inline-flex h-12 shrink-0 cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-full bg-surface-strong px-6 font-semibold text-muted-foreground">
              Submissions not open
            </button>
          )}
        </div>
      </form>
    </div>
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
