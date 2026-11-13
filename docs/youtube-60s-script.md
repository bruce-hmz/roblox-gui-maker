# YouTube 60-second tutorial — script + storyboard

**Why this exists:** GUI-making search intent largely lives on YouTube. Owning
one short, findable tutorial beats commenting on other people's videos. This is
value-first (it teaches a real task) and links the tool in the description.

**Topic:** Make a Roblox main menu GUI (most universal + shows the interactive
differentiator: buttons that open/close panels, exported with click handlers).
**Pace:** ~125 words of VO → fits 60s with natural pauses for the screen demo.

---

## Title (pick one)
- `Make a Roblox Main Menu GUI in 60 Seconds (Free, No Login)`
- `Roblox Main Menu GUI in 60 Seconds — Free Visual Builder + Luau Export`
- `How to Make a Roblox Main Menu (no Studio, no login, 60 seconds)`

---

## Storyboard + voiceover

### 0:00–0:06 — Hook (the payoff first)
**On screen:** the finished main-menu template; click SETTINGS → the settings
panel slides in over it.
**VO:** "A working Roblox main menu — Play button, settings panel that opens and
closes — in under sixty seconds. No Studio, no login."

### 0:06–0:14 — Load the template
**On screen:** type `robloxguimaker.app`, click into the editor, open the
Main Menu template. It appears: GAME TITLE, PLAY, SETTINGS, QUIT, stacked.
**VO:** "Go to robloxguimaker dot app, open the editor, load the Main Menu
template. One click — title, Play, Settings, Quit, already stacked."

### 0:14–0:21 — Customize
**On screen:** click the title, change the text (e.g. to your game name); click
the Play button, change its color in the properties panel.
**VO:** "Click anything to edit it — change the title, the button color, the
font. Every property uses the real Roblox names."

### 0:21–0:33 — The interactive part (the differentiator)
**On screen:** click **Preview**, then click **SETTINGS** on the canvas → the
settings panel appears; click **CLOSE** → it hides. (Optional: click **PLAY** →
whole menu hides.)
**VO:** "Now the fun part: Play hides the menu, Settings opens a panel. Hit
Preview, click Settings — there it is. Close — gone. The buttons actually work."

### 0:33–0:44 — Export
**On screen:** click **Export Luau** → **Copy**; the code panel is shown; scroll
down to highlight the `Activated:Connect(function() ... Visible = true end)`
blocks.
**VO:** "Export Luau. Clean code — Instance dot new, U D I two — and it writes
the click handlers too: Activated connects, Visible true and false."

### 0:44–0:52 — It runs in Studio
**On screen:** (optional cut) Roblox Studio — paste into a LocalScript,
Play-test, the menu works. If you skip Studio to save time, just stay on the
code panel and say the line.
**VO:** "Paste it into a LocalScript in Studio — your menu runs exactly like you
designed."

### 0:52–0:60 — CTA
**On screen:** end card with `robloxguimaker.app` + "Free · No login".
**VO:** "Free, no login, autosaves to your browser. Link's in the description."

---

## Description (copy-paste; keyword-rich, has the link + chapters)

```
Make a Roblox main menu GUI in 60 seconds — visually, with working buttons —
and export clean Luau you can paste straight into Studio. Free, no login.

🔗 https://robloxguimaker.app  (Main Menu template: https://robloxguimaker.app/editor?template=main-menu)

Roblox GUI Maker is a free, browser-based visual builder for Roblox interfaces.
Drag and drop ScreenGui, Frame and buttons, nest containers, auto-arrange with
UIListLayout, wire a button to show or hide a panel, and export Luau that
recreates your GUI complete with the .Activated:Connect click handlers.

0:00  The result
0:06  Load the Main Menu template
0:14  Customize (text, color, font)
0:21  Wire up + preview the buttons
0:33  Export the Luau
0:44  Paste into Studio

More templates (shop, inventory, loading screen, leaderboard): https://robloxguimaker.app/templates
Written guides: https://robloxguimaker.app/guides

#roblox #robloxstudio #robloxgui #robloxscripting #luau #robloxdev
```

---

## Tags
roblox gui, roblox main menu, roblox studio, roblox gui maker, roblox ui,
roblox scripting, luau, roblox tutorial, roblox menu, how to make a roblox
game, roblox for beginners, roblox ui design

---

## Recording notes
- **Record the browser only** (the whole 60s can be screen-captured in the
  editor at robloxguimaker.app — no Studio needed unless you want the 0:44 cut).
- **Use the production site**, not localhost — cleaner (no dev badges).
- **Load `?template=main-menu`** so you start from the polished template.
- Rehearse once so the clicks land on the VO beats; keep each beat tight.
- Export 1080p, then a GIF/Short from the same recording for Reddit/TikTok/Shorts.
- macOS record: Cmd+Shift+5; trim in QuickTime; the description link is what
  turns views into tool users, so say "link in the description" out loud.
