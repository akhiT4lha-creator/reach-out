"use client";

import { Lifebuoy } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCrisis } from "./CrisisPanel";

/** `inline` sits in a nav bar; `floating` is the fixed bottom-right button on phones. */
export function CrisisButton({ variant = "inline", className }: { variant?: "inline" | "floating" | "text" | "icon"; className?: string }) {
  const { open } = useCrisis();
  const pathname = usePathname();

  // In the chat the composer sits where the floating button would; the chat header has an icon button instead.
  if (variant === "floating" && pathname.startsWith("/chat/")) return null;

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Need help now?"
        className={cn("squish grid size-11 place-items-center rounded-full bg-sage text-ink", className)}
      >
        <Lifebuoy size={22} weight="duotone" aria-hidden />
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={open}
        className={cn("font-semibold text-apricot-text underline decoration-2 underline-offset-4 hover:no-underline", className)}
      >
        Need help now?
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className={cn(
        "squish inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-sage font-semibold text-ink shadow-[0_8px_24px_rgb(20_27_48/0.25)] hover:bg-[#acd2b0]",
        variant === "floating"
          ? "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[70] h-14 px-5 text-base md:hidden"
          : "h-11 px-5 text-base",
        className,
      )}
    >
      <Lifebuoy size={22} weight="duotone" aria-hidden />
      Need help now?
    </button>
  );
}
