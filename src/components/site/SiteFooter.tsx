"use client";

import Link from "next/link";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { usePulse } from "@/components/pulse/PulseProvider";
import { product } from "@/data/pulse/product";

export function SiteFooter() {
  const { openPanel } = usePulse();
  const link = "rounded-full font-semibold underline underline-offset-4 hover:no-underline";
  return (
    <footer className="px-4 pb-28 pt-16 md:px-6 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[32px] bg-surface p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
        <div className="space-y-3">
          <p className="font-heading text-xl font-semibold">
            {product.fullName}. {product.tagline}
          </p>
          <p className="text-muted-foreground">
            {product.status} The seven guides are AI, not people, and won&apos;t diagnose or give advice. Buddy is our
            mascot, not an AI. <CrisisButton variant="text" />
          </p>
        </div>
        <div className="space-y-3 text-base text-muted-foreground">
          <p>
            <strong className="text-foreground">Privacy.</strong> No accounts, tracking or analytics. Conversations and your
            first question stay in page memory and disappear when you refresh or leave.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <button type="button" onClick={() => openPanel("evidence")} className={link}>
              The evidence
            </button>
            <button type="button" onClick={() => openPanel("how")} className={link}>
              How PULSE works
            </button>
            <Link href="/review" className={link}>
              Source register
            </Link>
            <Link href="/share" className={link}>
              Sharing preview
            </Link>
          </p>
          <p className="text-sm">Built on the Reach Out prototype (London AI Campus x GSK).</p>
        </div>
      </div>
    </footer>
  );
}
