import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { Reveal } from "@/components/site/Reveal";
import { StoryNextStep } from "@/components/stories/StoryNextStep";
import { getStory, stories, storyBoundary } from "@/data/stories";

export function generateStaticParams() {
  return stories.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[id]">): Promise<Metadata> {
  const { id } = await params;
  const story = getStory(id);
  return {
    title: story
      ? `${story.displayName}'s story (example) | PULSE: FIRST LOOK`
      : "Story | PULSE: FIRST LOOK",
  };
}

// The page frame renders instantly; the story itself streams in inside <Suspense>
// (Next.js 16 instant navigation). Every story is prebuilt, so the fallback is rarely seen.
export default function StoryPage({ params }: PageProps<"/stories/[id]">) {
  return (
    <article className="px-4 pb-10 pt-10 md:px-6 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#stories"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-muted-foreground hover:bg-surface hover:text-foreground"
        >
          <ArrowLeft size={18} weight="bold" aria-hidden /> All stories
        </Link>
        <Suspense fallback={<StorySkeleton />}>
          <StoryContent params={params} />
        </Suspense>
      </div>
    </article>
  );
}

function StorySkeleton() {
  return (
    <div aria-hidden className="mt-8 animate-pulse">
      <div className="flex items-center gap-5">
        <div className="blob size-28 bg-surface-strong" />
        <div className="h-10 w-48 rounded-full bg-surface-strong" />
      </div>
      <div className="mt-10 space-y-4">
        <div className="h-5 w-full rounded-full bg-surface" />
        <div className="h-5 w-11/12 rounded-full bg-surface" />
        <div className="h-5 w-4/5 rounded-full bg-surface" />
      </div>
    </div>
  );
}

async function StoryContent({
  params,
}: {
  params: PageProps<"/stories/[id]">["params"];
}) {
  const { id } = await params;
  const story = getStory(id);
  if (!story) notFound();

  return (
    <>
      <Reveal>
        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
          <StoryAvatar
            seed={story.avatarSeed}
            name={story.displayName}
            size={112}
            className="blob"
          />
          <div>
            <h1 className="text-4xl font-semibold md:text-5xl">
              {story.displayName}, {story.age}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Reached out to:{" "}
              <span className="font-semibold text-sage-text">
                {story.reachedOutTo}
              </span>
            </p>
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 max-w-[62ch] space-y-5 text-lg md:text-xl md:leading-relaxed">
          {story.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <figure className="mt-10 rounded-[32px] bg-sage/15 p-7 md:p-9">
          <figcaption className="font-semibold text-sage-text">
            What helped me
          </figcaption>
          <blockquote className="mt-2 font-heading text-2xl font-medium leading-snug md:text-3xl">
            {story.whatHelped}
          </blockquote>
        </figure>
      </Reveal>

      <p className="mt-6 text-sm text-muted-foreground">
        An illustrative example written for this prototype, not a real person or an approved contribution. {storyBoundary}
      </p>

      {/* Signposting: every story ends here. */}
      <Reveal>
        <aside
          aria-label="Take the first step"
          className="relative mt-12 overflow-hidden rounded-[32px] bg-surface-strong p-7 md:p-10"
        >
          <span
            aria-hidden
            className="blob absolute -right-16 -top-16 size-48 bg-apricot/25 blur-2xl"
          />
          <h2 className="relative text-3xl font-semibold">
            If this sounds like you, you could take the first step too.
          </h2>
          <p className="relative mt-3 max-w-lg text-muted-foreground">
            Want to prepare your own words? You can edit a first question here. Nothing is sent for you.
          </p>
          <div className="relative mt-6 flex flex-wrap items-center gap-4">
            <StoryNextStep />
            <CrisisButton variant="text" />
          </div>
        </aside>
      </Reveal>
    </>
  );
}
