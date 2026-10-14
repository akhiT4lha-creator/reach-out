// DEMO ONLY: shared stories are kept in this browser's localStorage.
// Nothing here is ever shown on the public site. A person reviews each one on /admin.
// A real service would send these to a secure, moderated backend instead.

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  createdAt: string;
  displayName: string;
  ageRange: string;
  reachedOutTo: string;
  story: string;
  avatarSeed: string;
  /** Moderator-only. Used to check the story is genuine. Never displayed publicly. */
  email: string;
  emailVerified: boolean;
  consent: true;
  status: SubmissionStatus;
};

const KEY = "reach-out:submissions";

export function loadSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Submission[]) : [];
  } catch {
    return [];
  }
}

function save(list: Submission[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage blocked (private mode): the demo just won't persist
  }
  window.dispatchEvent(new Event("reach-out:submissions"));
}

/** For useSyncExternalStore: the raw stored string (stable between reads). */
export function submissionsSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function subscribeSubmissions(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("reach-out:submissions", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("reach-out:submissions", cb);
  };
}

export function addSubmission(s: Omit<Submission, "id" | "createdAt" | "status">) {
  const list = loadSubmissions();
  const entry: Submission = {
    ...s,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  save([entry, ...list]);
  return entry;
}

export function setSubmissionStatus(id: string, status: SubmissionStatus) {
  const list = loadSubmissions().map((s) => (s.id === id ? { ...s, status } : s));
  save(list);
  return list;
}

export function clearSubmissions() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event("reach-out:submissions"));
}
