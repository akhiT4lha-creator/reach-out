import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { journey } from "@/data/pulse/sections";
import { product } from "@/data/pulse/product";
import { cn } from "@/lib/utils";

const tints = ["bg-sky/15", "bg-apricot/15", "bg-lavender/15"];
const dots = ["bg-sky", "bg-apricot", "bg-lavender"];

/** What PULSE is, and the three-step path the rest of the page follows. */
export function AboutSection() {
  return (
    <div>
      <h2 id="about-title" className="max-w-3xl text-4xl font-semibold md:text-5xl">
        A first look, <span className="text-apricot-text">before your first step.</span>
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        PULSE helps you understand how asking for support works before you decide what to share. You don&apos;t need to tell us
        your story, and nothing is sent for you.
      </p>

      <ol className="relative mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
        {/* the path joining the three steps */}
        <span aria-hidden className="absolute left-0 right-0 top-9 hidden h-1 rounded-full bg-foreground/10 md:block" />
        {journey.map((j, i) => (
          <li key={j.id} className="relative">
            <a
              href={`#${j.id}`}
              className={cn("squish group flex h-full flex-col rounded-[28px] p-6 transition-colors hover:bg-surface-strong md:p-7", tints[i])}
            >
              <span aria-hidden className={cn("blob grid size-12 place-items-center font-heading text-xl font-semibold text-ink", dots[i])}>
                {j.step}
              </span>
              <span className="mt-4 text-sm font-semibold text-muted-foreground">Step {j.step}</span>
              <span className="font-heading text-2xl font-semibold">{j.title}</span>
              <span className="mt-2 text-base text-muted-foreground">{j.detail}</span>
              <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-apricot-text">
                Go to step {j.step}
                <ArrowDown size={16} weight="bold" aria-hidden className="transition-transform group-hover:translate-y-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm text-muted-foreground">{product.status}</p>
    </div>
  );
}

/** Small label above a step's heading, so each section shows where it sits in the path. */
export function StepLabel({ step }: { step: number }) {
  const j = journey.find((x) => x.step === step)!;
  return (
    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-strong px-4 py-1.5 text-base font-semibold">
      <span aria-hidden className={cn("blob grid size-6 place-items-center text-sm text-ink", dots[step - 1])}>
        {step}
      </span>
      Step {step} of 3 · {j.title}
    </p>
  );
}
