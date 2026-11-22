// Custom-event analytics helper (GA4 + optional PVUV.ai). Safe to call
// anywhere: a no-op on the server, in dev, or when analytics scripts are absent
// (ad-blockers, missing IDs). Mirrors the page_view call in
// app/components/Analytics.tsx to measure funnels across template/tool/editor.
export type TrackParamValue = string | number | boolean | undefined;
export type TrackParams = Record<string, TrackParamValue>;
export type CleanTrackParams = Record<string, string | number | boolean>;

type Gtag = (...args: unknown[]) => void;
type PvuvFn = (
  command: "event",
  name: string,
  props?: CleanTrackParams
) => void;

function stripUndefinedParams(
  params?: TrackParams
): CleanTrackParams | undefined {
  if (!params) return undefined;
  const clean: CleanTrackParams = {};
  let hasEntry = false;
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      clean[key] = value;
      hasEntry = true;
    }
  }
  return hasEntry ? clean : undefined;
}

export function trackEvent(name: string, params?: TrackParams): void {
  if (typeof window === "undefined") return;
  const win = window as unknown as { gtag?: Gtag; pvuv?: PvuvFn };
  try {
    win.gtag?.("event", name, params);
  } catch {
    /* analytics must not interrupt user flows */
  }
  if (typeof win.pvuv === "function") {
    try {
      win.pvuv("event", name, stripUndefinedParams(params));
    } catch {
      /* analytics must not interrupt user flows */
    }
  }
}
