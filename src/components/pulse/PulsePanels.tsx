"use client";

import { ArrowLeft, ArrowRight, ArrowSquareOut, BookOpenText } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nhsFinding } from "@/data/pulse/evidence";
import { howItWorks, limitations, privacy } from "@/data/pulse/product";
import { getService } from "@/data/pulse/services";
import { EvidenceBar } from "./EvidenceBar";
import { DraftEditor } from "./DraftEditor";
import { Panel } from "./Panel";
import { ProcessExplorer } from "./ProcessExplorer";
import { SourceCard } from "./SourceCard";
import { usePulse } from "./PulseProvider";
import { btn } from "./ui";

const REVIEW_PROMPT = "Help me refine the wording of my first question.";

export function PulsePanels() {
  const p = usePulse();
  const pathname = usePathname();
  const inChat = pathname.startsWith("/chat/");
  const svc = getService(p.service);
  const close = p.closePanel;

  return (
    <>
      <Panel
        open={p.panel === "draft"}
        onClose={close}
        title="Your question, in your words"
        description="Change anything you like. Nothing is sent for you. If you ask an AI guide and press Send, the current draft is included with your question."
      >
        <DraftEditor
          onReview={() => {
            if (inChat) {
              close();
              window.dispatchEvent(new CustomEvent("pulse:compose", { detail: REVIEW_PROMPT }));
            } else {
              p.openStart("guides", REVIEW_PROMPT);
            }
          }}
        />
      </Panel>

      <Panel open={p.panel === "journey"} onClose={close} wide title={`A first look at ${svc.name}`}>
        <ProcessExplorer
          sourcesBack="journey"
          onDraft={() => p.openPanel("draft")}
          onGuide={() => p.openStart("guides", svc.guideQuestion)}
        />
        {svc.contact && (
          <div className="mt-6 rounded-[20px] bg-sky/15 p-4 text-base">
            <a href={svc.contact} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold underline underline-offset-4 hover:no-underline">
              View {svc.name}’s contact options <ArrowSquareOut size={16} weight="bold" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-1 text-muted-foreground">Opens the service website. Your PULSE conversation and question are not transferred.</p>
          </div>
        )}
      </Panel>

      <Panel open={p.panel === "evidence"} onClose={close} wide title="A gap worth understanding">
        <p className="font-heading text-5xl font-semibold text-apricot-text md:text-6xl">
          {nhsFinding.didNotSeek}%
        </p>
        <p className="mt-2 max-w-xl">did not seek help or advice, among {nhsFinding.population}.</p>
        <EvidenceBar className="mt-6" />
        <p className="mt-6 text-muted-foreground">
          {nhsFinding.source}, {nhsFinding.table}. Unweighted base: {nhsFinding.unweightedBase}. {nhsFinding.period}
        </p>
        <div className="mt-6 rounded-[24px] bg-lavender/15 p-5">
          <h3 className="text-xl font-semibold">What this finding does and doesn’t tell us</h3>
          <p className="mt-2">{nhsFinding.limitations}</p>
        </div>
        <div className="mt-4 rounded-[24px] bg-sage/15 p-5">
          <h3 className="text-xl font-semibold">Our design hypothesis</h3>
          <p className="mt-2">{nhsFinding.hypothesis}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => p.openSources([nhsFinding.sourceEntryId], "evidence")} className={btn.primarySm}>
            <BookOpenText size={18} weight="duotone" aria-hidden /> View the source
          </button>
          <a href={nhsFinding.url} target="_blank" rel="noreferrer" className={btn.secondary}>
            Read the NHS publication <ArrowSquareOut size={16} weight="bold" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Panel>

      <Panel open={p.panel === "how"} onClose={close} wide title="Clarity before disclosure">
        <ol className="grid gap-3 md:grid-cols-3">
          {howItWorks.map((s, i) => (
            <li key={s.title} className={["rounded-[24px] bg-sky/15 p-5", "rounded-[24px] bg-sage/15 p-5", "rounded-[24px] bg-apricot/15 p-5"][i]}>
              <span aria-hidden className="blob grid size-10 place-items-center bg-surface-strong font-heading text-lg font-semibold">
                {i + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-base text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-2">
          <Disclosure title="Your conversation and privacy">
            <p>{privacy.memory}</p>
            <p>{privacy.storage}</p>
            <p>{privacy.model}</p>
            <p>{privacy.links}</p>
          </Disclosure>
          <Disclosure title="One model, seven personalities">
            <p>
              PULSE is designed around one shared language-model backend with seven personality styles. They are not seven separately
              trained models, and they are not specialists for different conditions. All of them can use the same eligible source records
              and help with every supported topic. Changing personality starts a fresh conversation. Buddy is the site’s navigation mascot,
              not an AI guide.
            </p>
          </Disclosure>
          <Disclosure title="Sources and limitations">
            <ul className="list-disc space-y-1 pl-5">
              {limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Disclosure>
          <Disclosure title="What works in this version">
            <p>
              The Childline preview uses linked public pages checked during implementation (7 October 2026). Childline has not endorsed PULSE;
              independent service review is pending. The school example is fictional. The NHS finding comes from the supplied dataset.
            </p>
            <p>
              No AI model is connected, so chat replies are unavailable. Process previews, sources, stories and the question editor all work
              without it. Document extraction and reviewer publishing are not built.
            </p>
          </Disclosure>
        </div>
        <Link href="/review" onClick={close} className={`${btn.secondary} mt-6`}>
          <BookOpenText size={18} weight="duotone" aria-hidden /> Inspect the source register
        </Link>
      </Panel>

      <Panel open={p.panel === "sources"} onClose={close} side title="The information behind this">
        {p.sourcesBack && (
          <button type="button" onClick={() => p.openPanel(p.sourcesBack!)} className={`${btn.ghost} -ml-4 mb-3`}>
            <ArrowLeft size={18} weight="bold" aria-hidden /> Back to {p.sourcesBack === "journey" ? "the process" : "the evidence"}
          </button>
        )}
        <div className="grid gap-4">
          {p.sources.map((s) => (
            <SourceCard key={s.entry_id} entry={s} />
          ))}
          {p.sources.length === 0 && <p className="text-muted-foreground">No source is linked here.</p>}
        </div>
        {!p.sourcesBack && p.sources.length > 0 && (
          <Link href="/review" onClick={close} className={`${btn.link} mt-4`}>
            See the whole source register <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        )}
      </Panel>
    </>
  );
}

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-[24px] bg-surface px-5 py-4">
      <summary className="cursor-pointer font-heading text-lg font-semibold">{title}</summary>
      <div className="mt-3 space-y-3 text-base text-muted-foreground">{children}</div>
    </details>
  );
}
