"use client";

// The App Router renders one <html> per root layout, and /zh pages share the
// root layout's lang="en". A per-route second root layout would force either
// full route-group restructuring or a dynamic root (losing static
// optimization), so we set the document language on mount instead. The sitemap
// and hreflang pairs — the signals search engines actually read — are already
// correct; this fixes the in-DOM declaration for browsers and screen readers.

import { useEffect } from "react";

export function ZhLangSetter() {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = "zh";
    return () => {
      document.documentElement.lang = previous || "en";
    };
  }, []);
  return null;
}
