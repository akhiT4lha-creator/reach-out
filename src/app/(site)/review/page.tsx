import type { Metadata } from "next";
import { SourceCard } from "@/components/pulse/SourceCard";
import { getGuide } from "@/data/pulse/guides";
import { sources } from "@/data/pulse/sources";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Source register | PULSE: FIRST LOOK",
  robots: { index: false, follow: false },
};

// Read-only. There is no reviewer login, document ingestion or durable publishing,
// so nothing on this page can change a record.
export default function ReviewPage() {
  const published = sources.filter((s) => s.review_status === "published").length;
  return (
    <section className="px-4 pb-10 pt-10 md:px-6 md:pt-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold md:text-5xl">Source register</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Every record the AI guides could draw on, with where it came from and how it was checked. This is a read-only reviewer preview:
          reviewer sign-in, document extraction and publishing are not built, so nothing here can be edited.
        </p>
        <p className="mt-4 max-w-2xl rounded-[20px] bg-lavender/15 px-5 py-3 text-base">
          Guides only use <strong>published</strong> records for the chosen service. “Published” means included in this demo, not clinically
          approved. Draft records are never used in answers.
        </p>
        <p className="mt-6 text-base text-muted-foreground">
          {sources.length} records · {published} published · {sources.length - published} draft
        </p>
        <ul className="mt-6 grid gap-4">
          {sources.map((s) => (
            <li key={s.entry_id}>
              <details className="group rounded-[28px] bg-surface">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-6 py-5">
                  <span className="font-heading text-xl font-semibold">{s.topic}</span>
                  <span className="flex flex-wrap gap-2 text-sm font-semibold">
                    <span className="rounded-full bg-surface-strong px-3 py-1">{s.service_id === "all" ? "All services" : s.service_id}</span>
                    <span className={cn("rounded-full px-3 py-1", s.review_status === "draft" ? "bg-apricot/30" : "bg-sage/30")}>{s.review_status}</span>
                  </span>
                </summary>
                <div className="px-3 pb-3">
                  <p className="px-3 pb-3 text-sm text-muted-foreground">
                    Guides: {s.allowed_guide_ids.map((g) => getGuide(g)?.name).join(", ")}
                  </p>
                  <SourceCard entry={s} className="bg-surface-strong" />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
