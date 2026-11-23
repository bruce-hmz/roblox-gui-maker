import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "./components/Analytics";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

// Google Analytics 4. Measurement IDs are public (visible in every visitor's
// page source), so hardcoding is fine; override with NEXT_PUBLIC_GA_ID if needed.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-BWJ7NSR55P";

// Public PVUV.ai site ID for robloxguimaker.app; override with
// NEXT_PUBLIC_PVUV_SITE if needed (empty string disables browser SDK).
const PVUV_SITE = (process.env.NEXT_PUBLIC_PVUV_SITE ?? "3QGneU7d").trim();

const SITE_URL = "https://robloxguimaker.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Roblox GUI Maker — Drag, Drop, Export Clean Luau",
  description:
    "Build Roblox game GUIs visually. Drag and drop ScreenGui, Frame, TextButton and more, then export clean Luau you can paste straight into Roblox Studio. Free, no login.",
  openGraph: {
    title: "Roblox GUI Maker — Build Roblox UIs Visually, Export Clean Luau",
    description:
      "Free Roblox GUI maker. Drag and drop, tweak real Roblox properties, export clean Luau. No login.",
    url: SITE_URL,
    siteName: "Roblox GUI Maker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI Maker — Build Roblox UIs Visually, Export Clean Luau",
    description:
      "Free Roblox GUI maker. Drag and drop, tweak real Roblox properties, export clean Luau. No login.",
  },
};

// Site-wide structured data: establishes the brand as a discoverable entity
// across every page. Page-specific schema (SoftwareApplication, FAQPage) lives
// on the homepage. Stable @id URIs let Google merge this entity across pages.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Roblox GUI Maker",
  url: SITE_URL,
  description:
    "Free, browser-based visual builder for Roblox game interfaces. Drag and drop ScreenGui, Frame and TextButton, preview interactions, and export clean Luau, JSON or ZIP for Roblox Studio.",
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  // Add sameAs only with real, owned profiles (YouTube, Roblox DevForum,
  // GitHub) once they exist — fabricated links hurt more than they help.
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Roblox GUI Maker",
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
            <Analytics />
            {PVUV_SITE && (
              <Script
                id="pvuv-analytics"
                src="https://www.pvuv.ai/f.js"
                data-site={PVUV_SITE}
                data-api="https://in.pvuv.ai"
                strategy="afterInteractive"
              />
            )}
          </>
        )}
      </body>
    </html>
  );
}
