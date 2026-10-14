"use client";

import { useId } from "react";
import { services } from "@/data/pulse/services";
import type { ServiceId } from "@/data/pulse/sources";
import { cn } from "@/lib/utils";
import { usePulse } from "./PulseProvider";

/** Picks which service context the process preview and chat use. */
export function ServiceSelect({ compact = false, onChange, className }: { compact?: boolean; onChange?: () => void; className?: string }) {
  const { service, setService } = usePulse();
  const id = useId();
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <label htmlFor={id} className={cn("shrink-0 text-base font-semibold", compact && "sr-only")}>
        Exploring
      </label>
      <select
        id={id}
        name="service"
        value={service}
        onChange={(e) => {
          setService(e.target.value as ServiceId);
          onChange?.();
        }}
        className={cn(
          "min-w-0 appearance-none rounded-full border-0 bg-surface-strong bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pl-5 pr-11 font-semibold [&_option]:bg-popover [&_option]:text-popover-foreground",
          compact ? "h-11 max-w-[21rem] text-base" : "h-12 w-full max-w-sm truncate text-base sm:text-lg",
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a99fbd' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.option}
          </option>
        ))}
      </select>
    </div>
  );
}
