import type { Metadata } from "next";
import { ShareFlow } from "@/components/share/ShareFlow";

export const metadata: Metadata = { title: "Share your story | Reach Out" };

export default function SharePage() {
  return (
    <section className="px-4 pb-10 pt-10 md:px-6 md:pt-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold md:text-5xl">Share your story</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          How did reaching out go for you? Your words could help someone else take their first step. A real person reads
          every story before anything goes up.
        </p>
        <div className="mt-10">
          <ShareFlow />
        </div>
      </div>
    </section>
  );
}
