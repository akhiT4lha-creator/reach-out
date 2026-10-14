import type { Metadata } from "next";
import { ShareFlow } from "@/components/share/ShareFlow";

export const metadata: Metadata = { title: "Share your first step (preview) | PULSE: FIRST LOOK" };

export default function SharePage() {
  return (
    <section className="px-4 pb-10 pt-10 md:px-6 md:pt-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold md:text-5xl">Share your first step</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          See how sharing would work. Submissions are closed until secure storage, human review and a way to withdraw a story are ready.
          Nothing you type here is sent or saved.
        </p>
        <div className="mt-10">
          <ShareFlow />
        </div>
      </div>
    </section>
  );
}
