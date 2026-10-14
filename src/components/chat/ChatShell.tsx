"use client";

import { usePulse } from "@/components/pulse/PulseProvider";
import { getGuide, type GuideId } from "@/data/pulse/guides";
import { ChatApp } from "./ChatApp";

/** Remounts the chat for each guide and on Clear, so every conversation starts fresh. */
export function ChatShell({ guideId }: { guideId: GuideId }) {
  const { sessionKey } = usePulse();
  return <ChatApp key={`${guideId}-${sessionKey}`} guide={getGuide(guideId)!} />;
}
