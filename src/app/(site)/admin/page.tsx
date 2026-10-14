import type { Metadata } from "next";
import { AdminList } from "./AdminList";

export const metadata: Metadata = {
  title: "Review stories | Reach Out",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="px-4 pb-10 pt-10 md:px-6 md:pt-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold md:text-5xl">Review stories</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Demo moderation. Every shared story lands here first and nothing goes live automatically. Check each one is
          safe (no details of harm, nothing identifying) before approving. In a real service this page would sit behind
          a secure login, and stories would be stored on a protected server, not in this browser.
        </p>
        <div className="mt-10">
          <AdminList />
        </div>
      </div>
    </section>
  );
}
