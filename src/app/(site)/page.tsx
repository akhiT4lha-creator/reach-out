import { Hero } from "@/components/hero/Hero";
import { Reveal } from "@/components/site/Reveal";
import { ShareFlow } from "@/components/share/ShareFlow";
import { StoryWall } from "@/components/stories/StoryWall";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { GuideGallery } from "@/components/pulse/GuideGallery";
import { EvidenceSection } from "@/components/pulse/HomeSections";
import { genuineStories, stories } from "@/data/stories";

// Reading order (matches src/data/pulse/sections.ts and the nav).
// The nav ids sit on each section's content, not the section, so a nav jump lands on the heading
// (html's scroll-padding-top keeps it clear of the sticky nav).
// the stat → guides → stories → share.
export default function Home() {
  return (
    <>
      <Hero />

      <section aria-labelledby="why-title" className="px-4 py-12 md:px-6 md:py-16">
        <div id="why" className="mx-auto max-w-6xl">
          <Reveal>
            <EvidenceSection />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="guides-title" className="px-4 py-16 md:px-6 md:py-24">
        <div id="guides" className="mx-auto max-w-6xl">
          <Reveal>
            <h2 id="guides-title" className="max-w-3xl text-4xl font-semibold md:text-5xl">
              Different personalities. <span className="text-lavender-text">The same possibilities.</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Seven AI guides with the same knowledge. Pick the conversational style that feels comfortable.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <GuideGallery />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="stories-title" className="px-4 py-12 md:px-6 md:py-20">
        <div id="stories" className="mx-auto max-w-6xl">
          <Reveal>
            <h2 id="stories-title" className="text-4xl font-semibold md:text-5xl">
              Every first step has a <span className="text-sage-text">story.</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              A first conversation can bring clarity, more questions or mixed feelings. Different people, different first steps.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              <span className="rounded-full bg-surface-strong px-4 py-1.5">Example stories written for this prototype, not real people</span>
              <span className="rounded-full bg-surface px-4 py-1.5 text-muted-foreground">
                {genuineStories.length === 0 ? "Real contributions: none published yet" : `${genuineStories.length} real contributions`}
              </span>
            </div>
          </Reveal>
          <div className="mt-10">
            <StoryWall />
          </div>
        </div>
      </section>

      <section aria-labelledby="share-title" className="px-4 py-16 md:px-6 md:py-24">
        <div id="share" className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
          <Reveal className="lg:pt-10">
            <div className="flex -space-x-3" aria-hidden>
              {stories.slice(0, 5).map((s) => (
                <StoryAvatar key={s.id} seed={s.avatarSeed} size={52} decorative className="ring-4 ring-[var(--bg-to)]" />
              ))}
            </div>
            <h2 id="share-title" className="mt-6 text-4xl font-semibold md:text-5xl">
              Your story could be someone&apos;s first step.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Try how sharing would work. Submissions are closed until secure storage and human review are ready, so nothing is sent or saved.
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
