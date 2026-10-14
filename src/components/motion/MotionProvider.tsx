"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

// One place that decides whether things are allowed to move.
// `calm` is true when the visitor turns on Calm mode OR their device asks for reduced motion.
// `loops` is false when calm, or when the tab is hidden (saves battery).

type Theme = "dusk" | "morning";

type Ctx = {
  calm: boolean;
  calmToggle: boolean;
  setCalmToggle: (v: boolean) => void;
  systemReduced: boolean;
  loops: boolean;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const MotionCtx = createContext<Ctx | null>(null);

function writePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

// The <html> data attributes are the source of truth (set before first paint by prefsScript),
// so React subscribes to them rather than copying them into state.
function subscribeHtml(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-calm", "data-theme"] });
  return () => mo.disconnect();
}
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function subscribeVisibility(cb: () => void) {
  const on = () => {
    document.documentElement.dataset.hidden = String(document.visibilityState === "hidden");
    cb();
  };
  document.addEventListener("visibilitychange", on);
  return () => document.removeEventListener("visibilitychange", on);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const calmToggle = useSyncExternalStore(subscribeHtml, () => document.documentElement.dataset.calm === "true", () => false);
  const theme = useSyncExternalStore<Theme>(
    subscribeHtml,
    () => (document.documentElement.dataset.theme === "morning" ? "morning" : "dusk"),
    () => "dusk",
  );
  const systemReduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState !== "hidden", () => true);

  const setCalmToggle = useCallback((v: boolean) => {
    document.documentElement.dataset.calm = String(v);
    writePref("reach-out:calm", String(v));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    writePref("reach-out:theme", t);
  }, []);

  const calm = calmToggle || systemReduced;

  return (
    <MotionCtx.Provider
      value={{ calm, calmToggle, setCalmToggle, systemReduced, loops: !calm && visible, theme, setTheme }}
    >
      {/* "always" turns movement into instant jumps, so only opacity fades remain */}
      <MotionConfig reducedMotion={calm ? "always" : "never"}>{children}</MotionConfig>
    </MotionCtx.Provider>
  );
}

export function useMotionPrefs() {
  const ctx = useContext(MotionCtx);
  if (!ctx) throw new Error("useMotionPrefs must be used inside MotionProvider");
  return ctx;
}

/** Script for <head>: applies saved theme + calm before first paint. */
export const prefsScript = `try{var d=document.documentElement;var t=localStorage.getItem("reach-out:theme");if(t==="morning")d.dataset.theme="morning";else d.dataset.theme="dusk";if(localStorage.getItem("reach-out:calm")==="true")d.dataset.calm="true";}catch(e){}`;
