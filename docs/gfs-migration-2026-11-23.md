# Roblox GUI Maker — Hybrid GeFeiSites (GFS) Migration Record

Cutover completed on **2026-11-23**. `https://robloxguimaker.app` now runs on a same-origin hybrid architecture combining a `Firstdraft`-hosted GeFeiSites sub-engine (`gefeisites`) with the original Next.js OpenNext Cloudflare Worker (`roblox-gui-maker`).

## Production Topology

| Item | Value |
| --- | --- |
| Domain | `https://robloxguimaker.app` (`www.` -> 301 apex) |
| Cloudflare Account | `Firstdraft.ai.app@gmail.com` (`81bd3096d693d39b65e49832c357c315`) |
| Cloudflare Zone ID | `c73c81c027d7bf9cd5970bc7752b83cb` |
| GFS Sub-Engine Admin | `https://gefeisites.firstdraft-ai-app.workers.dev/admin` |
| GFS Site ID | `s_1u111j60366q3y` (`migration.state: switched`, `domain.ready: true`, GFS `brand_set` icon + 1200×630 share image) |
| PVUV Site ID | `3QGneU7d` (shared across GFS pages + legacy Worker pages + GFS edge crawler sync) |
| Email Routing | `contact@robloxguimaker.app` & `support@robloxguimaker.app` → `firstdraft.ai.app@gmail.com` (`state: ready`, MX + SPF active) |
| Legacy Worker | `roblox-gui-maker` (serves 28 explicit Cloudflare Zone Worker Routes; `/favicon.ico` is served by GFS) |

## Hybrid Traffic Split

- **GFS-Native (`gefeisites`, 111 live pages + `/sitemap.xml`, `/robots.txt`, `/llms.txt`, 404 fallback)**:
  - `/` & `/zh` (with progressive vanilla JS `PromptBox` in `theme/script.js` posting to `/api/generate-gui` -> `/editor?generated=1`)
  - `/templates`, `/templates/*`, `/zh/templates`, `/zh/templates/*`
  - `/guides`, `/guides/*`, `/zh/guides`, `/zh/guides/*`
  - `/for`, `/for/*`, `/zh/for`, `/zh/for/*`
  - `/kits`, `/zh/kits`, `/zh/kits/*`
  - `/showcase`, `/zh/showcase`
  - `/studio-plugin`, `/zh/studio-plugin` (progressive `.lua` download button)
  - `/about`, `/zh/about`, `/privacy`, `/terms`, `/trust`
- **Legacy OpenNext Worker (`roblox-gui-maker`, 28 Zone Worker Routes)**:
  - `/api/*` (GLM GUI generation, Stripe checkout/verify, Pro `.rbxmx`/kit bundles, Roblox thumbnail proxy)
  - `/_next/*` (Next.js JS chunks and `.woff2`/`.woff` fonts referenced by GFS CSS)
  - `/editor*`, `/pro/*`
  - `/roblox-shirt-tester*`, `/zh/roblox-shirt-tester*`
  - `/roblox-shirt-template-maker*`, `/zh/roblox-shirt-template-maker*`
  - `/roblox-thumbnail-maker*`, `/zh/roblox-thumbnail-maker*`
  - `/roblox-ui-sizer*`, `/zh/roblox-ui-sizer*`
  - `/gamepass-icon-maker*`, `/zh/gamepass-icon-maker*`
  - `/pricing*`, `/zh/pricing*`, `/avatar*`, `/zh/avatar*`, `/kits/*`
  - `/studio-plugin/RobloxGuiMakerSync.lua*` and static brand/legacy assets (`/logo.png*`, `/icon.png*`, `/apple-icon.png*`, `/android-chrome-*`, `/opengraph-image*`, `/manifest.webmanifest*`, `/screenshot.png*`, `/gallery/*`)

> The 29 legacy interactive pages are also mirrored in GFS `pages.json` so GFS `check` reports 0 `dead_link` errors and GFS `/sitemap.xml` retains all 130 canonical URLs.

## Day-to-Day Maintenance

- **Updating SEO / marketing / guide pages or running A/B tests**: Edit directly in GFS Admin / GFS MCP (or re-export from Next.js via `npm run build && node scripts/export-gfs.mjs` followed by `scripts/import-gfs.mjs`).
- **Updating `/editor`, `/api/*`, or interactive tools**: Normal push to `main` triggers `.github/workflows/deploy.yml`, which updates `roblox-gui-maker` safely without reclaiming custom domains (`wrangler.jsonc` intentionally omits `routes` / `custom_domain`).
- **Managing legacy Zone Worker Routes**: `CLOUDFLARE_API_TOKEN=... node scripts/setup-gfs-routes.mjs` (dry-run by default; `--apply` creates missing routes).
- **Rollback**: Use GFS Admin's built-in 1-click rollback (`切换到老站` in site settings) to restore `robloxguimaker.app` and `www.robloxguimaker.app` custom domains to `roblox-gui-maker`.
