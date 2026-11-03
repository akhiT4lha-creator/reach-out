"use client";

import { useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import { useMotionPrefs } from "@/components/motion/MotionProvider";
import { StoryModal } from "@/components/stories/StoryModal";
import { getStory, type Story } from "@/data/stories";
import { orbitStories, type OrbitStory } from "@/data/storyOrbit";
import { cn } from "@/lib/utils";

// The hero's "Our Stories" orbit: a gentle conveyor, not a spinning wheel.
// Bubbles enter off-screen bottom-right, curve around the centre circle, and leave off-screen top-right.
// It never pauses: a hovered bubble grows slightly and shows its preview while it keeps moving.
//
// Crowding rules hold by construction. Each bubble owns a fixed, evenly spaced slot on the path, so
// there are never more than SLOTS bubbles and they can't drift together. A slot only takes its next
// story once its bubble has left the screen. The path keeps a visible gap around the centre circle.
//
// Positions are written straight to the DOM each frame, so nothing re-renders while it moves.

const SECONDS_PER_TRIP = 24;
const SLOTS_DESKTOP = 9;
const SLOTS_TABLET = 6;
/** A bubble is laid out at this size and scaled down, so resizing only animates transform. */
const BOX = 220;
/** Bubbles entering or leaving are this fraction of the largest size (never under 90px on desktop). */
const SMALLEST = 0.58;
const HOVER_GROW = 0.08;
const CAPTION_WIDTH = 230;
/** How much slower the ends of the path are than the middle (the ease in and out). */
const EASE = 0.35;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const tints = ["bg-lavender/25", "bg-sky/25", "bg-sage/25", "bg-apricot/25"];

type Path = {
  points: { x: number; y: number; at: number }[];
  length: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  bubble: number;
  smallest: number;
  circle: number;
};

/** Smooth curve through the given points, sampled and measured so it can be walked at an even speed. */
function buildPath(w: number, h: number): Path {
  const ry = Math.min(h * 0.38, w * 0.44);
  const rx = Math.min(w * 0.44, ry * 1.15);
  const cx = w * 0.54;
  const cy = h / 2;
  const size = Math.min(w, h);
  // Stages under 520px wide are tablets. Desktop keeps the largest bubbles at 140-160px.
  const bubble = w < 520 ? Math.max(100, size * 0.24) : Math.min(160, Math.max(140, size * 0.2));
  const smallest = w < 520 ? bubble * SMALLEST : Math.max(90, bubble * SMALLEST);
  const circle = Math.min(rx, ry) * (w < 520 ? 0.8 : 0.96);
  // Angles run clockwise on screen from the right: along the bottom, up the left, over the top.
  const loop: [number, number][] = [
    [62, 1.12],
    [100, 1.02],
    [145, 0.94],
    [190, 0.9],
    [235, 0.94],
    [280, 1.04],
    [315, 1.16],
  ];
  const way = [
    { x: w + 170, y: h + 150 },
    ...loop.map(([deg, r]) => ({
      x: cx + Math.cos((deg * Math.PI) / 180) * rx * r,
      y: cy + Math.sin((deg * Math.PI) / 180) * ry * r,
    })),
    { x: w + 170, y: -170 },
  ];
  const points: Path["points"] = [];
  let length = 0;
  for (let i = 0; i < way.length - 1; i++) {
    const [a, b, c, d] = [way[Math.max(0, i - 1)], way[i], way[i + 1], way[Math.min(way.length - 1, i + 2)]];
    for (let s = 0; s < 40; s++) {
      const t = s / 40;
      const q = (k: "x" | "y") =>
        0.5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t * t * t);
      const p = { x: q("x"), y: q("y") };
      const last = points[points.length - 1];
      if (last) length += Math.hypot(p.x - last.x, p.y - last.y);
      points.push({ ...p, at: length });
    }
  }
  const end = way[way.length - 1];
  length += Math.hypot(end.x - points[points.length - 1].x, end.y - points[points.length - 1].y);
  points.push({ ...end, at: length });
  return { points, length, w, h, cx, cy, rx, ry, bubble, smallest, circle };
}

function pointAt(path: Path, fraction: number) {
  const target = fraction * path.length;
  let lo = 0;
  let hi = path.points.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (path.points[mid].at < target) lo = mid;
    else hi = mid;
  }
  const [a, b] = [path.points[lo], path.points[hi]];
  const t = b.at === a.at ? 0 : (target - a.at) / (b.at - a.at);
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

