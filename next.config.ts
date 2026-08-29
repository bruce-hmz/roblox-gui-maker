import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// CSP: GA's gtag loads from googletagmanager and beacons to google-analytics;
// the inline config + Next bootstrap need 'unsafe-inline'; dev (HMR/eval) gets
// 'unsafe-eval', which is dropped in production.
const csp = [
  "default-src 'self'",
  isProd
    ? "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://thumbnails.roblox.com https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // The parent directory also contains a lockfile, which would make Turbopack
  // infer the wrong workspace root. Pin it to this project.
  turbopack: { root: process.cwd() },
  // Canonical: apex (robloxguimaker.app) is primary; www 308 -> apex.
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://robloxguimaker.app/:path*",
        permanent: true,
        has: [{ type: "host", value: "www.robloxguimaker.app" }],
      },
    ];
  },
  async headers() {
    // Favicon-set assets are served by file-convention route handlers that
    // default to max-age=0; these are effectively immutable (content changes
    // bust the ?v query on the icon links), so cache them at the edge+browser.
    const iconCache = "public, max-age=604800, stale-while-revalidate=86400";
    return [
      {
        source: "/:path(favicon.ico|icon.png|apple-icon.png)",
        headers: [{ key: "Cache-Control", value: iconCache }],
      },
      {
        source: "/:path(android-chrome-192x192.png|android-chrome-512x512.png)",
        headers: [{ key: "Cache-Control", value: iconCache }],
      },
      // logo.png has no version query (nav/footer/img src), cache shorter.
      {
        source: "/logo.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
