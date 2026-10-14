import type { Metadata } from "next";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";

export const metadata: Metadata = { title: "Help me reach out | Reach Out" };

export default function ReachOutPage() {
  return <Walkthrough />;
}
