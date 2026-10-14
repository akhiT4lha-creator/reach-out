// Shared Reach Out control styles, so PULSE features use the same pills everywhere.
export const btn = {
  primary:
    "squish inline-flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-apricot px-7 text-lg font-semibold text-ink shadow-[0_10px_30px_rgb(245_169_127/0.25)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
  primarySm:
    "squish inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-apricot px-5 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "squish inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-strong px-5 font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "squish inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-40",
  link: "inline-flex items-center gap-2 rounded-full py-2 font-semibold text-apricot-text underline decoration-2 underline-offset-4 hover:no-underline",
  icon: "squish grid size-11 shrink-0 place-items-center rounded-full bg-muted hover:bg-accent",
};

export const chip = (on: boolean) =>
  `squish h-11 shrink-0 rounded-full px-5 text-base font-semibold transition-colors ${on ? "bg-lavender text-ink" : "bg-surface-strong hover:bg-accent"}`;

export const field =
  "w-full rounded-[24px] border-0 bg-surface-strong p-5 text-lg text-foreground placeholder:text-muted-foreground/90";
