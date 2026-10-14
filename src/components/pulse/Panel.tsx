"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// A PULSE contextual panel, styled like Reach Out's story modal.
// `side` slides in from the right on desktop (used for sources) and is a bottom sheet on phones.
// Base UI returns focus to whatever was focused before the panel opened.

export function Panel({
  open,
  onClose,
  title,
  description,
  wide = false,
  side = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  wide?: boolean;
  side?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[75] bg-[#141b30]/55 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed inset-x-0 bottom-0 z-[76] max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-[32px] bg-popover p-6 pb-10 text-popover-foreground shadow-[0_24px_80px_rgb(20_27_48/0.45)] outline-none transition-[opacity,transform] duration-300 data-[ending-style]:translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0",
            side
              ? "md:inset-y-3 md:left-auto md:right-3 md:max-h-none md:w-[min(560px,94vw)] md:rounded-[32px] md:p-8 md:data-[ending-style]:translate-x-6 md:data-[ending-style]:translate-y-0 md:data-[starting-style]:translate-x-6 md:data-[starting-style]:translate-y-0"
              : cn(
                  "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[88dvh] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[32px] md:p-9 md:data-[ending-style]:translate-y-[calc(-50%+1rem)] md:data-[starting-style]:translate-y-[calc(-50%+1rem)]",
                  wide ? "md:w-[min(860px,94vw)]" : "md:w-[min(640px,94vw)]",
                ),
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-heading text-2xl font-semibold md:text-3xl">{title}</Dialog.Title>
              {description && <Dialog.Description className="mt-2 text-muted-foreground">{description}</Dialog.Description>}
            </div>
            <Dialog.Close aria-label="Close panel" className="squish grid size-11 shrink-0 place-items-center rounded-full bg-muted hover:bg-accent">
              <X size={20} weight="bold" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="mt-6">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
