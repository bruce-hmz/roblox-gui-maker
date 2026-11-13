import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: the site is fully static (generateStaticParams everywhere),
// so no R2/Durable-Object incremental cache is needed. The only dynamic routes
// are /api/generate-gui and /api/roblox-thumbnail; the latter's
// `next: { revalidate }` fetch cache is a no-op here — its client-facing
// Cache-Control header still applies.
export default defineCloudflareConfig({});
