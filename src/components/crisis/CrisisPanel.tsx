"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowSquareOut, Phone, ChatCircleText, X, Heart } from "@phosphor-icons/react";
import { createContext, useCallback, useContext, useState } from "react";
import { HELPLINES_CHECKED, NHS_URGENT_URL, helplines } from "@/data/helplines";
import { cn } from "@/lib/utils";

// The crisis panel. SAFETY: it must open instantly, so there is deliberately
// NO enter/exit animation here, in any mode. Do not add one.

const CrisisCtx = createContext<{ open: () => void } | null>(null);

export function CrisisProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);

  return (
    <CrisisCtx.Provider value={{ open }}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[80] bg-[#141b30]/60 backdrop-blur-sm" />
          <Dialog.Popup
            className={cn(
              "fixed z-[90] flex max-h-[92dvh] flex-col overflow-y-auto overscroll-contain bg-popover text-popover-foreground shadow-[0_24px_80px_rgb(20_27_48/0.45)] outline-none",
              "inset-x-0 bottom-0 rounded-t-[32px] p-6 pb-8",
              "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(560px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[32px] md:p-8",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="font-heading text-2xl font-semibold md:text-3xl">
                  You don&apos;t have to wait.
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-muted-foreground">
                  These people are there to help, right now. It&apos;s free and you don&apos;t need to
                  have the right words. PULSE is not an emergency service: nobody is monitoring it, and it can&apos;t
                  contact anyone for you.
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="squish grid size-11 shrink-0 place-items-center rounded-full bg-muted hover:bg-accent"
                aria-label="Close support panel"
              >
                <X size={20} weight="bold" aria-hidden />
              </Dialog.Close>
            </div>

            <ul className="mt-6 grid gap-3">
              {helplines.map((h) => {
                const isText = h.href.startsWith("sms:");
                return (
                  <li key={h.id}>
                    <a
                      href={h.href}
                      className={cn(
                        "squish flex items-center gap-4 rounded-[24px] p-4 transition-colors",
                        h.urgent
                          ? "bg-apricot text-ink hover:bg-apricot/90"
                          : "bg-muted hover:bg-accent",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-full",
                          h.urgent ? "bg-ink/10" : "bg-sage/25",
                        )}
                        aria-hidden
                      >
                        {isText ? <ChatCircleText size={24} weight="duotone" /> : <Phone size={24} weight="duotone" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-lg font-semibold">{h.name}</span>
                        <span className={cn("block text-base", h.urgent ? "text-ink/85" : "text-muted-foreground")}>
                          {h.detail}
                        </span>
                        <span className={cn("mt-1 block font-semibold sm:hidden", h.urgent ? "text-ink" : "text-apricot-text")}>
                          {h.action}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "hidden shrink-0 rounded-full px-4 py-2 text-base font-semibold sm:block",
                          h.urgent ? "bg-ink text-[#f4f1ec]" : "bg-apricot text-ink",
                        )}
                      >
                        {h.action}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 flex items-start gap-2 text-base text-muted-foreground">
              <Heart size={20} weight="duotone" className="mt-1 shrink-0 text-apricot-text" aria-hidden />
              If you can, you could also tell a trusted adult nearby: a parent, carer, teacher or friend.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              In immediate danger you can also go to A&amp;E. These options are for England and the UK; elsewhere, use local emergency
              and crisis services.{" "}
              <a
                href={NHS_URGENT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:no-underline"
              >
                NHS urgent-help information <ArrowSquareOut size={14} weight="bold" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              . {HELPLINES_CHECKED}
            </p>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </CrisisCtx.Provider>
  );
}

export function useCrisis() {
  const ctx = useContext(CrisisCtx);
  if (!ctx) throw new Error("useCrisis must be used inside CrisisProvider");
  return ctx;
}
