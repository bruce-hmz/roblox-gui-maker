// GA4 custom-event helper. Safe to call anywhere: a no-op on the server,
// in dev, or when gtag is absent (ad-blockers, missing GA_ID). Mirrors the
// page_view call in app/components/Analytics.tsx — mark these events as
// Key Events (conversions) in the GA4 admin to measure the editor funnel:
// template view -> editor -> code export.
type Gtag = (...args: unknown[]) => void;

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
