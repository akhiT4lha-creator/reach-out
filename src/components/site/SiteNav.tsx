"use client";

import Link from "next/link";
import { List, Moon, Sun, Wind } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { Panel } from "@/components/pulse/Panel";
import { usePulse } from "@/components/pulse/PulseProvider";
import { sections, type SectionId } from "@/data/pulse/sections";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link href="/" aria-label="PULSE: FIRST LOOK, home" className="flex shrink-0 items-center gap-2 rounded-full font-heading text-xl font-semibold">
      <span aria-hidden className="relative inline-block size-9">
        <span className="blob absolute inset-0 bg-gradient-to-br from-lavender via-sky to-sage" />
        {/* the lifeline: a heartbeat running through the bubble and just past its edges */}
        <svg viewBox="0 0 40 40" fill="none" className="absolute -inset-x-1 inset-y-0 h-full w-[calc(100%+0.5rem)] overflow-visible">
          <path
            className="lifeline"
            pathLength={1}
            d="M1 21h10l3-6 4 14 5-22 4 18 2-4h10"
            stroke="var(--color-ink, #141b30)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span aria-hidden>PULSE</span>
      <span aria-hidden className="hidden rounded-full bg-surface-strong px-2.5 py-0.5 text-xs font-semibold tracking-wide text-muted-foreground sm:inline xl:hidden">
        FIRST LOOK
      </span>
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
  const { openPanel } = usePulse();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const active = useActiveSection(onHome);
  const [menuOpen, setMenuOpen] = useState(false);
  // A section picked from the menu. We jump only after the menu has fully closed,
  // because closing it restores the old scroll position and would undo an earlier jump.
  const pendingJump = useRef<SectionId | null>(null);
  const jumpAfterClose = () => {
    const id = pendingJump.current;
    pendingJump.current = null;
    if (!id) return;
    document.getElementById(id)?.scrollIntoView();
    history.replaceState(null, "", `#${id}`);
  };

  const linkClass = (id: string) =>
    cn(
      "whitespace-nowrap rounded-full px-3 py-2 transition-colors",
      onHome && active === id ? "bg-lavender text-ink" : "hover:bg-surface-strong",
    );

  return (
    <header className="sticky top-0 z-[60] px-4 pt-3 md:px-6">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-full bg-[color-mix(in_oklab,var(--bg-from)_70%,transparent)] px-3 pl-5 backdrop-blur-xl md:px-4 md:pl-6"
      >
        <Logo />
        <ul className="hidden items-center gap-0.5 text-base font-semibold xl:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <Link href={`/#${s.id}`} aria-current={onHome && active === s.id ? "location" : undefined} className={linkClass(s.id)}>
                {s.nav}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <CalmToggle compact />
          <ThemeToggle />
          <CrisisButton className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            className="squish inline-flex h-11 items-center gap-2 rounded-full bg-surface-strong px-4 text-base font-semibold hover:bg-accent xl:hidden"
          >
            <List size={20} weight="bold" aria-hidden /> Menu
          </button>
        </div>
      </nav>

      <Panel open={menuOpen} onClose={() => setMenuOpen(false)} onClosed={jumpAfterClose} title="Jump to a section">
        <ol className="grid gap-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/#${s.id}`}
                onClick={(e) => {
                  if (onHome) {
                    e.preventDefault();
                    pendingJump.current = s.id;
                  }
                  setMenuOpen(false);
                }}
                aria-current={onHome && active === s.id ? "location" : undefined}
                className={cn(
                  "squish flex items-center gap-4 rounded-[22px] px-4 py-3 font-heading text-lg font-semibold transition-colors",
                  onHome && active === s.id ? "bg-lavender text-ink" : "bg-surface hover:bg-surface-strong",
                )}
              >
                <span aria-hidden className="grid size-8 place-items-center rounded-full bg-foreground/10 text-sm">
                  {i + 1}
                </span>
                {s.nav}
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/start" onClick={() => setMenuOpen(false)} className="squish inline-flex h-12 items-center rounded-full bg-apricot px-5 font-semibold text-ink">
            Help me get started
          </Link>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openPanel("draft");
            }}
            className="squish inline-flex h-12 items-center rounded-full bg-surface-strong px-5 font-semibold hover:bg-accent"
          >
            My question
          </button>
          <CrisisButton className="md:hidden" />
        </div>
      </Panel>
    </header>
  );
}

/** Which homepage section is in the middle of the screen, for highlighting its nav link. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    // The active section is the last one whose top has passed the middle of the screen.
    // Above the first section (the hero) nothing is highlighted.
    const pick = () => {
      const mid = window.innerHeight / 2;
      const current = els.filter((el) => el.getBoundingClientRect().top <= mid).pop();
      setActive(current ? (current.id as SectionId) : null);
    };
    // Re-check whenever any section's visible share changes (any scroll, including jumps).
    const io = new IntersectionObserver(pick, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    pick();
    // Watch every homepage section (hero and closing ones too) so jumps to the top or bottom also update.
    document.querySelectorAll("main > section").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}
