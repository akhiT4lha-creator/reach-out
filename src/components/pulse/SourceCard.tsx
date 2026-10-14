import { ArrowSquareOut, Quotes } from "@phosphor-icons/react/dist/ssr";
import type { SourceRecord } from "@/data/pulse/sources";
import { cn } from "@/lib/utils";

const classLabel: Record<SourceRecord["content_class"], string> = {
  service: "Service guidance",
  product: "About PULSE",
  dataset: "Survey data",
};

/** One source record: readable first, full metadata underneath. */
export function SourceCard({ entry, className }: { entry: SourceRecord; className?: string }) {
  return (
    <article className={cn("rounded-[28px] bg-surface p-5 md:p-6", className)}>
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span className="rounded-full bg-sky/20 px-3 py-1">{classLabel[entry.content_class]}</span>
        {entry.is_demo && <span className="rounded-full bg-apricot/25 px-3 py-1">Fictional example</span>}
        {entry.review_status === "draft" && <span className="rounded-full bg-foreground/10 px-3 py-1">Draft · never used in answers</span>}
      </div>
      <h3 className="mt-3 text-xl font-semibold">{entry.topic}</h3>
      {entry.source_quote ? (
        <blockquote className="mt-3 flex gap-3 rounded-[20px] bg-sage/15 p-4 text-base">
          <Quotes size={20} weight="duotone" className="mt-1 shrink-0 text-sage-text" aria-hidden />
          <span>{entry.source_quote}</span>
        </blockquote>
      ) : null}
      {entry.source_quote ? (
        <p className="mt-3 text-base">
          <span className="font-semibold">In plain words: </span>
          {entry.approved_explanation}
        </p>
      ) : (
        <p className="mt-3 text-base text-muted-foreground">
          <span className="font-semibold text-foreground">Summary (no direct quotation stored): </span>
          {entry.approved_explanation}
        </p>
      )}
      <details className="group mt-4 text-base">
        <summary className="cursor-pointer rounded-full font-semibold text-muted-foreground hover:text-foreground">
          Source details
        </summary>
        <dl className="mt-3 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Source</dt>
          <dd className="break-words">{entry.source_title}</dd>
          <dt className="text-muted-foreground">Location</dt>
          <dd className="break-words">{entry.source_location}</dd>
          <dt className="text-muted-foreground">Version</dt>
          <dd>{entry.source_version}</dd>
          <dt className="text-muted-foreground">Review</dt>
          <dd>
            {entry.review_type}. {entry.reviewer}
            {entry.reviewed_at ? ` · ${entry.reviewed_at}` : ""}
          </dd>
          <dt className="text-muted-foreground">Record</dt>
          <dd className="break-all">
            {entry.entry_id} · {entry.review_status}
          </dd>
        </dl>
      </details>
      {entry.source_url && (
        <a
          href={entry.source_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-semibold text-apricot-text underline decoration-2 underline-offset-4 hover:no-underline"
        >
          Open original source <ArrowSquareOut size={16} weight="bold" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </article>
  );
}
