import type { Metadata } from "next";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";

export const metadata: Metadata = { title: "Start here | PULSE: FIRST LOOK" };

export default function StartPage() {
  return <Walkthrough />;
}
