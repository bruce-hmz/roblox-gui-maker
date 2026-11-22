# Growth & Distribution Launch Pack — `robloxguimaker.app` (2026-11-22)

This pack stays **100% local**. Nothing has been submitted, posted, or deployed externally. Run the deployment checklist first, then work down the top-DR free dofollow directories from [backlink-directories-top50.csv](./backlink-directories-top50.csv).

---

## 1. Pre-Launch Deploy & Smoke Checklist (Run Manually)

1. Verify Cloudflare Worker secret and rate-limit env vars in Wrangler / `.env`:
   - `PRO_PASS_SECRET` (32+ chars; already used for `.rbxmx` & UI Kits, now also unlocks `30/hr, 150/day` AI GUI generation)
   - `AI_RATE_HOUR=3` (default tightened from 8)
   - `AI_RATE_DAY=5` (default tightened from 25)
2. Run build & tests locally:
   - `node scripts/generate-sitemap-lastmod.mjs`
   - `npm test`
   - `npm run build`
3. Deploy to Cloudflare Workers:
   - `npm run deploy`
4. Post-deploy curl checks against `https://robloxguimaker.app`:
   - `curl -sI https://robloxguimaker.app/roblox-shirt-tester` (`200`)
   - `curl -sI https://robloxguimaker.app/roblox-shirt-template-maker` (`200`)
   - `curl -sI https://robloxguimaker.app/roblox-thumbnail-maker` (`200`)
   - `curl -sI https://robloxguimaker.app/roblox-ui-sizer` (`200`)
   - `curl -sI https://robloxguimaker.app/studio-plugin` (`200`)
   - `curl -sI https://robloxguimaker.app/studio-plugin/RobloxGuiMakerSync.lua` (`200`)
   - `curl -s https://robloxguimaker.app/sitemap.xml | rg "roblox-shirt-tester|roblox-thumbnail-maker|studio-plugin"`

---

## 2. Priority Backlink Directory Shortlist (Verified via Columbus MCP)

Top high-DR free submission targets extracted from `docs/backlink-directories-top50.csv` (1,407 free directories total):

| Domain | DR | Monthly Visits | Backlinks | Dofollow | Submit URL |
| --- | ---: | ---: | ---: | :---: | --- |
| `saashub.com` | 81 | 727,927 | 325 | Yes | https://www.saashub.com/services/submit |
| `peerpush.com` | 79 | 218,891 | 166 | Yes | https://peerpush.com/submit |
| `showmebest.ai` | 77 | 0 | 129 | Yes | https://showmebest.ai/submit |
| `sideprojectors.com` | 72 | 159,315 | 159 | Yes | https://sideprojectors.com/submit |
| `promoteproject.com` | 49 | 39,272 | 212 | Yes | https://promoteproject.com/submit-startup |
| `aiwizard.ai` | 35 | 7,521 | 192 | Yes | https://aiwizard.ai/submit-new |
| `saas1to10.com` | 28 | 618 | 171 | Yes | https://www.saas1to10.com/write-review |
| `thejoai.com` | 19 | 0 | 289 | Yes | https://thejoai.com/aitools/submissions/ |
| `askmatchbox.com` | 11 | 906 | 202 | Yes | https://askmatchbox.com/ |
| `alternativeto.net` | 82 | 2,568,245 | 137 | Nofollow | https://alternativeto.net/ (great traffic & brand entity) |
| `webcatalog.io` | 60 | 1,382,589 | 127 | Nofollow | https://webcatalog.io/en/developers/app-listing |

---

## 3. Ready-to-Paste Directory Submission Copy

### Short Form (Tagline + 1-Liner)
- **Name:** Roblox GUI Maker
- **URL:** `https://robloxguimaker.app`
- **Tagline (60 chars):** Free Roblox GUI, 3D Shirt Tester & Thumbnail Studio
- **One-liner:** Browser-based Roblox creator suite: AI GUI-to-Luau builder, offline Studio sync plugin, 3D R6 585×559 Shirt Tester, 1920×1080 Discover Thumbnail Maker, and 512×512 Gamepass Icon Studio.

### Long Description (Directory Profile Body)
> **Roblox GUI Maker** (`robloxguimaker.app`) is an all-in-one browser toolkit built specifically for Roblox developers and UGC creators—no downloads required and zero watermarks on free exports.
>
> **Core Free Tools:**
> - **Visual GUI Builder & AI Generator (`/editor`):** Describe a HUD, Shop, Inventory, or Dialog UI to generate an editable multi-node scene with responsive `UDim2` Scale + `UIAspectRatioConstraint`, then export clean Client `.lua` + Server `.server.lua` or paste directly via our **100% offline Studio Sync Plugin** (`/studio-plugin`).
> - **3D R6 Shirt & Pants Tester (`/roblox-shirt-tester`):** Drop any `585×559` clothing PNG to preview front/back/arm seams on an interactive 3D R6 rig before spending 10 Robux on Creator Hub, or build new templates from scratch (`/roblox-shirt-template-maker`).
> - **1920×1080 Thumbnail Maker & Safe-Zone Studio (`/roblox-thumbnail-maker`):** Compose game banners with live Discover `220px` readability preview and simultaneous `512×512` game icon cropping.
> - **512×512 Gamepass Icon Maker (`/gamepass-icon-maker`):** Circular safe-zone badge editor built around Roblox's store circle crop.
> - **UDim2 UI Sizer & Asset ID Previewer (`/roblox-ui-sizer`):** Convert Figma/Photoshop pixel Offsets into responsive `UDim2.fromScale` Luau and preview `rbxassetid://` images live.

