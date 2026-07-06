// Written how-to guides. Each targets a tutorial-intent query that currently
// lands on YouTube ("how to make a roblox shop gui", etc.) and pairs with a
// template you can open in the editor. SSG'd at /guides/<slug>.

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  code?: string;
  tip?: string;
};

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  relatedTemplate?: string;
  intro: string;
  sections: GuideSection[];
  faq: Faq[];
  relatedGuides?: Array<{ slug: string; title: string }>;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-design-polished-roblox-ui",
    title: "How to Design Polished Roblox UI (Gradients, Strokes & Depth)",
    description:
      "Make modern, premium-feeling Roblox UI with multi-stop UIGradient, glowing UIStroke borders, and depth — with copy-paste Luau. No Photoshop or image assets required.",
    category: "Design",
    relatedTemplate: "game-pass-shop",
    intro:
      "Most Roblox UI looks flat because Frame, TextButton and TextLabel are solid-color rectangles by default. The polish that separates a shipped game's interface from a starter build comes from two native features people underuse: UIGradient (multi-stop color blends for depth) and UIStroke (colored, semi-transparent edges that read as glow). This guide shows both, with Luau you can paste straight into Roblox Studio — and every technique here is built into the visual editor.",
    sections: [
      {
        heading: "1. Why native Roblox UI looks flat (and how to fix it)",
        paragraphs: [
          "A plain Frame is a single flat color. There is no built-in lighting or shadow on a Frame, so a screen full of them reads as a wireframe. The fix is not to switch to images — it is to layer the decorators Roblox already ships: UICorner for rounded edges, UIGradient for a color blend across the surface, and UIStroke for a border. Stacked together they turn a flat rectangle into something that looks raised and lit.",
        ],
      },
      {
        heading: "2. Add depth with a multi-stop UIGradient",
        paragraphs: [
          "UIGradient takes a ColorSequence, which means you are not limited to two colors — you can keypoint as many stops as you want. A lighter top stop blending into a darker bottom stop of the same hue makes a panel look like it is catching light from above. Set Rotation in degrees (0 is left-to-right, 90 is top-to-bottom).",
        ],
        code: `local card = Instance.new("Frame")
card.Size = UDim2.fromScale(0.6, 0.3)
card.BackgroundColor3 = Color3.fromRGB(32, 39, 53)

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = card

-- lighter top stop -> darker bottom stop = subtle depth
local grad = Instance.new("UIGradient")
grad.Color = ColorSequence.new({
	ColorSequenceKeypoint.new(0, Color3.fromRGB(42, 50, 67)),
	ColorSequenceKeypoint.new(1, Color3.fromRGB(23, 28, 40)),
})
grad.Rotation = 45
grad.Parent = card`,
        tip: "Keep the light and dark stops close in hue (just shift brightness). A 15-20% brightness difference reads as depth; a bigger jump starts to look like a banner.",
      },
      {
        heading: "3. Make edges glow with UIStroke",
        paragraphs: [
          "UIStroke draws a border on any GUI object. Make it thick, and drop its Transparency, in an accent color and it reads as a soft glow around the element — the signature look of modern game shops and reward screens.",
        ],
        code: `-- thick + semi-transparent + accent color = glow edge
local glow = Instance.new("UIStroke")
glow.Color = Color3.fromRGB(56, 189, 248)
glow.Transparency = 0.6
glow.Thickness = 2
glow.Parent = card`,
        tip: "Match the stroke color to the element's purpose: blue for info, gold for premium/paid, green for success. Consistent accent colors across a screen are what make it feel designed.",
      },
      {
        heading: "4. Glossy buttons with a gradient fill",
        paragraphs: [
          "A flat-colored button looks like a label. Give it a two-stop gradient from a lighter to a darker shade of its action color and it looks like a physical button you can press.",
        ],
        code: `local buy = Instance.new("TextButton")
buy.Size = UDim2.fromScale(1, 0.2)
buy.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
buy.Text = "BUY"
buy.Font = Enum.Font.GothamBold

local buyGrad = Instance.new("UIGradient")
buyGrad.Color = ColorSequence.new({
	ColorSequenceKeypoint.new(0, Color3.fromRGB(56, 189, 248)),
	ColorSequenceKeypoint.new(1, Color3.fromRGB(0, 119, 182)),
})
buyGrad.Parent = buy`,
      },
      {
        heading: "5. In the editor versus in Studio",
        paragraphs: [
          "Every technique above is built into the visual editor. Open the game-pass-shop template to see gradient fills and accent UIStroke glow already applied, then tweak the colors live and export the Luau — the exported script contains real Instance.new('UIGradient') and Instance.new('UIStroke') calls with ColorSequence keypoints, ready to paste into a LocalScript under StarterGui.",
        ],
        tip: "Native gradients and strokes keep your UI editable, responsive and scriptable. They will not match commissioned Photoshop art with rendered 3D characters — for that you need image assets — but for clean, modern, premium-feeling interfaces they are the right tool.",
      },
    ],
    faq: [
      {
        q: "Can UIGradient use more than two colors?",
        a: "Yes. UIGradient.Color is a ColorSequence, so you can add as many ColorSequenceKeypoint stops as you want, each at any position from 0 to 1.",
      },
      {
        q: "How do I make a glow effect on Roblox UI?",
        a: "Add a UIStroke, set a vivid Color, raise Thickness to around 2, and set Transparency around 0.5-0.7. A thick, semi-transparent stroke in an accent color reads as a glow border.",
      },
      {
        q: "Can I do drop shadows in native Roblox UI?",
        a: "Frames cannot blur natively, so a true soft shadow needs a blurred image asset. You can approximate a shadow with an offset, semi-transparent dark Frame behind your panel, or rely on gradient depth plus a UIStroke edge instead.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-inventory-gui",
    title: "How to Make a Roblox Inventory GUI",
    description:
      "Build a Roblox inventory GUI with a ScrollingFrame, UIGridLayout for uniform slots, filter tabs, and runtime population from a script — with copy-paste Luau.",
    category: "HUD",
    relatedTemplate: "inventory",
    intro:
      "An inventory shows everything a player owns as a grid of slots they can tap to equip or use. The shape is a ScrollingFrame full of uniform cells laid out by a UIGridLayout, plus a template slot your script clones once per owned item. This guide builds one in Luau and maps to the inventory template in the editor.",
    sections: [
      {
        heading: "1. ScrollingFrame + UIGridLayout for uniform slots",
        paragraphs: [
          "A ScrollingFrame is the scrollable container; a UIGridLayout inside it arranges every child into a uniform grid automatically. Set CellSize and CellPadding once and any number of slots tile correctly.",
        ],
        code: `local scroll = Instance.new("ScrollingFrame")
scroll.Size = UDim2.fromScale(0.6, 0.7)
scroll.Position = UDim2.fromScale(0.2, 0.15)
scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y
scroll.CanvasSize = UDim2.new(0, 0, 0, 0)
scroll.ScrollBarThickness = 6
scroll.Parent = gui

local grid = Instance.new("UIGridLayout")
grid.CellSize = UDim2.fromOffset(90, 90)
grid.CellPadding = UDim2.fromOffset(8, 8)
grid.SortOrder = Enum.SortOrder.LayoutOrder
grid.Parent = scroll`,
      },
      {
        heading: "2. Clone a template slot per item",
        paragraphs: [
          "Build one slot Frame (with a UICorner and an ImageLabel for the icon) and keep it as a template. Clone it for each owned item rather than constructing slots inline — your layout code stays tiny and every slot is identical.",
        ],
        tip: "Use a naming convention like Slot_<itemId> so your scripts can find, equip, or remove slots by id later.",
      },
      {
        heading: "3. Populate slots from player data",
        paragraphs: [
          "Loop the player's owned items, clone the template, set its icon and name, and parent it to the ScrollingFrame. The UIGridLayout positions it automatically and the canvas grows with AutomaticCanvasSize.",
        ],
        code: `local function populate(items)
	for _, item in ipairs(items) do
		local slot = template:Clone()
		slot.Name = "Slot_" .. item.id
		slot.Icon.Image = item.icon
		slot.Parent = scroll
	end
end`,
      },
    ],
    faq: [
      {
        q: "How do I add or remove items at runtime?",
        a: "Clone the template slot and parent it to the ScrollingFrame to add; call Destroy() on the slot to remove. The UIGridLayout reflows the remaining slots automatically.",
      },
      {
        q: "How do I show which item is equipped?",
        a: "Give the template slot a UIStroke that starts transparent, and toggle its Transparency off on the slot the player taps. A colored stroke reads as a clear selection border.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-use-uilistlayout-in-roblox", title: "How to Use UIListLayout in Roblox" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-code-redeem-gui",
    title: "How to Make a Roblox Code Redeem GUI",
    description:
      "Make a Roblox promo/creator code redemption GUI: a TextBox for input, a RemoteEvent to the server, and server-side validation + reward granting — with copy-paste Luau.",
    category: "Menus",
    relatedTemplate: "code-redeem",
    intro:
      "A code redeem panel lets players type a promo or creator code and receive a reward. The interface is simple — a TextBox plus a redeem button — but the security is one-directional: the client only sends the code, and the server decides whether it is valid and grants the reward. This guide builds both sides in Luau.",
    sections: [
      {
        heading: "1. TextBox input and a redeem button",
        paragraphs: [
          "A TextBox collects the code, a TextButton fires the request. On click, read the box's text and send it to the server through a RemoteEvent.",
        ],
        code: `local box = Instance.new("TextBox")
box.Size = UDim2.fromScale(1, 0.12)
box.PlaceholderText = "Enter code"
box.Parent = panel

local redeem = Instance.new("TextButton")
redeem.Size = UDim2.fromScale(1, 0.12)
redeem.Text = "REDEEM"
redeem.Parent = panel

local redeemEvent = game:GetService("ReplicatedStorage")
	:WaitForChild("Remotes"):WaitForChild("RedeemCode")
redeem.Activated:Connect(function()
	redeemEvent:FireServer(box.Text)
end)`,
      },
      {
        heading: "2. Validate codes on the server",
        paragraphs: [
          "Keep the list of valid codes and their rewards in a server Script. Normalize the incoming code (uppercase, no spaces), look it up, and ignore anything unknown. The client never sees the list.",
        ],
        code: `local codes = {
	LAUNCHDAY = { coins = 500 },
	WELCOME = { item = "starter_crate" },
}

redeemEvent.OnServerEvent:Connect(function(player, raw)
	local code = string.upper(tostring(raw):gsub("%s+", ""))
	local reward = codes[code]
	if not reward then return end -- invalid code: do nothing
	grantReward(player, reward)
end)`,
        tip: "Never trust the client. Only the server knows which codes are valid and must be the one to grant coins or items.",
      },
      {
        heading: "3. Send feedback to the player",
        paragraphs: [
          "After granting, fire a RemoteEvent (or return from a RemoteFunction) back to the client so the UI can show 'Reward claimed' or 'Invalid code'. Keep the reward logic on the server and the message on the client.",
        ],
      },
    ],
    faq: [
      {
        q: "Why must the server validate the code?",
        a: "Clients can be modified by exploiters. If the client decided the reward, anyone could grant themselves anything. The server is the only source of truth for valid codes and granted rewards.",
      },
      {
        q: "How do I expire or single-use codes?",
        a: "Track redemption per player in a DataStore (or remove the code from the table after a global expiry). Check it server-side before granting.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-shop-gui", title: "How to Make a Roblox Shop GUI" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-daily-rewards-gui",
    title: "How to Make a Roblox Daily Rewards GUI",
    description:
      "Build a Roblox daily rewards / streak calendar GUI: a 7-day grid with claimed, current and locked states, server-side streak tracking, and a claim RemoteEvent — with Luau.",
    category: "Menus",
    relatedTemplate: "daily-rewards",
    intro:
      "A daily rewards screen shows a row of day cards — claimed days dimmed, today's ready, future days locked — and a button to claim. The visual states are just background colors; the real logic is server-side: track when the player last claimed and their streak, and only grant a reward if a new day has begun.",
    sections: [
      {
        heading: "1. A 7-day grid with visual states",
        paragraphs: [
          "Each day is a Frame colored by its state: claimed (dimmed), current (highlighted), or locked (muted). Lay them out with a UIListLayout or manual positions — the editor's daily-rewards template does this for you.",
        ],
      },
      {
        heading: "2. Track the streak on the server",
        paragraphs: [
          "Store lastClaimTime and streak per player (DataStore). On a claim request, compare server time to the last claim: if less than a day has passed, ignore it; if within two days, advance the streak; otherwise reset it to day 1.",
        ],
        code: `local DAY = 86400
claimEvent.OnServerEvent:Connect(function(player)
	local data = playerData[player.UserId] -- { last = 0, streak = 0 }
	local now = os.time()
	if now - data.last < DAY then return end -- already claimed today
	data.streak = (now - data.last < 2 * DAY) and data.streak + 1 or 1
	data.last = now
	grantDayReward(player, data.streak)
end)`,
        tip: "Always use os.time() (server clock) for day boundaries. The client's clock can be wrong or spoofed.",
      },
      {
        heading: "3. Reflect the result in the UI",
        paragraphs: [
          "After the server grants, it tells the client the new streak and last-claim day. The client recolors the day cards (mark today claimed, highlight tomorrow) so the calendar stays in sync with the server's truth.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I store the streak between sessions?",
        a: "Save lastClaimTime and streak in a DataStore keyed by UserId. Load it when the player joins and save after each claim.",
      },
      {
        q: "What happens if a player skips a day?",
        a: "Your call: reset the streak to 1, or keep it within a grace window (e.g. two days). The code above resets after a two-day gap.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-shop-gui", title: "How to Make a Roblox Shop GUI" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-quest-tracker-gui",
    title: "How to Make a Roblox Quest Tracker HUD",
    description:
      "Make a Roblox quest tracker HUD: a persistent corner panel with an objective, a live tweened progress bar, and an expand/collapse toggle — with copy-paste Luau.",
    category: "HUD",
    relatedTemplate: "quest-tracker",
    intro:
      "A quest tracker is a small panel pinned to a corner of the screen that shows the active objective and a progress bar that fills as the player makes progress. It stays visible during gameplay, so it has to be compact. This guide builds the HUD, a smooth progress bar, and a toggle to expand and collapse the details.",
    sections: [
      {
        heading: "1. A compact corner panel",
        paragraphs: [
          "Anchor the panel to a corner with AnchorPoint and a scale Position so it sits tight against the edge on every screen size. A TextLabel holds the objective, a nested Frame pair (background + fill) is the progress bar.",
        ],
        code: `local panel = Instance.new("Frame")
panel.AnchorPoint = Vector2.new(1, 0)
panel.Position = UDim2.fromScale(0.97, 0.06)
panel.Size = UDim2.fromScale(0.3, 0.16)
panel.Parent = gui`,
      },
      {
        heading: "2. A progress bar that tweens",
        paragraphs: [
          "The bar is a background Frame with a child fill Frame. To update progress, tween the fill's Size on the X scale from its current value to the new ratio — TweenService makes it glide instead of jumping.",
        ],
        code: `local TweenService = game:GetService("TweenService")

local function setProgress(fill, current, goal)
	local ratio = math.clamp(current / goal, 0, 1)
	local info = TweenInfo.new(0.3, Enum.EasingStyle.Quad)
	TweenService:Create(fill, info, { Size = UDim2.fromScale(ratio, 1) }):Play()
end`,
        tip: "Keep the HUD small and out of the gameplay area. Anchor to a corner and use scale sizing so it lands the same on phone and desktop.",
      },
      {
        heading: "3. Update from game events and collapse details",
        paragraphs: [
          "Drive setProgress from your game's events (item collected, enemy defeated) so the bar moves live. Add a toggle button that shows and hides a details panel using a show/hide action — the editor generates that Luau for you, and you can animate it with a scale transition.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I make the progress bar fill smoothly?",
        a: "Use TweenService:Create on the fill Frame's Size, from its current X scale to the new ratio. A 0.3-second Quad ease looks responsive without being jittery.",
      },
      {
        q: "How do I know when a quest is complete?",
        a: "When progress reaches the goal, fire a BindableEvent (server-side) or check client-side, then grant the reward, mark the quest done, and hide or recolor the tracker.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "How to Animate Roblox GUIs with TweenService" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-main-menu-gui",
    title: "How to Make a Roblox Main Menu GUI",
    description:
      "Step by step: build a Roblox main menu GUI with a ScreenGui, centered panel, title and stacked Play/Settings buttons using UIListLayout, plus the Luau to handle button clicks.",
    category: "Menus",
    relatedTemplate: "main-menu",
    intro:
      "The main menu is the first thing players see when they join your game. This guide builds one from scratch in Luau — a ScreenGui container, a centered panel, a title, and Play / Settings buttons stacked automatically with a UIListLayout. You can also start from the ready-made main-menu template in the editor and customize it.",
    sections: [
      {
        heading: "1. Create the ScreenGui container",
        paragraphs: [
          "Every on-screen interface lives inside a ScreenGui. Put it in the local player's PlayerGui so it renders on their screen, and set ResetOnSpawn to false so the menu survives respawns.",
        ],
        code: `local player = game:GetService("Players").LocalPlayer
local gui = Instance.new("ScreenGui")
gui.Name = "MainMenu"
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true
gui.Parent = player:WaitForChild("PlayerGui")`,
      },
      {
        heading: "2. Add a centered panel and title",
        paragraphs: [
          "A Frame acts as the menu background, a UICorner rounds it, and a TextLabel shows the game title. AnchorPoint 0.5,0.5 plus Position 0.5,0.5 centers the panel exactly on screen.",
        ],
        code: `local panel = Instance.new("Frame")
panel.Size = UDim2.fromScale(0.4, 0.6)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.BackgroundColor3 = Color3.fromRGB(21, 23, 31)
panel.Parent = gui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 18)
corner.Parent = panel

local title = Instance.new("TextLabel")
title.Size = UDim2.fromScale(1, 0.18)
title.BackgroundTransparency = 1
title.Text = "GAME TITLE"
title.Font = Enum.Font.GothamBlack
title.TextSize = 30
title.TextColor3 = Color3.fromRGB(153, 203, 255)
title.Parent = panel`,
      },
      {
        heading: "3. Stack the buttons with UIListLayout",
        paragraphs: [
          "Drop a UIListLayout into the panel and every child you add afterwards stacks itself — no manual positioning. Set Padding for spacing and HorizontalAlignment to center them.",
        ],
        code: `local layout = Instance.new("UIListLayout")
layout.Padding = UDim.new(0, 10)
layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
layout.Parent = panel`,
      },
      {
        heading: "4. Make the buttons do something",
        paragraphs: [
          "Each button is a TextButton. Connect MouseButton1Click to run code when the player taps it — here, PLAY hides the menu and starts the game.",
        ],
        code: `local playBtn = Instance.new("TextButton")
playBtn.Size = UDim2.fromScale(1, 0.14)
playBtn.Text = "PLAY"
playBtn.Font = Enum.Font.GothamBold
playBtn.TextSize = 20
playBtn.Parent = panel

playBtn.MouseButton1Click:Connect(function()
\tgui.Enabled = false
\t-- start the game here
end)`,
        tip: "Use gui.Enabled = false to hide the menu and keep it around, or gui:Destroy() if you'll never show it again.",
      },
    ],
    faq: [
      {
        q: "How do I center the menu on screen?",
        a: "Set the panel's AnchorPoint to Vector2.new(0.5, 0.5) and Position to UDim2.fromScale(0.5, 0.5). The panel then centers on its own midpoint instead of its top-left corner.",
      },
      {
        q: "Why does my menu disappear when I respawn?",
        a: "By default a ScreenGui resets on spawn. Set ResetOnSpawn = false on the ScreenGui to keep it persistent.",
      },
    ],
  },
  {
    slug: "how-to-make-a-roblox-shop-gui",
    title: "How to Make a Roblox Shop GUI",
    description:
      "Build a Roblox shop GUI: a ScrollingFrame whose items auto-tile with UIGridLayout, item cells with images and prices, and a RemoteEvent so purchases actually work server-side.",
    category: "Shop",
    relatedTemplate: "shop",
    intro:
      "A shop needs three things: a scrollable area, items that tile into a grid, and a way for the purchase to actually happen. This guide builds the UI with a ScrollingFrame + UIGridLayout, then wires the buy action through a RemoteEvent so the server verifies it. Start from the shop template to skip the layout work.",
    sections: [
      {
        heading: "1. The panel and scrollable grid",
        paragraphs: [
          "A Frame holds everything; a ScrollingFrame is where items go. Adding a UIGridLayout to the ScrollingFrame makes every item cell tile automatically into a grid — add as many items as you want and they reflow.",
        ],
        code: `local panel = Instance.new("Frame")
panel.Size = UDim2.fromScale(0.6, 0.76)
panel.Position = UDim2.fromScale(0.2, 0.12)
panel.Parent = gui

local scroll = Instance.new("ScrollingFrame")
scroll.Size = UDim2.fromScale(1, 0.8)
scroll.BackgroundTransparency = 1
scroll.ScrollBarThickness = 6
scroll.Parent = panel

local grid = Instance.new("UIGridLayout")
grid.CellSize = UDim2.fromOffset(120, 120)
grid.CellPadding = UDim2.fromOffset(10, 10)
grid.Parent = scroll`,
      },
      {
        heading: "2. An item cell",
        paragraphs: [
          "Each item is a Frame with an ImageLabel, a price label, and a buy button. Because of the UIGridLayout, just parenting it to the ScrollingFrame places it in the grid.",
        ],
        code: `local function makeItem(name, price, imageId)
\tlocal cell = Instance.new("TextButton")
\tcell.Text = ""
\tcell.BackgroundColor3 = Color3.fromRGB(40, 41, 51)
\tcell.Parent = scroll

\tlocal icon = Instance.new("ImageLabel")
\ticon.Size = UDim2.fromScale(1, 0.7)
\ticon.BackgroundTransparency = 1
\ticon.Image = "rbxassetid://" .. imageId
\ticon.Parent = cell

\tlocal label = Instance.new("TextLabel")
\tlabel.Size = UDim2.fromScale(1, 0.3)
\tlabel.Position = UDim2.fromScale(0, 0.7)
\tlabel.BackgroundTransparency = 1
\tlabel.Text = name .. " - " .. price
\tlabel.Parent = cell

\treturn cell
end`,
      },
      {
        heading: "3. Wire the purchase through a RemoteEvent",
        paragraphs: [
          "Never trust the client with money. The buy button fires a RemoteEvent; the server checks the player can afford it, deducts currency, and grants the item.",
        ],
        code: `-- LocalScript (client)
buyRemote = game.ReplicatedStorage:WaitForChild("BuyItem")
cell.MouseButton1Click:Connect(function()
\tbuyRemote:FireServer(itemId)
end)

-- Script (server)
buyRemote.OnServerEvent:Connect(function(player, itemId)
\t-- verify currency, deduct, grant item
end)`,
        tip: "Always validate purchases on the server. A client can fire a RemoteEvent with any itemId, so the server must re-check price and ownership.",
      },
    ],
    faq: [
      {
        q: "How do I make the shop scroll smoothly?",
        a: "Use a ScrollingFrame with AutomaticCanvasSize = Enum.AutomaticSize.Y and a UISizeConstraint or the UIGridLayout's cells defining height. ScrollBarThickness controls the scrollbar width.",
      },
      {
        q: "How do items tile into a grid?",
        a: "Parent a UIGridLayout to the ScrollingFrame. Set CellSize and CellPadding; every child Frame then auto-positions into rows and columns.",
      },
    ],
  },
  {
    slug: "how-to-make-a-roblox-loading-screen-gui",
    title: "How to Make a Roblox Loading Screen GUI",
    description:
      "Make a Roblox loading screen: a full-screen frame with a gradient, title, an animated progress bar using TweenService, and a rotating tip — then remove it when the game is ready.",
    category: "Menus",
    relatedTemplate: "loading-screen",
    intro:
      "A loading screen covers the viewport while assets stream in. This guide builds a full-screen Frame with a gradient background, a big title, a progress bar whose fill tweens from 0 to full, and a tip line. Once your game is ready, you destroy the GUI. There's also a loading-screen template to start from.",
    sections: [
      {
        heading: "1. Full-screen background and title",
        paragraphs: [
          "Set IgnoreGuiInset = true on the ScreenGui so the frame covers the whole viewport including the top bar. A UIGradient on the background Frame gives it depth.",
        ],
        code: `local gui = Instance.new("ScreenGui")
gui.IgnoreGuiInset = true
gui.Parent = player.PlayerGui

local bg = Instance.new("Frame")
bg.Size = UDim2.fromScale(1, 1)
bg.BackgroundColor3 = Color3.fromRGB(12, 13, 23)
bg.Parent = gui

local title = Instance.new("TextLabel")
title.Size = UDim2.fromScale(0.6, 0.12)
title.Position = UDim2.fromScale(0.2, 0.36)
title.BackgroundTransparency = 1
title.Text = "LOADING"
title.Font = Enum.Font.GothamBlack
title.TextSize = 44
title.Parent = bg`,
      },
      {
        heading: "2. The progress bar",
        paragraphs: [
          "The bar is two Frames: a dark track and a colored fill. The fill starts at Scale 0 width and you tween it up as loading progresses.",
        ],
        code: `local track = Instance.new("Frame")
track.Size = UDim2.fromScale(0.4, 0.03)
track.Position = UDim2.fromScale(0.3, 0.56)
track.BackgroundColor3 = Color3.fromRGB(29, 31, 41)
track.Parent = bg
Instance.new("UICorner", track).CornerRadius = UDim.new(1, 0)

local fill = Instance.new("Frame")
fill.Size = UDim2.fromScale(0, 1)
fill.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
fill.Parent = track
Instance.new("UICorner", fill).CornerRadius = UDim.new(1, 0)`,
      },
      {
        heading: "3. Animate it and clean up",
        paragraphs: [
          "Use TweenService to grow the fill. When loading is done, Destroy the GUI so it's gone for good.",
        ],
        code: `local tween = game:GetService("TweenService"):Create(
\tfill,
\tTweenInfo.new(3, Enum.EasingStyle.Linear),
\t{ Size = UDim2.fromScale(1, 1) }
)
tween:Play()
tween.Completed:Connect(function()
\tgui:Destroy()
end)`,
        tip: "For a real game, drive the fill from actual asset-loading progress rather than a fixed timer, so it never finishes before the game is ready.",
      },
    ],
    faq: [
      {
        q: "How do I cover the top bar too?",
        a: "Set IgnoreGuiInset = true on the ScreenGui. The first Frame with Size UDim2.fromScale(1,1) then covers the entire viewport.",
      },
      {
        q: "How do I animate the progress bar?",
        a: "Tween the fill Frame's Size from UDim2.fromScale(0,1) to UDim2.fromScale(1,1) with TweenService, then Destroy the GUI in tween.Completed.",
      },
    ],
  },
  {
    slug: "how-to-use-uilistlayout-in-roblox",
    title: "How to Use UIListLayout in Roblox",
    description:
      "UIListLayout auto-arranges a container's children into a row or column. Learn the key properties — FillDirection, Padding, alignment, SortOrder — with a working Luau example.",
    category: "Layouts",
    relatedTemplate: "settings",
    intro:
      "UIListLayout is the Roblox layout object that automatically stacks a Frame's children in a vertical list or horizontal row. Instead of positioning every button by hand, you drop one UIListLayout into a container and the children arrange themselves. This guide covers the properties that matter and a complete example.",
    sections: [
      {
        heading: "1. Add it to a container",
        paragraphs: [
          "UIListLayout is a child of the container it controls. The moment it's parented, every sibling Frame, button or label gets arranged.",
        ],
        code: `local layout = Instance.new("UIListLayout")
layout.Parent = containerFrame`,
      },
      {
        heading: "2. Direction, padding and alignment",
        paragraphs: [
          "FillDirection picks vertical or horizontal. Padding sets the gap between children. HorizontalAlignment and VerticalAlignment position the whole stack within the container.",
        ],
        code: `layout.FillDirection = Enum.FillDirection.Vertical
layout.Padding = UDim.new(0, 12)
layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
layout.VerticalAlignment = Enum.VerticalAlignment.Top`,
      },
      {
        heading: "3. Control order with SortOrder",
        paragraphs: [
          "By default children sort by their layout order, then name. Set SortOrder to LayoutOrder and give each child a LayoutOrder number to control the exact sequence.",
        ],
        code: `layout.SortOrder = Enum.SortOrder.LayoutOrder
firstButton.LayoutOrder = 1
secondButton.LayoutOrder = 2`,
        tip: "Pair UIListLayout with a UIPadding on the same container to inset the whole stack from the edges — no per-child margins needed.",
      },
    ],
    faq: [
      {
        q: "Does UIListLayout work horizontally too?",
        a: "Yes — set FillDirection = Enum.FillDirection.Horizontal and the children arrange left to right (or right to left depending on alignment).",
      },
      {
        q: "Why aren't my children spacing apart?",
        a: "Set the layout's Padding to a UDim value like UDim.new(0, 10). Without it, children touch edge to edge.",
      },
    ],
  },
  {
    slug: "how-to-make-a-roblox-global-leaderboard-gui",
    title: "How to Make a Roblox Global Leaderboard GUI",
    description:
      "Build a global Roblox leaderboard that ranks all players across servers with OrderedDataStore, then displays the top entries in a GUI — with the full Luau for saving, sorting and showing rows.",
    category: "Data",
    relatedTemplate: "leaderboard",
    intro:
      "A global leaderboard ranks every player by a stat like total coins, and the ranking persists across servers. The hard part isn't the GUI — it's storing sorted data with OrderedDataStore and reading the top players back. This guide covers the full loop: save a score, fetch the top 10, and render them as rows. Start from the leaderboard template for the row layout.",
    sections: [
      {
        heading: "1. Store ranked data with OrderedDataStore",
        paragraphs: [
          "An OrderedDataStore keeps values sortable. Use the player's UserId as the key and their score as the value, so each player appears once.",
        ],
        code: `local DataStoreService = game:GetService("DataStoreService")
local scores = DataStoreService:GetOrderedDataStore("CoinsLeaderboard")

local function saveScore(player, coins)
\tscores:UpdateAsync(tostring(player.UserId), function(old)
\t\treturn math.max(old or 0, coins)
\tend)
end`,
      },
      {
        heading: "2. Read the top players",
        paragraphs: [
          "GetSortedAsync returns the entries in order. Pass false for descending (highest first) and a page size. GetCurrentPage gives the ranked list of { key, value }.",
        ],
        code: `local function getTop(n)
\tlocal page = scores:GetSortedAsync(false, n)
\tlocal entries = {}
\tfor _, entry in ipairs(page:GetCurrentPage()) do
\t\tlocal userId = tonumber(entry.key)
\t\tlocal player = game:GetService("Players"):GetNameFromUserIdAsync(userId)
\t\ttable.insert(entries, { name = player, score = entry.value })
\tend
\treturn entries
end`,
        tip: "GetNameFromUserIdAsync is a web call — cache names so you don't re-fetch the same player every refresh.",
      },
      {
        heading: "3. Send the list to clients and build rows",
        paragraphs: [
          "Fire a RemoteEvent with the top list; each client builds a row per entry. Because the panel has a UIListLayout, parenting each row stacks it automatically.",
        ],
        code: `-- Server
local remote = game.ReplicatedStorage:WaitForChild("LeaderboardUpdate")
task.spawn(function()
\twhile true do
\t\tremote:FireAllClients(getTop(10))
\t\ttask.wait(60) -- refresh once a minute
\tend
end)

-- Client: make one row per entry, parented to the panel
local function makeRow(rank, name, score)
\tlocal row = Instance.new("Frame")
\trow.Size = UDim2.fromScale(1, 0.14)
\trow.Parent = panel
\t-- ...rank label, name label, score label...
\treturn row
end`,
      },
    ],
    faq: [
      {
        q: "How often should I refresh a global leaderboard?",
        a: "OrderedDataStore has tight rate limits. Cache the top list and refresh every 30–60 seconds via a server loop, never on every score change.",
      },
      {
        q: "Why does a player appear twice?",
        a: "You're using something other than UserId as the key. Always key by tostring(player.UserId) so each player maps to exactly one entry.",
      },
    ],
  },
  {
    slug: "how-to-animate-roblox-guis-with-tweenservice",
    title: "How to Animate Roblox GUIs with TweenService",
    description:
      "Make Roblox GUIs feel polished: slide panels in from off-screen, fade and pop them, and chain animations — all with TweenService and the right EasingStyle.",
    category: "Animation",
    relatedTemplate: "main-menu",
    intro:
      "Static GUIs feel flat. TweenService interpolates properties like Position, Size and transparency over time, so a menu can slide in, a button can pop, and a notification can fade. This guide covers the three patterns behind almost every animated Roblox UI.",
    sections: [
      {
        heading: "1. Slide a panel into place",
        paragraphs: [
          "Start the panel off-screen, then tween its Position to the final spot. TweenInfo controls duration and easing.",
        ],
        code: `local TweenService = game:GetService("TweenService")
panel.Position = UDim2.fromScale(0.5, -0.5) -- start above the screen

local info = TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
TweenService:Create(panel, info, { Position = UDim2.fromScale(0.5, 0.5) }):Play()`,
      },
      {
        heading: "2. Fade and pop with Size",
        paragraphs: [
          "Tween Size from small to full and BackgroundTransparency from 1 to 0 for a pop-in effect. Multiple properties can go in one tween.",
        ],
        code: `panel.Size = UDim2.fromScale(0.2, 0.2)
panel.BackgroundTransparency = 1
TweenService:Create(panel, TweenInfo.new(0.3), {
\tSize = UDim2.fromScale(0.4, 0.6),
\tBackgroundTransparency = 0,
}):Play()`,
      },
      {
        heading: "3. Chain animations with Completed",
        paragraphs: [
          "Connect to a tween's Completed signal to start the next one — useful for an intro then a reveal.",
        ],
        code: `local slide = TweenService:Create(panel, TweenInfo.new(0.4), { Position = UDim2.fromScale(0.5, 0.5) })
slide.Completed:Connect(function()
\tTweenService:Create(panel, TweenInfo.new(0.2), { BackgroundTransparency = 0 }):Play()
end)
slide:Play()`,
        tip: "EasingStyle changes the feel a lot: Back overshoots (playful), Quad is smooth, Elastic bounces. Pick by mood, not randomly.",
      },
    ],
    faq: [
      {
        q: "Can I tween TextColor3 or a color?",
        a: "Yes — TweenService animates Color3 properties like TextColor3 and BackgroundColor3 the same way it animates Position.",
      },
      {
        q: "How do I make an animation loop forever?",
        a: "Set TweenInfo with Reverses = true and RepeatCount = -1, so the tween runs back and forth indefinitely.",
      },
    ],
  },
  {
    slug: "how-to-make-a-draggable-roblox-gui",
    title: "How to Make a Draggable Roblox GUI",
    description:
      "Let players drag a Roblox GUI Frame around the screen with the mouse or touch, using UserInputService — including the offset fix so it doesn't jump to the cursor.",
    category: "Interaction",
    intro:
      "A draggable window, inventory or settings panel feels native. The trick is UserInputService: start dragging on press, move the Frame on InputChanged, and stop on release. The key detail is recording the offset between the cursor and the Frame at the start, so it doesn't snap to the corner.",
    sections: [
      {
        heading: "1. Track press, move and release",
        paragraphs: [
          "Listen on the title bar (not the whole panel) so buttons inside still work. InputBegan starts the drag; UserInputService.InputChanged moves it; InputEnded stops it.",
        ],
        code: `local UserInputService = game:GetService("UserInputService")
local dragging, dragStart, startPos

titleBar.InputBegan:Connect(function(input)
\tif input.UserInputType == Enum.UserInputType.MouseButton1
\tor input.UserInputType == Enum.UserInputType.Touch then
\t\tdragging = true
\t\tdragStart = input.Position
\t\tstartPos = frame.Position
\tend
end)`,
      },
      {
        heading: "2. Move the Frame with the cursor",
        paragraphs: [
          "On InputChanged, add the cursor's travel since dragStart to the Frame's start position. Mixing Scale and Offset in UDim2.new keeps it working regardless of how the Frame was positioned.",
        ],
        code: `UserInputService.InputChanged:Connect(function(input)
\tif not dragging then return end
\tif input.UserInputType == Enum.UserInputType.MouseMovement
\tor input.UserInputType == Enum.UserInputType.Touch then
\t\tlocal delta = input.Position - dragStart
\t\tframe.Position = UDim2.new(
\t\t\tstartPos.X.Scale, startPos.X.Offset + delta.X,
\t\t\tstartPos.Y.Scale, startPos.Y.Offset + delta.Y
\t\t)
\tend
end)

UserInputService.InputEnded:Connect(function(input)
\tif input.UserInputType == Enum.UserInputType.MouseButton1
\tor input.UserInputType == Enum.UserInputType.Touch then
\t\tdragging = false
\tend
end)`,
        tip: "Drag by a title-bar Frame, not the whole panel — otherwise the drag swallows clicks on the buttons inside it.",
      },
    ],
    faq: [
      {
        q: "Why does the Frame jump to the cursor when I grab it?",
        a: "You're setting Position to the cursor directly. Instead, record startPos = frame.Position at drag start and add the cursor's delta to it, so the Frame keeps its grab point.",
      },
      {
        q: "Does this work on mobile?",
        a: "Yes — handle Enum.UserInputType.Touch the same way as MouseButton1 in InputBegan and InputEnded, and Touch in InputChanged.",
      },
    ],
  },
  {
    slug: "how-to-make-a-responsive-roblox-gui",
    title: "How to Make a Responsive Roblox GUI",
    description:
      "Make a Roblox GUI that looks right on phone, tablet and desktop: size with Scale not Offset, center with AnchorPoint, cap text with UITextSizeConstraint, and shrink whole sections with UIScale.",
    category: "Layouts",
    relatedTemplate: "main-menu",
    intro:
      "Roblox runs on everything from phones to 4K monitors, so a GUI built with fixed pixel sizes breaks on the wrong screen. The fix is to think in Scale (fractions of the screen) instead of Offset (pixels), anchor elements so they recenter, and cap text so it stays readable. This guide covers the four habits behind every responsive Roblox UI.",
    sections: [
      {
        heading: "1. Size with Scale, not Offset",
        paragraphs: [
          "UDim2 has a Scale and an Offset component. fromScale(0.4, 0.6) means 40%/60% of the screen — it adapts. fromOffset(400, 600) means fixed pixels — it doesn't.",
        ],
        code: `-- Responsive (adapts to every screen)
panel.Size = UDim2.fromScale(0.4, 0.6)
panel.Position = UDim2.fromScale(0.5, 0.5)

-- Avoid: fixed pixels look wrong on phones or 4K
panel.Size = UDim2.fromOffset(400, 600)`,
      },
      {
        heading: "2. Center with AnchorPoint",
        paragraphs: [
          "Position 0.5, 0.5 puts the top-left corner at the screen center. Set AnchorPoint 0.5, 0.5 and the element centers on its own middle instead.",
        ],
        code: `panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.Position = UDim2.fromScale(0.5, 0.5)`,
      },
      {
        heading: "3. Keep text readable",
        paragraphs: [
          "TextScaled grows text to fill its box, which gets huge on big screens. A UITextSizeConstraint caps the max size so it stays tidy.",
        ],
        code: `label.TextScaled = true
local cap = Instance.new("UITextSizeConstraint")
cap.MaxTextSize = 24
cap.Parent = label`,
        tip: "The editor's Desktop / Tablet / Mobile toggle previews the same GUI at each viewport — build with Scale and check all three.",
      },
    ],
    faq: [
      {
        q: "Why does my GUI look tiny on a phone?",
        a: "It's sized in Offset (pixels). Switch to Scale via UDim2.fromScale so the GUI is a fraction of the screen and adapts to every device.",
      },
      {
        q: "How do I shrink a whole GUI on small screens?",
        a: "Parent a UIScale to the ScreenGui and set its Scale property (e.g., 0.8) to shrink every descendant together — useful for fitting dense HUDs on phones.",
      },
    ],
  },
  {
    slug: "roblox-gui-script-generator",
    title: "Roblox GUI Script Generator",
    description:
      "Use a visual Roblox GUI script generator to build responsive interfaces, preview interactions, and export client Luau, server handlers, JSON, or a complete ZIP project.",
    category: "Export",
    relatedTemplate: "main-menu",
    intro:
      "A useful Roblox GUI script generator should do more than print a decorative code sample. It should let you inspect the hierarchy, edit real Roblox properties, preview important states, and understand which code runs on the client or server before anything reaches Studio. This guide explains that workflow and the limits that keep generated UI code honest.",
    sections: [
      {
        heading: "What a Roblox GUI script generator should create",
        paragraphs: [
          "The core output is a ScreenGui hierarchy made from Roblox instances such as Frame, TextLabel, TextButton, ScrollingFrame, and layout helpers. Names, parenting, colors, transparency, text, fonts, ZIndex, and responsive geometry should all be visible before export, not hidden behind a prompt.",
          "A generator can also wire predictable interface behavior. Showing, hiding, or toggling a panel belongs in the client script. RemoteEvent and Teleport actions need an additional server script because the server owns authoritative game behavior.",
        ],
      },
      {
        heading: "Turn a visual hierarchy into Roblox instances",
        paragraphs: [
          "Every object on the canvas becomes an Instance.new call with an explicit parent. A child panel should be parented to its container, not recreated as a flat list. That hierarchy matters for layout objects, visibility, clipping, and scripts that find elements by name.",
          "Generated variables should be stable and readable enough to inspect. You should be able to compare the canvas with the Luau and recognize the same ScreenGui, frames, labels, buttons, and constraints.",
        ],
        code: `local screenGui = Instance.new("ScreenGui")
screenGui.Name = "GameMenu"
screenGui.Parent = player:WaitForChild("PlayerGui")

local menuPanel = Instance.new("Frame")
menuPanel.Name = "MenuPanel"
menuPanel.Size = UDim2.fromScale(0.4, 0.6)
menuPanel.Parent = screenGui`,
      },
      {
        heading: "Separate client UI from server-owned actions",
        paragraphs: [
          "Rendering a player's interface and reacting to local button presses belongs in a LocalScript. The client can request an action, but it cannot be trusted to award currency, grant an item, approve a purchase, or choose an unrestricted teleport destination.",
          "For configured RemoteEvent and Teleport actions, Roblox GUI Maker generates a separate server file. RemoteEvent handlers include an explicit validation boundary. Teleport handlers accept only Place IDs configured in the exported GUI. Your game still needs to validate player state, permissions, prices, ownership, and rate limits.",
        ],
        tip: "Treat every value received from a RemoteEvent as untrusted input, even when the matching button was generated by the editor.",
      },
      {
        heading: "Choose Luau, JSON, or ZIP export",
        paragraphs: [
          "Use the client Luau download when you only need the generated ScreenGui and local interactions. Download the server Luau when the project includes RemoteEvent or Teleport behavior. The server file is omitted when the GUI has no server-backed action.",
          "JSON preserves the editable scene so it can be imported back into the browser editor. The ZIP package combines README instructions, project.json, client Luau, and optional server Luau in one browser-generated download. It is a handoff bundle, not a native Roblox model file.",
        ],
      },
      {
        heading: "Install the generated scripts in Roblox Studio",
        paragraphs: [
          "Create a LocalScript under StarterGui and paste the client Luau into it. When the package includes roblox-gui.server.lua, create a Script under ServerScriptService and paste the server output there. Run the experience and confirm the ScreenGui appears in PlayerGui.",
          "Keep project.json outside Studio as the editable source for future browser changes. If you revise the scene, export again and replace the generated scripts deliberately instead of merging unrelated versions by hand.",
        ],
      },
      {
        heading: "Test behavior and keep security on the server",
        paragraphs: [
          "Preview each device size and every configured visibility state before export. In Studio, test with more than one player when RemoteEvents or teleports depend on player-specific state. Published teleports must be tested from a published experience because Studio playtesting cannot prove the live TeleportService path.",
          "Generated code is a clear starting point, not evidence that a game's economy is secure. Review every server callback, reject unexpected arguments, enforce cooldowns where needed, and keep datastore, purchase, reward, and permission checks on the server.",
        ],
      },
    ],
    faq: [
      {
        q: "What does the Roblox GUI script generator export?",
        a: "It exports client Luau for the ScreenGui and local interactions, optional server Luau for configured RemoteEvent or Teleport actions, an editable JSON scene, and a ZIP package containing the relevant project files and instructions.",
      },
      {
        q: "Where do I put the generated Roblox GUI scripts?",
        a: "Put the client output in a LocalScript under StarterGui. Put optional server output in a Script under ServerScriptService.",
      },
      {
        q: "Does it generate a complete game's logic?",
        a: "No. It generates UI instances and selected interaction wiring. Secure purchases, rewards, inventory, permissions, datastores, and other game systems remain your responsibility.",
      },
      {
        q: "Can I edit the project after exporting?",
        a: "Yes. Export project.json and import it back into Roblox GUI Maker later. The JSON preserves the editable scene while Luau and ZIP serve the Studio handoff workflow.",
      },
    ],
    relatedGuides: [
      {
        slug: "how-to-make-a-gui-in-roblox",
        title: "How to Make a GUI in Roblox",
      },
    ],
  },
  {
    slug: "how-to-make-a-gui-in-roblox",
    title: "How to Make a GUI in Roblox",
    description:
      "Learn how to make a GUI in Roblox: plan the player task, build a ScreenGui hierarchy, create responsive layouts, wire buttons, preview states, and test in Studio.",
    category: "Getting Started",
    relatedTemplate: "main-menu",
    intro:
      "A Roblox GUI becomes much easier to build when you treat it as a small player workflow instead of a pile of frames. Start with one screen and one primary action, organize the hierarchy, make the geometry responsive, then connect and test behavior. This guide follows that sequence from a blank ScreenGui to an exported project in Roblox Studio.",
    sections: [
      {
        heading: "Decide what the GUI helps the player do",
        paragraphs: [
          "Name the screen by its job: main menu, shop, inventory, settings, loading screen, or HUD. Write down the primary action a player should notice first. A main menu may lead with Play; a shop may lead with a selected item and Buy button.",
          "Keep the first version narrow. Define the default state, the main action, and one way to leave or close the screen. Extra tabs and decorative states are easier to add after the core path works.",
        ],
      },
      {
        heading: "Build a clear ScreenGui hierarchy",
        paragraphs: [
          "Use one ScreenGui as the root, then parent related elements under named containers. A menu panel should own its title and buttons. A settings panel should own its rows. Clear names make generated code readable and let later scripts find the right object without searching the entire PlayerGui.",
          "Layout helpers belong under the container they arrange. UIListLayout stacks siblings, UIGridLayout tiles item cells, UIPadding creates internal space, and UICorner or UIGradient changes appearance without becoming a separate visual panel.",
        ],
        code: `ScreenGui
└── MenuPanel
    ├── Title
    ├── PlayButton
    ├── SettingsButton
    └── UIListLayout`,
      },
      {
        heading: "Make the layout responsive",
        paragraphs: [
          "Use Scale for proportions that should follow the viewport and Offset for small fixed details such as padding or minimum touch sizes. Center important panels with AnchorPoint instead of compensating with arbitrary negative offsets.",
          "Aspect-ratio and size constraints keep a panel usable without letting it become too wide, too small, or unreadable. Check the same scene in desktop, tablet, and mobile previews before spending time on final polish.",
        ],
        code: `panel.Size = UDim2.fromScale(0.42, 0.62)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.AnchorPoint = Vector2.new(0.5, 0.5)`,
      },
      {
        heading: "Connect buttons to visible states",
        paragraphs: [
          "Start with interface behavior you can see: show a settings panel, hide a menu, toggle an inventory, or disable the entire GUI. Preview those states and confirm every target has a clear name.",
          "Use a RemoteEvent when a button requests server-owned work. Use a Teleport action only for known destination Place IDs. The client may send the request, but the server must decide whether the player is allowed to complete it.",
        ],
        tip: "Never put currency awards, purchase approval, item grants, or permission checks only in a LocalScript.",
      },
      {
        heading: "Preview desktop, tablet, and mobile states",
        paragraphs: [
          "Preview is not only a visual check. Click buttons in the intended order, confirm panels open and close, and look for states that trap the player without a visible way back. RemoteEvent and Teleport previews should explain the request without pretending to execute live server behavior.",
          "Repeat the path at each device size. Look for clipped labels, buttons that become too small, unexpected horizontal scrolling, and panels whose primary action falls below the viewport.",
        ],
      },
      {
        heading: "Export, install, and test in Roblox Studio",
        paragraphs: [
          "Download the ZIP package when you want the scene JSON, generated scripts, and placement instructions together. Put client Luau in a LocalScript under StarterGui and optional server Luau in a Script under ServerScriptService.",
          "Run the game in Studio and confirm the ScreenGui appears in PlayerGui. Test server-backed actions with the correct multiplayer or published environment. Keep the JSON export so you can revise the editable design instead of treating generated Luau as the only source.",
        ],
      },
    ],
    faq: [
      {
        q: "Where should I create a ScreenGui in Roblox?",
        a: "For authored Studio projects, place a ScreenGui under StarterGui so Roblox copies it into each player's PlayerGui. Generated client Luau can also create the ScreenGui from a LocalScript under StarterGui.",
      },
      {
        q: "How do I make a Roblox GUI work on mobile?",
        a: "Use Scale for responsive proportions, AnchorPoint for stable alignment, and aspect-ratio or size constraints for readable limits. Preview the interface at phone, tablet, and desktop sizes before export.",
      },
      {
        q: "When does a Roblox GUI need server code?",
        a: "Pure visibility changes can stay on the client. Purchases, rewards, permissions, teleports, datastores, and other authoritative game actions require server-side validation.",
      },
      {
        q: "Can I start from a template instead of a blank screen?",
        a: "Yes. Open a main menu, shop, settings, inventory, loading screen, or leaderboard template, replace the placeholder text, preview the states, and export the result.",
      },
    ],
    relatedGuides: [
      {
        slug: "roblox-gui-script-generator",
        title: "Understand Generated Roblox GUI Scripts",
      },
    ],
  },
  {
    slug: "roblox-ui-design",
    title: "Roblox UI Design — Layout, Color, and Sizing Guide",
    description:
      "Roblox UI design fundamentals: UDim2 sizing, AnchorPoint alignment, color palettes, font pairing, spacing with UIListLayout, and responsive patterns for mobile and desktop.",
    category: "Design",
    intro:
      "Good Roblox UI design is not about fancy images — it is about clean hierarchy, readable text, consistent spacing, and layouts that survive every screen size. This guide covers the core design decisions you make before writing a single script: how to size elements, align them, pick colors, choose fonts, and build responsive layouts that look right on phones and desktops.",
    sections: [
      {
        heading: "1. UDim2 — the foundation of Roblox UI sizing",
        paragraphs: [
          "Every Roblox GUI element uses UDim2 for Position and Size. A UDim2 has two axes, each with a Scale component (0–1, fraction of parent) and an Offset component (pixels). Understanding when to use each is the single most important Roblox UI design skill.",
          "Use Scale for anything that should grow or shrink with the parent: panel widths, row heights, padding ratios. Use Offset for things that must stay a fixed pixel size: icon dimensions, corner radius, small gaps.",
          "A common pattern: Size = UDim2.fromScale(0.8, 0.6) for the main panel, then Size = UDim2.fromOffset(32, 32) for icons inside it. This keeps the panel proportional but the icon crisp.",
        ],
        tip: "If you only use Offset, your GUI will look perfect on one screen size and broken on every other. Always start with Scale and add Offset only for fixed-size details.",
      },
      {
        heading: "2. AnchorPoint and alignment",
        paragraphs: [
          "AnchorPoint decides which corner of an element its Position refers to. The default is (0, 0) — top-left. Setting it to (0.5, 0.5) centers the element on its Position coordinate.",
          "For centered panels, always set AnchorPoint to (0.5, 0.5) and Position to UDim2.fromScale(0.5, 0.5). This centers the panel regardless of screen size.",
          "For corner HUDs, use AnchorPoint (0, 0) for top-left, (1, 0) for top-right, (0, 1) for bottom-left, and (1, 1) for bottom-right. Then Position with Scale values like (0.02, 0) or (0.98, 0) to keep a small margin from the edge.",
        ],
      },
      {
        heading: "3. Color palettes that work in Roblox",
        paragraphs: [
          "Roblox games run on a huge range of screens — bright laptop monitors, dim phone screens, and everything in between. Your palette needs enough contrast to be readable everywhere.",
          "A safe starting palette: dark background (Color3.fromRGB(18, 18, 24)), light text (Color3.fromRGB(230, 230, 240)), and one accent color (Color3.fromRGB(0, 162, 255) for interactive elements). This gives you a 12:1+ contrast ratio on the text.",
          "Avoid pure white (#FFFFFF) for large background areas — it is harsh on eyes in a dark game. Use off-white (#E6E6F0) or a very light blue-gray instead.",
          "For status colors: green (#22C55E) for success, red (#EF4444) for errors, yellow (#EAB308) for warnings. Keep them consistent across the entire UI.",
        ],
        tip: "Test your colors at 50% brightness — if you can still read the text, the contrast is good enough for mobile players in bright rooms.",
      },
      {
        heading: "4. Font pairing and text hierarchy",
        paragraphs: [
          "Roblox offers several built-in fonts. For a clean modern look: GothamBold or GothamBlack for headings, GothamMedium for body text, and Code for technical labels.",
          "Establish a clear text hierarchy: H1 (titles) at 28–36px, H2 (section headers) at 20–24px, body text at 14–16px, and captions at 11–12px. Stick to these sizes across the entire GUI.",
          "Line height matters more than you think. In Roblox, TextLabel.TextWrapped = true with a generous frame height gives you natural line spacing. Avoid cramming text into tight frames.",
          "For dark backgrounds, use TextColor3 with high brightness (200+). For light backgrounds, use low brightness (30–60). Never use mid-gray text — it is unreadable on both.",
        ],
      },
      {
        heading: "5. Spacing with UIListLayout and UIPadding",
        paragraphs: [
          "UIListLayout is the Roblox equivalent of CSS flexbox. Drop it into a Frame and every child stacks automatically — vertically or horizontally, with configurable padding and alignment.",
          "Use UIPadding on the parent Frame to create consistent margins. A good rule: 16px outer padding, 8–12px between items. This matches modern web design conventions and feels natural to players.",
          "For grids (shops, inventories), use UIGridLayout with CellSize in Scale for responsive columns. UDim2.fromScale(0.3, 0) with a UIAspectRatioConstraint gives you square cells that resize with the parent.",
          "For button rows, use UIListLayout with FillDirection = Horizontal and a small Padding value. Each button gets a fixed Offset width so they stay tap-friendly on mobile.",
        ],
        tip: "If your layout looks cramped, increase UIPadding before increasing the Frame size. White space is free and makes everything more readable.",
      },
      {
        heading: "6. Responsive design for mobile and desktop",
        paragraphs: [
          "Roblox players use phones, tablets, desktops, and consoles — sometimes in the same server. Your GUI must work on all of them.",
          "The core principle: use Scale-based sizing for containers and layouts, then add UITextSizeConstraint and UIAspectRatioConstraint for fine control over text and aspect ratios.",
          "For mobile: minimum tap target is 44x44 pixels (Apple HIG standard). Keep buttons at least this size. Use UIListLayout spacing of 8px minimum between tappable elements.",
          "For desktop: you can afford denser layouts with smaller text. But keep the same Scale-based structure so the layout reflows naturally.",
          "Test with the Roblox Studio emulator at 360x640 (phone), 768x1024 (tablet), and 1920x1080 (desktop). If it looks right at all three, it will work everywhere.",
        ],
      },
      {
        heading: "7. Visual hierarchy and information architecture",
        paragraphs: [
          "Every screen should have one clear focal point — the thing the player should look at first. Use size, color, and position to draw the eye there.",
          "Group related elements visually. A Frame with a slightly different BackgroundColor3 and a UICorner creates a card that says 'these items belong together.'",
          "Use consistent spacing between groups (16–24px) and tighter spacing within groups (8–12px). This creates a visual rhythm that players intuitively understand.",
          "Limit the number of visible actions per screen. A main menu needs 3–5 buttons, not 15. If you need more, use sub-screens or tabs.",
        ],
      },
      {
        heading: "8. Export and iterate with Roblox GUI Maker",
        paragraphs: [
          "Design decisions are hard to undo once you have written 500 lines of Luau. Roblox GUI Maker lets you preview layouts visually, test responsive behavior, and export clean code — so you can iterate on design before committing to scripts.",
          "Start from a template that matches your screen type (main menu, shop, inventory, HUD), adjust the properties in the visual editor, preview on multiple device sizes, and export when the layout feels right.",
          "The exported Luau uses real Roblox property names (BackgroundColor3, UDim2, UIListLayout) so you learn the API while designing. Every property you tweak in the editor maps directly to a Luau line you can read and modify.",
        ],
      },
    ],
    faq: [
      {
        q: "What is the best font for Roblox GUIs?",
        a: "GothamBold for headings and GothamMedium for body text is the safest modern combination. Avoid legacy fonts like SourceSans — they look dated and have inconsistent rendering across platforms.",
      },
      {
        q: "How do I make a Roblox GUI look good on mobile?",
        a: "Use Scale-based sizing, keep tap targets above 44x44 pixels, test at 360x640 resolution, and use UIListLayout for automatic reflow. UITextSizeConstraint prevents text from becoming unreadable on small screens.",
      },
      {
        q: "What colors work best for Roblox GUIs?",
        a: "Dark backgrounds (18, 18, 24) with light text (230, 230, 240) and one accent color (0, 162, 255) give you the best contrast across all screen types. Avoid pure white backgrounds — use off-white instead.",
      },
      {
        q: "Should I use Scale or Offset for Roblox GUI sizing?",
        a: "Use Scale for containers, panels, and layout elements that should resize with the screen. Use Offset for icons, corner radius, and fixed-size details. Never use only Offset — your GUI will break on different screen sizes.",
      },
      {
        q: "How do I center a GUI element in Roblox?",
        a: "Set AnchorPoint to (0.5, 0.5) and Position to UDim2.fromScale(0.5, 0.5). This centers the element on its parent regardless of screen size.",
      },
      {
        q: "What is the difference between UIListLayout and UIGridLayout?",
        a: "UIListLayout stacks children in a single row or column. UIGridLayout arranges children in a grid of rows and columns. Use UIListLayout for button bars and settings lists; use UIGridLayout for item grids and inventory screens.",
      },
    ],
    relatedGuides: [
      {
        slug: "how-to-make-a-responsive-roblox-gui",
        title: "How to Make a Responsive Roblox GUI",
      },
      {
        slug: "how-to-use-uilistlayout-in-roblox",
        title: "How to Use UIListLayout in Roblox",
      },
    ],
  },
  {
    slug: "roblox-gui-code-structure",
    title: "Roblox GUI Code Explained: Instance.new, UDim2 & Parenting",
    description:
      "How clean Roblox GUI Luau is structured: every element is an Instance.new, positioned with UDim2 scale, parented into a tree, with the properties and button handlers that make it run. With copy-paste Luau.",
    category: "Getting Started",
    relatedTemplate: "main-menu",
    intro:
      "Under the hood every Roblox GUI is just Luau: a tree of instances built with Instance.new, positioned with UDim2, and wired together through parenting and event handlers. The difference between messy GUI code you dread editing and clean code you can ship is a small set of consistent patterns. This guide walks through how production-ready Roblox GUI Luau is structured — the same structure the visual editor exports — so you can read it, change it, and write your own.",
    sections: [
      {
        heading: "1. What “clean” Roblox GUI code looks like",
        paragraphs: [
          "Clean GUI code is readable, predictable, and safe to change. Three habits get you there: build every element with Instance.new, give it a UDim2 size and position based on scale (0–1) of its parent, and set its Parent last — after its properties. Those three rules are also exactly what the exported Luau from the visual editor follows, which is why it reads like hand-written code rather than generated soup.",
          "The payoff is real: when every Frame is created the same way you can scan a script and instantly see the tree; when positions are scale-based the UI survives any screen size; and when parenting is deliberate, layout and z-order just work.",
        ],
        code: `local button = Instance.new("TextButton")
button.Name = "Play"
button.Size = UDim2.fromScale(0.4, 0.12)
button.Position = UDim2.fromScale(0.3, 0.6)
button.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
button.Text = "PLAY"
button.Parent = panel -- parent last`,
        tip: "If a generated or copied script sets Parent before the other properties, reorder it. Roblox starts replicating an instance the moment it is parented, so setting properties first avoids a frame of stale defaults.",
      },
      {
        heading: "2. Every GUI element is an Instance (Instance.new)",
        paragraphs: [
          "Frame, TextLabel, TextButton, TextBox, ImageLabel, ScrollingFrame, and decorators like UICorner and UIGradient are all Instances. You create each one with Instance.new(className), then set its properties by name — the same names you see in Roblox Studio's Properties window.",
          "Name every instance. A button called Play is searchable in code and in the Explorer; a button left as TextButton is not. Names also become the handles you reason about when the tree gets deep.",
        ],
        code: `local gui = Instance.new("ScreenGui")
gui.Name = "MainMenu"
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true

local panel = Instance.new("Frame")
panel.Name = "Panel"
panel.Size = UDim2.fromScale(0.4, 0.6)
panel.Position = UDim2.fromScale(0.3, 0.2)
panel.BackgroundColor3 = Color3.fromRGB(21, 23, 31)`,
      },
      {
        heading: "3. Position and size with UDim2: scale vs offset",
        paragraphs: [
          "UDim2 is how Roblox places and sizes UI. A UDim2 takes four numbers: UDim2.new(scaleX, offsetX, scaleY, offsetY). The scale part is a fraction of the parent (0.5 = half the parent's width); the offset part is pixels. Use scale for anything that should stretch with the screen, and offset only for fixed details like corner radius or padding.",
          "fromScale and fromOffset are the common shortcuts: UDim2.fromScale(0.4, 0.6) means 40% × 60% of the parent with zero pixel offset. Building in scale is what makes the same GUI look right on a phone and a desktop.",
        ],
        code: `-- 40% wide, 60% tall, anchored to the panel's coordinate space
panel.Size = UDim2.fromScale(0.4, 0.6)
panel.Position = UDim2.fromScale(0.3, 0.2)

-- a 12-pixel corner radius (offset, because radius is a fixed detail)
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = panel`,
        tip: "AnchorPoint changes what a position is measured from. With AnchorPoint = (0.5, 0.5) and Position = UDim2.fromScale(0.5, 0.5), an element is perfectly centered in its parent on every screen.",
      },
      {
        heading: "4. Parenting: the tree that decides layout and order",
        paragraphs: [
          "Parent is the single property that defines your GUI's structure. Set panel.Parent = gui and the panel becomes a child of the ScreenGui; set button.Parent = panel and the button inherits the panel's coordinate space. The whole interface is a tree rooted at the ScreenGui that Roblox copies into each player's PlayerGui.",
          "ZIndex controls which sibling renders on top when they overlap, and it is relative to siblings under the same parent. Parent everything into the container that owns it conceptually — a menu panel owns its buttons — and the tree becomes documentation of your layout.",
        ],
        code: `gui.Parent = player:WaitForChild("PlayerGui")
panel.Parent = gui

local play = Instance.new("TextButton")
play.Name = "Play"
play.Size = UDim2.fromScale(1, 0.14) -- 1.0 = the panel's full width
play.Parent = panel`,
      },
      {
        heading: "5. The properties you will set on almost every element",
        paragraphs: [
          "A handful of properties cover most of what a GUI needs. BackgroundColor3 (a Color3.fromRGB), BackgroundTransparency (0 = solid, 1 = invisible), ZIndex, and Visible cover the box. Text elements add Text, Font, TextSize, and TextColor3. Set BackgroundTransparency = 1 on a label that should show only text, so its default gray box does not show through.",
          "Color3.fromRGB takes 0–255 values, the same numbers you see in any color picker. Keep a small palette of consistent colors rather than a unique hex per element — that consistency is what makes a screen feel designed.",
        ],
        code: `local title = Instance.new("TextLabel")
title.Name = "Title"
title.Size = UDim2.fromScale(1, 0.2)
title.BackgroundTransparency = 1
title.Text = "GAME TITLE"
title.Font = Enum.Font.GothamBlack
title.TextSize = 30
title.TextColor3 = Color3.fromRGB(153, 203, 255)
title.Parent = panel`,
        tip: "Enum.Font.GothamBold, GothamMedium, and GothamBlack cover most modern Roblox UI. Pick one bold weight for headings and one medium weight for body, and reuse them everywhere.",
      },
      {
        heading: "6. Wiring a button with a clean Activated handler",
        paragraphs: [
          "A TextButton does something when its Activated event fires. Connect a function with button.Activated:Connect(function() ... end) and keep the body small — usually toggling another frame's Visible or firing a RemoteEvent. Name the target frame clearly so the handler reads like English.",
          "For show/hide that should feel polished, animate it with TweenService instead of snapping. Either way, the handler's job is to change one piece of state, not to bury game logic in the UI.",
        ],
        code: `settingsButton.Activated:Connect(function()
\tsettingsPanel.Visible = not settingsPanel.Visible
end)`,
      },
      {
        heading: "7. Messy GUI code: the anti-patterns to avoid",
        paragraphs: [
          "Most hard-to-maintain Roblox GUI scripts share the same smells: pixel-only positions that break on other screens (UDim2.fromOffset everywhere), properties set in a random order with Parent in the middle, unnamed instances left as Frame1 and Frame2, and the same five lines of boilerplate copy-pasted for every button.",
          "The fix is mechanical: move to scale-based UDim2, name everything, parent last, and extract repeated instance-setup into a helper — or, easier, build the whole thing visually and read the result. Clean code is not about cleverness; it is about doing the same thing the same way every time.",
        ],
        tip: "If you are copy-pasting an Instance.new block for the tenth time, that is the signal to either wrap it in a function or build it visually and export.",
      },
      {
        heading: "8. Where this script lives in Roblox Studio",
        paragraphs: [
          "Put client GUI code in a LocalScript under StarterGui (inside the ScreenGui) or under StarterPlayerScripts. Code that must be authoritative — purchases, rewards, permissions — goes in a Script under ServerScriptService, reached through a RemoteEvent.",
          "The visual editor exports both: a client LocalScript that builds the GUI, and an optional server Script with the RemoteEvent handlers and validation boundaries already separated. Paste them into the right places and the interface works as previewed.",
        ],
      },
    ],
    faq: [
      {
        q: "What does Instance.new do in Roblox?",
        a: "Instance.new(className) creates a new instance of a Roblox class — Frame, TextButton, UICorner, ScreenGui, and so on. It returns the object so you can set its properties and parent it into the tree.",
      },
      {
        q: "What is UDim2 in Roblox GUI code?",
        a: "UDim2 is the data type for 2D position and size. UDim2.new(scaleX, offsetX, scaleY, offsetY) combines a parent-relative scale (0–1) with a pixel offset, so the same value can be responsive and pixel-precise at once.",
      },
      {
        q: "Should I set Parent before or after the other properties?",
        a: "After. Roblox starts replicating an instance the moment it has a Parent, so set its Name, Size, Position, and colors first, then assign Parent last to avoid a frame of default values showing.",
      },
      {
        q: "How is this different from building the GUI in Studio's editor?",
        a: "Studio's Properties panel and code end up as the same Instances. Writing or generating the Luau directly keeps the structure explicit, copy-pasteable, and versionable — and lets you recreate an entire GUI from one script.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "How to Make a GUI in Roblox" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
      { slug: "roblox-gui-script-generator", title: "Roblox GUI Script Generator" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

// Reverse lookup: guides whose relatedTemplate matches, for cross-linking from
// a template detail page to its how-to guide(s).
export function guidesForTemplate(templateSlug: string): Guide[] {
  return GUIDES.filter((g) => g.relatedTemplate === templateSlug);
}
