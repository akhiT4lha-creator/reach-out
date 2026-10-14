// PULSE source register, imported record-for-record from PULSE-Website.html (`we`, `Te`, `Ee`, `P`, `Ae`).
// Wording, dates and review metadata are imported claims: check the original source before changing them.
//
// "published" here means "included in this demo", NOT clinically approved.
// Draft records must never reach student-facing answers (see eligibleSources below,
// which the server route uses; the client never decides eligibility for the model).

import { guideIds, type GuideId } from "./guides";

export type ServiceId = "childline" | "example-school" | "real-service";
export type ContentClass = "service" | "product" | "dataset";
export type ReviewStatus = "published" | "draft";

export type SourceRecord = {
  entry_id: string;
  /** "all" = not tied to one service (product notes, NHS evidence). */
  service_id: ServiceId | "all";
  content_class: ContentClass;
  topic: string;
  approved_explanation: string;
  /** Verbatim quotation where the HTML had one; empty when only a summary exists. */
  source_quote: string;
  source_title: string;
  source_url: string;
  source_location: string;
  source_version: string;
  review_status: ReviewStatus;
  review_type: string;
  reviewer: string;
  reviewed_at: string;
  allowed_guide_ids: GuideId[];
  is_demo: boolean;
  questions: string[];
  critical?: boolean;
};

const CONTACT = "https://www.childline.org.uk/get-support/contacting-childline/";
const CHAT = "https://www.childline.org.uk/get-support/1-2-1-counsellor-chat/";
const CONFIDENTIALITY = "https://www.childline.org.uk/about/confidentiality-promise/";
export const NHS_URL =
  "https://digital.nhs.uk/data-and-information/publications/statistical/mental-health-of-children-and-young-people-in-england/2023-wave-4-follow-up/";

// The export first gave some records persona-specific access, then expanded every record
// to all seven guides. That final shared-access behaviour is what we keep.
// Every guide shares the same three starter questions in the export.
const STARTERS = [
  "What happens when I first get in touch?",
  "Who can see what I share?",
  "Help me find the words to ask.",
];

const ALL_GUIDES: GuideId[] = [...guideIds];

function childline(
  entry_id: string,
  topic: string,
  approved_explanation: string,
  source_url: string,
  source_location: string,
  source_quote = "",
): SourceRecord {
  return {
    entry_id,
    service_id: "childline",
    content_class: "service",
    topic,
    approved_explanation,
    source_quote,
    source_title:
      source_url === CONFIDENTIALITY
        ? "Childline · Confidentiality promise"
        : source_url === CHAT
          ? "Childline · 1-2-1 counsellor chat"
          : "Childline · Contacting Childline",
    source_url,
    source_location,
    source_version: "Retrieved 7 October 2026",
    review_status: "published",
    review_type: "Public-source implementation check; service review pending",
    reviewer: "No Childline endorsement or independent review",
    reviewed_at: "2026-10-07",
    allowed_guide_ids: ALL_GUIDES,
    is_demo: false,
    questions: [],
  };
}

const school = {
  service_id: "example-school" as const,
  content_class: "service" as const,
  source_title: "Example school support service (fictional demonstration policy)",
  source_url: "",
  source_version: "Demo v1",
  review_status: "published" as const,
  review_type: "Illustrative content; not a real service policy",
  reviewer: "No school or clinical review",
  reviewed_at: "",
  is_demo: true,
  allowed_guide_ids: ALL_GUIDES,
};