### Suggested Categories / Tags
`Developer Tools`, `Game Development`, `Roblox`, `UI Design`, `AI Code Generator`, `Design Tools`, `No-Code UI`

---

## 4. Roblox DevForum Post Draft (`#resources:community-resources`)

**Title:** `[Free Web Tool + Offline Plugin] Browser GUI Builder + 3D 585×559 Shirt Tester + Discover Thumbnail Safe-Zone Studio`

**Body:**
Hey everyone — built a free browser toolkit at **robloxguimaker.app** for quick UI prototyping, clothing seam checks, and Store asset prep without bouncing between Figma, Photopea, and throwaway Robux uploads.

### What’s inside (all browser-local & watermark-free):
1. **Visual GUI Builder + Offline Studio Sync Plugin**
   - Drag-and-drop `ScreenGui`, `Frame`, `TextLabel`, `TextButton`, `ImageLabel`, `ImageButton`, `TextBox`, `ScrollingFrame`, plus `UICorner`, `UIStroke`, `UIGradient`, `UIListLayout`, `UIGridLayout`, `UIPadding`, and `UIAspectRatioConstraint`.
   - Generates clean Luau scripts or lets you click **Copy Plugin JSON** and paste directly into the single-file open-source companion plugin (`RobloxGuiMakerSync.lua`) with full `ChangeHistoryService` Ctrl+Z Undo and **zero `HttpService` network calls / zero `require()` calls**.
   - Plugin page & source: `https://robloxguimaker.app/studio-plugin`

2. **3D R6 585×559 Shirt & Pants Tester + Template Maker**
   - Drop a `585×559` PNG to check every Torso / Left Arm / Right Arm UV face on a draggable 3D R6 rig with skin tone & lighting toggles before paying the 10 Robux upload fee.
   - `https://robloxguimaker.app/roblox-shirt-tester` & `https://robloxguimaker.app/roblox-shirt-template-maker`

3. **1920×1080 Discover Thumbnail & 512×512 Gamepass Icon Studios**
   - Test how headlines hold up at Roblox Discover `220px` feed card size + safe-zone corner overlays, and crop matching `512×512` game icons / circular Gamepass badges.
   - `https://robloxguimaker.app/roblox-thumbnail-maker` & `https://robloxguimaker.app/gamepass-icon-maker`

4. **UDim2 Offset → Scale Converter & `rbxassetid://` Previewer**
   - Convert pixel coordinates across 1080p PC, Phone, and 4:3 Tablet side-by-side and resolve `rbxassetid://` thumbnails in one tab.
   - `https://robloxguimaker.app/roblox-ui-sizer`

Feedback, edge-case UI templates, or clothing UV suggestions are very welcome!

---

## 5. Reddit Post Draft (`r/robloxgamedev`)

**Title:** `I made a free browser toolkit for Roblox devs: 3D 585×559 Shirt Tester (save 10 Robux checks), 1920×1080 Discover Thumbnail Safe-Zone Studio, & Visual GUI-to-Luau Builder`

**Body:**
Built a suite of free browser utilities over at [robloxguimaker.app](https://robloxguimaker.app) after getting tired of misaligned `585×559` shirt sleeves and stretched mobile UI offsets.

Everything renders client-side in your browser with no watermarks:
- **3D Shirt Tester** (`robloxguimaker.app/roblox-shirt-tester`) — Drop your `585×559` shirt or pants PNG to rotate an R6 rig 360°, swap skin tones, and inspect all 18 UV slices before spending 10 Robux.
- **Thumbnail + Icon Studio** (`robloxguimaker.app/roblox-thumbnail-maker`) — Compose `1920×1080` banners with a live Discover `220px` card preview, corner badge safe zones, and 1-click `512×512` square game icon export.
- **UDim2 UI Sizer** (`robloxguimaker.app/roblox-ui-sizer`) — Turn pixel coordinates into responsive `UDim2.fromScale` + `UIAspectRatioConstraint` Luau and check Desktop/Mobile/Tablet side by side.
- **Visual GUI Builder + Offline Studio Plugin** (`robloxguimaker.app/editor` + `robloxguimaker.app/studio-plugin`) — Build ScreenGuis visually (or with AI starter prompts) and copy clean Luau or paste scene JSON into a single-file offline `.lua` plugin (zero HTTP permissions).

Happy to hear what templates or Studio helpers would save you the most time!
