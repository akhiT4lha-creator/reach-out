import { Hero } from "@/components/hero/Hero";
import { Reveal } from "@/components/site/Reveal";
import { ShareFlow } from "@/components/share/ShareFlow";
import { StoryWall } from "@/components/stories/StoryWall";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { AboutSection, StepLabel } from "@/components/pulse/AboutSection";
import { GuideGallery } from "@/components/pulse/GuideGallery";
import { EvidenceSection, FinalCall, FirstStepExplorer, QuestionInvite } from "@/components/pulse/HomeSections";
import { genuineStories, stories } from "@/data/stories";
import { product } from "@/data/pulse/product";

// Reading order (matches src/data/pulse/sections.ts and the nav):
// what PULSE is → why it matters → step 1 understand → step 2 prepare → step 3 talk → stories → share.
export default function Home() {
  return (
    <>
      <Hero />

      <section id="about" aria-labelledby="about-title" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mx-auto max-w-6xl">
          <AboutSection />
        </Reveal>
      </section>

      <section id="why" aria-labelledby="why-title" className="scroll-mt-24 px-4 py-12 md:px-6 md:py-16">
        <Reveal className="mx-auto max-w-6xl">
          <EvidenceSection />
        </Reveal>
      </section>

      <section id="first-step" aria-labelledby="first-step-title" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <StepLabel step={1} />
            <h2 id="first-step-title" className="text-4xl font-semibold md:text-5xl">
              A little less <span className="text-sky-text">unknown.</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              See what contacting a service involves, one step at a time. Check each source before you decide anything.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <FirstStepExplorer />
          </Reveal>
        </div>
      </section>

      <section id="prepare-question" aria-labelledby="prepare-question-title" className="scroll-mt-24 px-4 py-12 md:px-6 md:py-16">
        <Reveal className="mx-auto max-w-6xl">
          <QuestionInvite />
        </Reveal>
      </section>

      <section id="guides" aria-labelledby="guides-title" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <StepLabel step={3} />
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

      <section id="stories" aria-labelledby="stories-title" className="scroll-mt-24 px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
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

      <section id="share" aria-labelledby="share-title" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
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

      <section aria-labelledby="final-title" className="px-4 py-16 text-center md:px-6 md:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 id="final-title" className="text-4xl font-semibold md:text-6xl">
            The first step <span className="text-apricot-text">can be a question.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Start with what you want to understand.</p>
          <div className="mt-8">
            <FinalCall />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{product.status}</p>
        </Reveal>
      </section>
    </>
  );
}
