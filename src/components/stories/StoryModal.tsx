"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, X } from "@phosphor-icons/react";
import Link from "next/link";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { usePulse } from "@/components/pulse/PulseProvider";
import { storyBoundary, type Story } from "@/data/stories";

export function StoryModal({ story, onClose }: { story: Story | null; onClose: () => void }) {
  const { openPanel } = usePulse();
  return (
    <Dialog.Root open={!!story} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[75] bg-[#141b30]/55 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-x-3 bottom-3 z-[76] max-h-[88dvh] overflow-y-auto overscroll-contain rounded-[32px] bg-popover p-6 text-popover-foreground shadow-[0_24px_80px_rgb(20_27_48/0.45)] outline-none transition-[opacity,transform] duration-300 data-[ending-style]:translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(620px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:p-9 md:data-[ending-style]:translate-y-[calc(-50%+1rem)] md:data-[starting-style]:translate-y-[calc(-50%+1rem)]">
          {story && (
            <>
              <div className="flex items-start gap-4">
                <StoryAvatar seed={story.avatarSeed} name={story.displayName} size={64} />
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="font-heading text-2xl font-semibold">
                    {story.displayName}, {story.age}
                  </Dialog.Title>
                  <p className="text-base text-muted-foreground">Reached out to: {story.reachedOutTo}</p>
                  <p className="mt-1 inline-block rounded-full bg-surface-strong px-3 py-0.5 text-sm font-semibold">Example story, not a real person</p>
                </div>
                <Dialog.Close
                  aria-label="Close story"
                  className="squish grid size-11 shrink-0 place-items-center rounded-full bg-muted hover:bg-accent"
                >
                  <X size={20} weight="bold" aria-hidden />
                </Dialog.Close>
              </div>
              <div className="mt-6 max-w-[60ch] space-y-4">
                {story.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="mt-6 rounded-[24px] bg-sage/15 p-5 font-heading text-lg">
                <span className="text-sage-text">What helped me: </span>
                {story.whatHelped}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{storyBoundary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/stories/${story.id}`}
                  className="squish inline-flex h-12 items-center gap-2 rounded-full bg-surface-strong px-5 font-semibold hover:bg-accent"
                >
                  Open full page <ArrowRight size={18} aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openPanel("draft");
                  }}
                  className="squish inline-flex h-12 items-center gap-2 rounded-full bg-apricot px-5 font-semibold text-ink"
                >
                  Prepare my first question
                </button>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
