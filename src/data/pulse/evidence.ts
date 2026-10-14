// The NHS finding PULSE uses, imported from PULSE-Website.html (record `nhs-help`).
// These are imported source claims. Check the original dataset before changing wording or numbers.
// They are NOT PULSE user analytics or success rates.

import { NHS_URL } from "./sources";

export const nhsFinding = {
  didNotSeek: 44.6,
  sought: 55.4,
  population:
    "surveyed 17–24-year-olds who reported a mental health or emotional, behavioural or concentration concern",
  unweightedBase: 374,
  table: "Table 3.5",
  source: "NHS England, Mental Health of Children and Young People in England, 2023",
  period: "The question covered approximately the previous year.",
  url: NHS_URL,
  sourceEntryId: "nhs-help",
  limitations:
    "It describes a group. It does not explain why help was not sought, predict an individual’s needs, or show that FIRST LOOK will change outcomes.",
  hypothesis:
    "Previewing the support process may make a first question easier to prepare. That is something to test with students, not a claim this prototype has proved.",
};
