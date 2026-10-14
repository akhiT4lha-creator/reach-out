"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { stories, storyTagLabels, type Story, type StoryTag } from "@/data/stories";
import { cn } from "@/lib/utils";

const tints = ["bg-lavender/15", "bg-sky/15", "bg-sage/15", "bg-apricot/15"];

function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="mb-5 break-inside-avoid"
    >
      <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
        <Link
          href={`/stories/${story.id}`}
          className={cn(
            "group block rounded-[28px] p-6 transition-colors hover:bg-surface-strong md:p-7",
            tints[index % 4],
          )}
        >
          <div className="flex items-center gap-3">
            <StoryAvatar seed={story.avatarSeed} name={story.displayName} size={52} />
            <div>
              <h3 className="text-xl font-semibold">
                {story.displayName}, {story.age}
              </h3>
              <p className="text-base text-muted-foreground">{story.reachedOutTo}</p>
            </div>
          </div>
          <p className="mt-4 font-heading text-lg leading-snug">&ldquo;{story.opening}&rdquo;</p>
          {index % 3 !== 1 && <p className="mt-3 text-base text-muted-foreground">{story.body[1]}</p>}
          <p className="mt-4 inline-flex items-center gap-2 font-semibold text-apricot-text">
            Read {story.displayName}&apos;s story
            <ArrowRight size={18} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-1" />
          </p>
        </Link>
      </motion.div>
    </motion.li>
  );
}

const filters: (StoryTag | "all")[] = ["all", "friend", "family", "school", "helpline", "gp"];

export function StoryWall() {
  const [filter, setFilter] = useState<StoryTag | "all">("all");
  const list = filter === "all" ? stories : stories.filter((s) => s.tags.includes(filter));

  return (
    <div>
      <div role="group" aria-label="Filter stories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "squish h-11 shrink-0 rounded-full px-5 text-base font-semibold transition-colors",
              filter === f ? "bg-lavender text-ink" : "bg-surface-strong hover:bg-accent",
            )}
          >
            {f === "all" ? "All stories" : storyTagLabels[f]}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {list.length} {list.length === 1 ? "story" : "stories"}
      </p>
      <ul key={filter} className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {list.map((s, i) => (
          <StoryCard key={s.id} story={s} index={i} />
        ))}
      </ul>
    </div>
  );
}
