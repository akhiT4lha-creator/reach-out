// The three service contexts from PULSE-Website.html (`De`, `Me`, `Ne`).
// Keep them distinct: Childline is a preview of public guidance (no endorsement), the school is
// FICTIONAL, and "your school" has no policy connected. Never invent policies, times or promises.

import type { ServiceId } from "./sources";

export type Service = {
  id: ServiceId;
  name: string;
  /** Label for the service picker. */
  option: string;
  description: string;
  /** Plain statement of what this context is (and is not). */
  boundary: string;
  /** External contact page, if any. Opening it transfers nothing from PULSE. */
  contact: string;
  steps: string[];
  /** Source records behind each step (same index as `steps`). */
  stepSources: string[][];
  /** Extra note shown on a particular step. */
  stepNotes?: Record<number, string>;
  /** Starter question used when moving from this process to an AI guide. */
  guideQuestion: string;
};

export const services: Service[] = [
  {
    id: "childline",
    name: "Childline",
    option: "Childline · public guidance",
    description: "Public guidance preview for UK young people",
    boundary: "Independent preview; Childline has not endorsed PULSE. Service review is pending.",
    contact: "https://www.childline.org.uk/get-support/contacting-childline/",
    steps: [
      "Choose phone, online chat or an account message.",
      "For online chat, create a Childline account and start a chat.",
      "Wait for an available counsellor. No exact chat waiting time is promised.",
      "Ask your process question. You decide what to say.",
    ],
    stepSources: [["cl-contact"], ["cl-chat"], ["cl-chat"], ["cl-choice", "cl-privacy"]],
    stepNotes: {
      3: "Childline has confidentiality exceptions. Ask about those limits before deciding what to share.",
    },
    guideQuestion: "What happens when I first contact Childline?",
  },
  {
    id: "example-school",
    name: "Example school",
    option: "School · fictional example",
    description: "Fictional policy, not your school",
    boundary: "This is fictional, not your school’s policy.",
    contact: "",
    steps: [
      "Prepare a question about the support process.",
      "In this fictional example, the pastoral team receives the request.",
      "They explain the next step. Timing is unspecified.",
      "Check your actual school’s process before relying on this example.",
    ],
    stepSources: [["demo-first"], ["demo-sharing"], ["demo-first"], ["demo-first"]],
    guideQuestion: "What happens first in the fictional school example?",
  },
  {
    id: "real-service",
    name: "Your school",
    option: "Your school · not connected",
    description: "No school policy connected",
    boundary: "No school policy is connected; actual school procedures are unknown.",
    contact: "",
    steps: [
      "Your school’s policy has not been added.",
      "Prepare a process question to ask your school directly.",
    ],
    stepSources: [[], []],
    guideQuestion: "Help me prepare a question to ask my school about its support process.",
  },
];

export function getService(id: ServiceId): Service {
  return services.find((s) => s.id === id) ?? services[0];
}

export function isServiceId(id: unknown): id is ServiceId {
  return typeof id === "string" && services.some((s) => s.id === id);
}