function Orbit({ slots, onOpen, storyOpen }: { slots: number; onOpen: (s: OrbitStory) => void; storyOpen: boolean }) {
  const { calm, loops } = useMotionPrefs();
  const stage = useRef<HTMLDivElement>(null);
  const centre = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLDivElement | null)[]>([]);
  const faces = useRef<(HTMLDivElement | null)[]>([]);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const path = useRef<Path | null>(null);
  const clock = useRef(0);
  const lastU = useRef<number[]>([]);
  const grow = useRef<number[]>(Array(slots).fill(0));
  const captionFit = useRef<({ height: number; above: boolean } | null)[]>([]);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const focusedSlot = useRef<number | null>(null);
  const nextStory = useRef(slots % orbitStories.length);
  const [assigned, setAssigned] = useState(() => Array.from({ length: slots }, (_, i) => i % orbitStories.length));

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Zero when hidden on phones: the frame loop below then does nothing.
      path.current = width > 0 ? buildPath(width, height) : null;
      if (path.current && centre.current) {
        centre.current.style.width = `${path.current.circle}px`;
        centre.current.style.height = `${path.current.circle}px`;
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Bubbles move under a resting mouse, so hover is worked out each frame rather than from enter and leave events.
  // After a mouse click or a tap, the browser leaves focus on the bubble, which would hold it enlarged.
  // Let go as soon as the mouse moves or the story closes. Keyboard users keep their place.
  useEffect(() => {
    let usedPointer = false;
    const release = () => {
      const el = document.activeElement;
      if (el instanceof HTMLElement && stage.current?.contains(el)) el.blur();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.current = e.target instanceof Node && stage.current?.contains(e.target) ? { x: e.clientX, y: e.clientY } : null;
      release();
    };
    const onLeave = () => {
      mouse.current = null;
    };
    const onDown = () => {
      usedPointer = true;
    };
    const onKey = () => {
      usedPointer = false;
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey, true);
    const afterClose = storyOpen
      ? undefined
      : setTimeout(() => {
          if (usedPointer) release();
        }, 400);
    return () => {
      clearTimeout(afterClose);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [storyOpen]);

  useAnimationFrame((_, delta) => {
    const p = path.current;
    if (!p || !stage.current) return;
    const dt = Math.min(delta, 100) / 1000;
    if (!calm && loops) clock.current += dt;

    const box = mouse.current && !storyOpen ? stage.current.getBoundingClientRect() : null;
    const pointer = box && mouse.current ? { x: mouse.current.x - box.left, y: mouse.current.y - box.top } : null;

    for (let i = 0; i < slots; i++) {
      const anchor = anchors.current[i];
      const face = faces.current[i];
      const caption = captions.current[i];
      if (!anchor || !face || !caption) continue;

      const u = calm ? 0.15 + (i * 0.7) / Math.max(1, slots - 1) : (clock.current / SECONDS_PER_TRIP + i / slots) % 1;
      // Wrapped round means this bubble has left the screen: only now does the slot take the next story.
      if (!calm && u < (lastU.current[i] ?? u)) {
        setAssigned((list) => list.map((story, s) => (s === i ? nextStory.current : story)));
        nextStory.current = (nextStory.current + 1) % orbitStories.length;
      }
      lastU.current[i] = u;

      const fraction = calm ? u : u - (EASE / (2 * Math.PI)) * Math.sin(2 * Math.PI * u);
      const at = pointAt(p, fraction);
      const x = at.x;
      const y = at.y + (calm ? 0 : Math.sin(clock.current * 0.9 + i * 1.7) * 6);

      // Nearest the centre: largest and most opaque. Entering or leaving: smaller and faded.
      const near = clamp01(1 - (Math.hypot((at.x - p.cx) / p.rx, (at.y - p.cy) / p.ry) - 0.9) / 0.55);
      const edge = calm ? 1 : clamp01(Math.min(u, 1 - u) / 0.12);
      const size = lerp(p.smallest, p.bubble, near);

      const hovered = !!pointer && Math.hypot(pointer.x - x, pointer.y - y) < size / 2;
      grow.current[i] += ((hovered || focusedSlot.current === i ? 1 : 0) - grow.current[i]) * Math.min(1, dt * 9);
      const g = grow.current[i];

      anchor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      anchor.style.opacity = String(lerp(lerp(0.45, 1, near) * edge, 1, g));
      anchor.style.zIndex = g > 0.01 ? "3" : "2";
      anchor.style.visibility = edge < 0.02 ? "hidden" : "visible";
      face.style.transform = `scale(${(size / BOX) * (1 + HOVER_GROW * g)})`;

      // The preview caption travels with its bubble. Which side it sits on is chosen once per hover, so it never jumps.
      if (g < 0.01) {
        captionFit.current[i] = null;
        caption.style.opacity = "0";
        continue;
      }
      const radius = (size * (1 + HOVER_GROW * g)) / 2;
      const height = captionFit.current[i]?.height ?? caption.offsetHeight;
      const fit = (captionFit.current[i] ??= { height, above: y - radius - 12 - height >= 8 });
      const left = Math.min(Math.max(x - CAPTION_WIDTH / 2, 8), p.w - CAPTION_WIDTH - 8);
      const top = Math.min(Math.max(fit.above ? y - radius - 12 - fit.height : y + radius + 12, 8), p.h - fit.height - 8);
      caption.style.transform = `translate3d(${left - x}px, ${top - y}px, 0)`;
      caption.style.opacity = String(g);
    }
  });

  return (
    <div ref={stage} className="absolute inset-0">
      <div
        ref={centre}
        className="absolute left-[54%] top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 lg:size-72"
      >
        <span aria-hidden className="sea-glass-shadow absolute inset-[4%]" />
        <div className="sea-glass absolute inset-0 grid place-items-center text-center text-ink">
          <h2 id="our-stories-orbit" className="max-w-[6ch] text-2xl font-semibold leading-tight lg:max-w-none lg:whitespace-nowrap lg:text-4xl">
            Our Stories
          </h2>
        </div>
      </div>

      {assigned.map((storyIndex, i) => {
        const s = orbitStories[storyIndex];
        return (
          <div
            key={i}
            ref={(el) => {
              anchors.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => {
                faces.current[i] = el;
              }}
              className="will-change-transform"
              style={{ width: BOX, height: BOX, marginLeft: -BOX / 2, marginTop: -BOX / 2 }}
            >
              <button
                type="button"
                onClick={() => onOpen(s)}
                onFocus={() => {
                  focusedSlot.current = i;
                }}
                onBlur={() => {
                  focusedSlot.current = null;
                }}
                aria-label={`Read ${s.name}'s example story, age ${s.age}: ${s.preview}`}
                className={cn(
                  "relative size-full rounded-full bg-background text-center",
                  "shadow-[inset_0_2px_0_rgb(255_255_255/0.15),0_16px_44px_rgb(20_27_48/0.28)] morning:shadow-[inset_0_2px_0_rgb(255_255_255/0.6),0_16px_44px_rgb(120_80_60/0.14)]",
                )}
              >
                <span aria-hidden className={cn("absolute inset-0 rounded-full", tints[storyIndex % 4])} />
                <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <StoryAvatar seed={s.avatarSeed} size={104} decorative />
                  <span className="font-heading text-[28px] font-semibold leading-none">
                    {s.name}, {s.age}
                  </span>
                </span>
              </button>
            </div>
            <div
              ref={(el) => {
                captions.current[i] = el;
              }}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 rounded-[20px] bg-popover px-4 py-3 text-sm leading-snug text-popover-foreground shadow-[0_12px_32px_rgb(20_27_48/0.3)]"
              style={{ width: CAPTION_WIDTH, opacity: 0 }}
            >
              {s.preview}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StoryRow({ onOpen }: { onOpen: (s: OrbitStory) => void }) {
  const { calm } = useMotionPrefs();
  const renderBubbles = (clone: boolean) =>
    orbitStories.map((s, i) => (
      <li key={s.id} className="shrink-0" aria-hidden={clone || undefined}>
        <button
          type="button"
          tabIndex={clone ? -1 : undefined}
          onClick={() => onOpen(s)}
          aria-label={clone ? undefined : `Read ${s.name}'s example story, age ${s.age}: ${s.preview}`}
          className={cn("flex size-32 flex-col items-center justify-center gap-1 rounded-full text-center", tints[i % 4])}
        >
          <StoryAvatar seed={s.avatarSeed} size={56} decorative />
          <span className="font-heading text-[15px] font-semibold leading-tight">
            {s.name}, {s.age}
          </span>
        </button>
      </li>
    ));

  return (
    <section aria-labelledby="our-stories-row" className="relative z-10 pb-10 pt-10 md:hidden">
      <h2 id="our-stories-row" className="px-4 text-2xl font-semibold">
        Our Stories
      </h2>
      <div className={cn("mt-4", calm ? "overflow-x-auto overscroll-x-contain px-4" : "overflow-hidden")}>
        <ul className={cn("flex w-max gap-3", !calm && "story-row")}>
          {renderBubbles(false)}
          {!calm && renderBubbles(true)}
        </ul>
      </div>
    </section>
  );
}

const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function StoryOrbit() {
  const [open, setOpen] = useState<Story | null>(null);
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
  const slots = Math.min(desktop ? SLOTS_DESKTOP : SLOTS_TABLET, orbitStories.length);
  const openStory = (s: OrbitStory) => setOpen(getStory(s.id) ?? null);

  return (
    <>
      <section aria-labelledby="our-stories-orbit" className="relative z-10 hidden md:block">
        {/* key: a new slot count starts a fresh, evenly spaced conveyor */}
        <Orbit key={slots} slots={slots} onOpen={openStory} storyOpen={!!open} />
      </section>
      <StoryRow onOpen={openStory} />
      <StoryModal story={open} onClose={() => setOpen(null)} />
    </>
  );
}
