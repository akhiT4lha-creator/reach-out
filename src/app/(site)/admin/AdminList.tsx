"use client";

import { Check, Trash, X, Tray } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { StoryAvatar } from "@/components/avatar/StoryAvatar";
import {
  clearSubmissions,
  setSubmissionStatus,
  submissionsSnapshot,
  subscribeSubmissions,
  type Submission,
  type SubmissionStatus,
} from "@/lib/submissions";
import { cn } from "@/lib/utils";

const statusStyle: Record<SubmissionStatus, string> = {
  pending: "bg-sky/25 text-foreground",
  approved: "bg-sage/30 text-foreground",
  rejected: "bg-foreground/10 text-muted-foreground",
};

export function AdminList() {
  // null on the server (shows the skeleton), the stored JSON string in the browser
  const raw = useSyncExternalStore(subscribeSubmissions, submissionsSnapshot, () => null);
  const list = useMemo<Submission[] | null>(() => {
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as Submission[];
    } catch {
      return [];
    }
  }, [raw]);

  if (list === null) {
    return (
      <div className="grid gap-4" aria-hidden>
        {[0, 1].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-[28px] bg-surface" />
        ))}
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="rounded-[32px] bg-surface p-10 text-center">
        <Tray size={48} weight="duotone" className="mx-auto text-lavender-text" aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold">Nothing waiting for review</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
          Stories shared on this device will appear here as pending.
        </p>
        <Link href="/share" className="squish mt-6 inline-flex h-12 items-center rounded-full bg-apricot px-6 font-semibold text-ink">
          Share a test story
        </Link>
      </div>
    );
  }

  const pending = list.filter((s) => s.status === "pending").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground" aria-live="polite">
          {pending} waiting · {list.length} total
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("Delete all demo submissions on this device? This can't be undone.")) {
              clearSubmissions();
            }
          }}
          className="squish inline-flex h-11 items-center gap-2 rounded-full bg-surface-strong px-4 font-semibold hover:bg-accent"
        >
          <Trash size={18} weight="duotone" aria-hidden /> Clear all demo data
        </button>
      </div>
      <ul className="grid gap-4">
        {list.map((s) => (
          <li key={s.id} className="rounded-[28px] bg-surface p-6 md:p-7">
            <div className="flex flex-wrap items-start gap-4">
              <StoryAvatar seed={s.avatarSeed} size={52} decorative />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-xl font-semibold">
                    {s.displayName}, {s.ageRange}
                  </h2>
                  <span className={cn("rounded-full px-3 py-0.5 text-sm font-semibold capitalize", statusStyle[s.status])}>{s.status}</span>
                </div>
                <p className="text-base text-muted-foreground">
                  Reached out to: {s.reachedOutTo} · {new Date(s.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <p className="mt-1 break-all text-base text-muted-foreground">
                  Email (moderators only): <span className="font-semibold text-foreground">{s.email}</span>{" "}
                  {s.emailVerified ? "· verified" : "· not verified"}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-[70ch] whitespace-pre-line">{s.story}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={s.status === "approved"}
                onClick={() => setSubmissionStatus(s.id, "approved")}
                className="squish inline-flex h-11 items-center gap-2 rounded-full bg-sage px-5 font-semibold text-ink disabled:opacity-50"
              >
                <Check size={18} weight="bold" aria-hidden /> Approve
              </button>
              <button
                type="button"
                disabled={s.status === "rejected"}
                onClick={() => setSubmissionStatus(s.id, "rejected")}
                className="squish inline-flex h-11 items-center gap-2 rounded-full bg-surface-strong px-5 font-semibold hover:bg-accent disabled:opacity-50"
              >
                <X size={18} weight="bold" aria-hidden /> Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
