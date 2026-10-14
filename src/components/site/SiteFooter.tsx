import Link from "next/link";
import { CrisisButton } from "@/components/crisis/CrisisButton";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-28 pt-16 md:px-6 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[32px] bg-surface p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
        <div className="space-y-3">
          <p className="font-heading text-xl font-semibold">
            Reach Out is a first step, not a replacement for professional help.
          </p>
          <p className="text-muted-foreground">
            Buddy, our walkthrough guide, is an AI, not a person. It won&apos;t diagnose or give advice; it helps you
            find someone to talk to. <CrisisButton variant="text" />
          </p>
        </div>
        <div className="space-y-3 text-base text-muted-foreground">
          <p>
            <strong className="text-foreground">Privacy.</strong> No accounts, no tracking, no analytics. Walkthrough
            answers stay on your screen and disappear when you leave.
          </p>
          <p>
            Stories on this site are illustrative examples for a hackathon prototype (London AI Campus x GSK).{" "}
            <Link href="/share" className="underline underline-offset-4 hover:no-underline">
              Share yours
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
