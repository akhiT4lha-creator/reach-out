import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChatShell } from "@/components/chat/ChatShell";
import { getGuide, guides } from "@/data/pulse/guides";

export function generateStaticParams() {
  return guides.map((g) => ({ guide: g.id }));
}

export async function generateMetadata({ params }: PageProps<"/chat/[guide]">): Promise<Metadata> {
  const { guide } = await params;
  const g = getGuide(guide);
  return { title: g ? `Talk with ${g.name} | PULSE: FIRST LOOK` : "AI guide | PULSE: FIRST LOOK" };
}

export default function ChatPage({ params }: PageProps<"/chat/[guide]">) {
  return (
    <Suspense fallback={<div className="h-[100dvh]" aria-hidden />}>
      <ChatRoute params={params} />
    </Suspense>
  );
}

async function ChatRoute({ params }: { params: PageProps<"/chat/[guide]">["params"] }) {
  const { guide } = await params;
  const g = getGuide(guide);
  if (!g) notFound();
  return (
    <main id="main">
      <ChatShell guideId={g.id} />
    </main>
  );
}
