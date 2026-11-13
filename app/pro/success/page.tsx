import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { ProSuccessVerifier } from "./ProSuccessVerifier";

export const metadata: Metadata = {
  title: "Studio Pro Pass Unlocked | Roblox GUI Maker",
  robots: { index: false, follow: false },
};

export default function ProSuccessPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-line bg-panel p-8 text-center text-sm text-ink-mute">
              Loading your Studio Pro Pass…
            </div>
          }
        >
          <ProSuccessVerifier />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