export const sources: SourceRecord[] = [
  childline(
    "cl-contact",
    "Ways to contact",
    "You can phone Childline on 0800 1111, use its online 1-2-1 chat, or send an account message. These connect you with Childline counsellors. PULSE only previews the process.",
    CONTACT,
    "Speaking to Childline",
    "You can call us for free on 0800 1111",
  ),
  childline(
    "cl-chat",
    "Online chat steps",
    "Create a Childline account, open its chat bot and choose to start a chat. When a counsellor becomes available, you can exchange messages. The page gives no guaranteed queue time.",
    CHAT,
    "Using 1-2-1 chats",
    "When a Childline counsellor is available",
  ),
  childline(
    "cl-wait",
    "Reply and waiting times",
    "Childline says account messages usually receive a reply within a day. This is different from waiting for a live chat; the indexed guidance gives no guaranteed live-chat waiting time.",
    CONTACT,
    "Sending us a message",
  ),
  childline(
    "cl-privacy",
    "Confidentiality and its limits",
    "Childline describes conversations as confidential, with exceptions: you request sharing; someone’s life is at risk; a trusted adult hurting you could hurt other children; you are seriously hurting someone; another child is being hurt and cannot report or understand it; or the law requires sharing. It says it will try to discuss sharing with you first. This is not an unconditional promise that parents will never be told.",
    CONFIDENTIALITY,
    "Confidentiality at Childline; What happens if we need to tell someone",
    "We only might need to say or do something if:",
  ),
  childline(
    "cl-records",
    "Notes and information visible to Childline",
    "Counsellors keep notes that another Childline counsellor can read if you return. Childline can see your phone number when you call or your IP address online. PULSE and Childline are separate services.",
    CONFIDENTIALITY,
    "What will you know about me?",
  ),
  childline(
    "cl-choice",
    "What to share first",
    "Childline says you can share as much or as little as you choose. You can ask about confidentiality before discussing your situation. This does not remove its information-sharing exceptions.",
    CONFIDENTIALITY,
    "What will you know about me?; Is Childline’s confidentiality the same as at school?",
  ),
  childline(
    "cl-access",
    "Communication options",
    "Childline offers phone, typed chat and account messages. Deaf users can use BSL through an interpreter. Counselling languages are English and Welsh; Welsh-speaking availability varies. Check the contact page for access details and interpreter hours.",
    CONTACT,
    "Signing to a counsellor; Speaking to Childline in other languages",
  ),
  childline(
    "cl-return",
    "Returning after a chat ends",
    "If a chat disconnects, you can come back. You may speak to a different counsellor. Childline also offers account messages if you cannot wait for a live chat.",
    CHAT,
    "What if I get cut off?",
  ),
  {
    ...school,
    entry_id: "demo-sharing",
    topic: "Information sharing",
    source_location: "Section 1",
    source_quote:
      "In this fictional service, an initial request is read by the pastoral team. Information may be shared with safeguarding staff when there is a concern about safety. This example does not establish the rules of any real school.",
    approved_explanation:
      "In this fictional example, the pastoral team reads the first request. Information may be shared with safeguarding staff if there is a concern about safety. This is not a promise of secrecy or the policy of your school. You can ask your actual service who would see a request before deciding what to share.",
    questions: [...STARTERS],
    critical: true,
  },
  {
    ...school,
    entry_id: "demo-first",
    topic: "First contact",
    source_location: "Section 2",
    source_quote:
      "In this fictional service, a student can ask the pastoral team about the support process before making a support request. The team explains the next step. No response time is specified.",
    approved_explanation:
      "In this fictional example, you can first ask the pastoral team how the support process works. The team then explains the next step. The example does not specify a response time or require a personal history for a process question. Check with your actual service rather than assuming it follows this example.",
    questions: [STARTERS[0], STARTERS[2]],
    critical: true,
  },
  {
    ...school,
    entry_id: "demo-choice",
    topic: "Choices before contact",
    source_location: "Section 3",
    source_quote:
      "In this fictional service, students can ask questions about the process before making a support request. This example does not describe rights to cancel a referral or prevent safeguarding action.",
    approved_explanation:
      "The fictional example lets a student ask about the process before making a request. You also choose whether to copy a question from this website. The source does not establish a right to stop a referral or prevent safeguarding action. Ask the real service about those limits.",
    questions: [STARTERS[0], STARTERS[1]],
    critical: true,
  },
  {
    ...school,
    entry_id: "demo-access",
    topic: "Contact formats",
    source_location: "Section 4",
    source_quote:
      "A student may ask the fictional pastoral team which contact formats and adjustments are available. Specific adjustments, interpretation and companion arrangements are not listed.",
    approved_explanation:
      "You can prepare a question asking which contact formats or adjustments are available. This fictional source does not list specific adjustments, interpreters or companion arrangements, so I cannot say they are offered. Ask your actual service to confirm an option that works for you.",
    questions: [STARTERS[0]],
  },
  {
    entry_id: "product-start",
    service_id: "all",
    content_class: "product",
    topic: "Using FIRST LOOK",
    approved_explanation:
      "FIRST LOOK is a preview of how asking for support could work. Every personality can explain contact, privacy, choices, access and the evidence, and help prepare a question. Choose the conversational style you prefer. You do not need to tell us your personal story. The school service in this version is a clearly labelled fictional example.",
    source_quote:
      "This version offers seven focused guides, fictional service examples and the supplied NHS survey finding. It does not diagnose, counsel or send messages.",
    source_title: "PULSE product scope",
    source_url: "",
    source_location: "Prototype scope",
    source_version: "v1",
    review_status: "published",
    review_type: "Implementation description",
    reviewer: "Not a clinical review",
    reviewed_at: "",
    allowed_guide_ids: ALL_GUIDES,
    is_demo: false,
    questions: [...STARTERS],
  },
  {
    entry_id: "product-words",
    service_id: "all",
    content_class: "product",
    topic: "Drafting a process question",
    approved_explanation:
      "You could start with: “Before I make a request, could you explain who would see it and what happens next?” You can edit this in the first-step panel. It asks about the process without needing your personal story. PULSE will not send it for you.",
    source_quote:
      "Suggested process question: Before I make a request, could you explain who would see it and what happens next? The user can edit and copy this template. Nothing is sent automatically.",
    source_title: "PULSE question template",
    source_url: "",
    source_location: "First-step template",
    source_version: "v1",
    review_status: "published",
    review_type: "Product template",
    reviewer: "Not service policy",
    reviewed_at: "",
    allowed_guide_ids: ALL_GUIDES,
    is_demo: false,
    questions: [...STARTERS],
  },
  {
    entry_id: "nhs-help",
    service_id: "all",
    content_class: "dataset",
    topic: "Help seeking",
    approved_explanation:
      "In the 2023 NHS survey, 44.6% of 17–24-year-old respondents who reported a mental health or emotional, behavioural or concentration concern did not seek help or advice; 55.4% did. The unweighted base was 374 and the question covered approximately the previous year. These group figures do not explain why people did not seek help, predict anyone’s needs, or prove FIRST LOOK works.",
    source_quote:
      "Table 3.5, age 17 to 24, All young people in age group: Sought help or advice 55.4%; Did not seek help or advice 44.6%; unweighted base 374. Denominator: respondents who reported a mental health or emotional, behavioural or concentration concern.",
    source_title: "NHS England: Mental Health of Children and Young People in England, 2023",
    source_url: NHS_URL,
    source_location: "Student CSV extract · Table 3.5 · Q17 and Q18",
    source_version: "2023 survey",
    review_status: "published",
    review_type: "Checked against the supplied CSV",
    reviewer: "No independent clinical review",
    reviewed_at: "2026-10-07",
    allowed_guide_ids: ALL_GUIDES,
    is_demo: false,
    questions: [...STARTERS],
  },
  {
    ...school,
    entry_id: "draft-hidden",
    topic: "Draft example",
    source_location: "Unpublished",
    source_quote: "This record is a draft.",
    approved_explanation: "This record must not appear in student answers.",
    review_status: "draft",
    questions: [],
  },
];


export function getSources(ids: string[]): SourceRecord[] {
  return sources.filter((s) => ids.includes(s.entry_id));
}

/**
 * Records a guide may use for a given service: published only, matching the service or "all",
 * and allowed for that guide. Used by the server before anything reaches a model.
 */
export function eligibleSources(service: ServiceId, guide: GuideId): SourceRecord[] {
  return sources.filter(
    (s) =>
      s.review_status === "published" &&
      (s.service_id === service || s.service_id === "all") &&
      s.allowed_guide_ids.includes(guide),
  );
}
