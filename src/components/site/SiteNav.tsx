"use client";

import Link from "next/link";
import { Moon, Sun, Wind } from "@phosphor-icons/react";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-full font-heading text-xl font-semibold">
      <span aria-hidden className="blob inline-block size-8 bg-gradient-to-br from-lavender via-sky to-sage" />
      Reach Out
    </Link>
  );
}

export function CalmToggle({ compact = false }: { compact?: boolean }) {
  const { calm, calmToggle, setCalmToggle, systemReduced } = useMotionPrefs();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={calm}
      onClick={() => setCalmToggle(!calmToggle)}
      title={systemReduced ? "Your device already asks for less motion, so calm mode is on" : "Turn off moving and floating effects"}
      className={cn(
        "squish inline-flex h-11 items-center gap-2 rounded-full px-3 text-base font-semibold transition-colors",
        calm ? "bg-lavender text-ink" : "bg-surface-strong hover:bg-accent",
      )}
    >
      <Wind size={20} weight="duotone" aria-hidden />
      <span className={cn(compact && "sr-only")}>Calm mode</span>
      <span aria-hidden className={cn("relative inline-block h-5 w-9 shrink-0 rounded-full", calm ? "bg-ink/25" : "bg-foreground/20", compact && "hidden")}>
        <span
          className={cn(
            "absolute left-0 top-0.5 size-4 rounded-full bg-current transition-transform duration-200",
            calm ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useMotionPrefs();
  const next = theme === "dusk" ? "morning" : "dusk";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="squish grid size-11 place-items-center rounded-full bg-surface-strong hover:bg-accent"
    >
      {theme === "dusk" ? <Sun size={22} weight="duotone" aria-hidden /> : <Moon size={22} weight="duotone" aria-hidden />}
    </button>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-[60] px-4 pt-3 md:px-6">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-full bg-[color-mix(in_oklab,var(--bg-from)_70%,transparent)] px-3 pl-5 backdrop-blur-xl md:px-4 md:pl-6"
      >
        <Logo />
        <div className="hidden items-center gap-1 text-base font-semibold lg:flex">
          <Link href="/#stories" className="rounded-full px-4 py-2 hover:bg-surface-strong">
            Stories
          </Link>
          <Link href="/share" className="rounded-full px-4 py-2 hover:bg-surface-strong">
            Share your story
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="md:hidden">
            <CalmToggle compact />
          </span>
          <span className="hidden md:inline">
            <CalmToggle />
          </span>
          <ThemeToggle />
          <CrisisButton className="hidden md:inline-flex" />
        </div>
      </nav>
    </header>
  );
}
