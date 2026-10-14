import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Fredoka } from "next/font/google";
import { CrisisButton } from "@/components/crisis/CrisisButton";
import { CrisisProvider } from "@/components/crisis/CrisisPanel";
import { MotionProvider, prefsScript } from "@/components/motion/MotionProvider";
import "./globals.css";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const body = Atkinson_Hyperlegible({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Reach Out",
  description: "Real-feeling stories of young people who reached out, and a gentle first step to do the same.",
};

export const viewport: Viewport = {
  themeColor: "#1e2a47",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" data-theme="dusk" suppressHydrationWarning className={`${display.variable} ${body.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body className="flex min-h-[100dvh] flex-col">
        <div className="sky-shift" aria-hidden />
        <MotionProvider>
          <CrisisProvider>
            <a
              href="#main"
              className="sr-only z-[100] rounded-full bg-apricot px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            {children}
            <CrisisButton variant="floating" />
          </CrisisProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
