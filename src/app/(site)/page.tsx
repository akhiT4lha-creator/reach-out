import { Hero } from "@/components/hero/Hero";
import { Reveal } from "@/components/site/Reveal";
import { ShareFlow } from "@/components/share/ShareFlow";
import { StoryWall } from "@/components/stories/StoryWall";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { stories } from "@/data/stories";

export default function Home() {
  return (
    <>
      <Hero />

      {/* TEAM INSIGHT: replace both placeholders with the team's finding from the NHS England 2023 survey. */}
      <section aria-label="Why we built this" className="px-4 py-20 md:px-6 md:py-28">
        <Reveal className="mx-auto max-w-4xl">
          <p className="font-heading text-3xl font-medium leading-tight md:text-5xl">
            <span className="text-lavender-text">[TEAM INSIGHT</span> - one sentence with the % and what it&apos;s out
            of<span className="text-lavender-text">]</span>
          </p>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Built for [WHO - age range, situation]. Source: NHS England, Mental Health of Children and Young People in
            England, 2023.
          </p>
        </Reveal>
      </section>

      <section id="stories" className="scroll-mt-24 px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-4xl font-semibold md:text-5xl">People who reached out</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Different people, different first steps. Each one started with telling someone.
            </p>
            <p className="mt-3 inline-block rounded-full bg-surface px-4 py-1.5 text-sm text-muted-foreground">
              These are illustrative examples written for this prototype.
            </p>
          </Reveal>
          <div className="mt-10">
            <StoryWall />
          </div>
        </div>
      </section>

      <section id="share" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
          <Reveal className="lg:pt-10">
            <div className="flex -space-x-3" aria-hidden>
              {stories.slice(0, 5).map((s) => (
                <StoryAvatar key={s.id} seed={s.avatarSeed} size={52} decorative className="ring-4 ring-[var(--bg-to)]" />
              ))}
            </div>
            <h2 className="mt-6 text-4xl font-semibold md:text-5xl">Your story could be someone&apos;s first step.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Tell us how reaching out went for you. A real person reads every story before anything is shared.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ShareFlow compact />
          </Reveal>
        </div>
      </section>
    </>
  );
}
