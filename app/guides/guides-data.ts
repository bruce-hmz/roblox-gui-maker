// Written how-to guides. Each targets a tutorial-intent query that currently
// lands on YouTube ("how to make a roblox shop gui", etc.) and pairs with a
// template you can open in the editor. SSG'd at /guides/<slug>.

export type GuideTable = {
  headers: string[];
  rows: string[][];
};

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  table?: GuideTable;
  code?: string;
  tip?: string;
};

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  // Per-guide <title> override. Set when the brand suffix ("| Roblox GUI
  // Maker") would make the page claim the homepage's head term instead of
  // its own keyword family — doc-intent guide pages anchor their own terms.
  metaTitle?: string;
  // Per-guide <meta name="description"> override. `description` is also page
  // copy (guide index cards), so search-snippet edits go here instead.
  metaDescription?: string;
  description: string;
  category: string;
  relatedTemplate?: string;
  customCta?: { href: string; label: string };
  // Doc-intent guides answer the query fully on-page; an above-the-fold
  // "open the template" button reads as a bridge page for that intent, so
  // the CTA stays in the post-content sections only.
  hideTemplateCta?: boolean;
  intro: string;
  sections: GuideSection[];
  faq: Faq[];
  relatedGuides?: Array<{ slug: string; title: string }>;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-design-polished-roblox-ui",
    metaTitle: "How to Design Polished Roblox UI (Gradients, Strokes, Depth)",
    metaDescription:
      "Make modern, premium-feeling Roblox UI with multi-stop UIGradient, glowing UIStroke borders, and depth — with copy-paste Luau. No Photoshop or image assets.",
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
      "How to build a Roblox inventory GUI with a ScrollingFrame, UIGridLayout for uniform slots, category tabs, item equip RemoteEvents, and copy-paste Luau.",
    category: "HUD",
    relatedTemplate: "inventory",
    intro:
      "An inventory GUI displays every tool, weapon, pet, or cosmetic a player owns inside a scrollable grid of interactive slots. The cleanest pattern in Roblox Studio uses a ScrollingFrame with a UIGridLayout plus a hidden template slot cloned once per item from server-replicated data. Below is the complete step-by-step Explorer setup, responsive slot sizing, selection borders, and equip RemoteEvent wiring.",
    sections: [
      {
        heading: "1. Set up the ScreenGui and ScrollingFrame + UIGridLayout",
        paragraphs: [
          "Place your inventory ScreenGui inside StarterGui with ResetOnSpawn set to false so players do not lose their open state or slot references after respawning. Inside the main Frame, add a ScrollingFrame set to AutomaticCanvasSize = Enum.AutomaticSize.Y and CanvasSize = UDim2.new(0, 0, 0, 0) so the scrollbar adapts automatically as players collect more items.",
          "Parent a UIGridLayout inside the ScrollingFrame. Set CellSize using Scale on X (for example 0.22 on desktop or coupled with a UIAspectRatioConstraint inside the cell) so cards keep square proportions across phones and monitors instead of overflowing horizontally.",
        ],
        code: `-- LocalScript inside the Inventory ScreenGui
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local gui = script.Parent
gui.ResetOnSpawn = false

local scroll = gui:WaitForChild("Panel"):WaitForChild("ScrollingFrame")
scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y
scroll.CanvasSize = UDim2.new(0, 0, 0, 0)
scroll.ScrollBarThickness = 6

local grid = scroll:WaitForChild("UIGridLayout")
grid.SortOrder = Enum.SortOrder.LayoutOrder
grid.CellPadding = UDim2.fromOffset(8, 8)`,
      },
      {
        heading: "2. Build one reusable template slot (ImageButton + UIStroke)",
        paragraphs: [
          "Avoid writing dozens of Instance.new calls inside your item loop. Instead, keep one styled template slot stored under the LocalScript (or in ReplicatedStorage) containing a background UICorner, an ImageLabel for the asset icon, an optional quantity TextLabel in the bottom-right corner, and a UIStroke whose Transparency starts at 1.",
          "Make the clickable root of the slot an ImageButton or TextButton with Text = \"\" so players on mouse, mobile touch, and controller can focus and activate every cell cleanly.",
        ],
        tip: "Name each cloned slot Slot_<itemId> and set its LayoutOrder by rarity or obtain order so UIGridLayout keeps your backpack sorted automatically.",
      },
      {
        heading: "3. Populate slots from player data and clear stale children",
        paragraphs: [
          "Whenever the server sends an updated inventory table or a player switches category tabs (for example All / Weapons / Pets), destroy existing slot frames first without deleting the UIGridLayout or UIPadding inside the ScrollingFrame. Checking child:IsA(\"GuiObject\") prevents accidentally deleting layout constraints.",
        ],
        code: `local equipRemote = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("EquipItem")
local slotTemplate = script:WaitForChild("SlotTemplate")
local activeSlot: TextButton? = nil

local function populateInventory(items: { { id: string, icon: string, qty: number } })
	for _, child in ipairs(scroll:GetChildren()) do
		if child:IsA("GuiObject") then
			child:Destroy()
		end
	end

	for index, item in ipairs(items) do
		local slot = slotTemplate:Clone()
		slot.Name = "Slot_" .. item.id
		slot.LayoutOrder = index
		slot:WaitForChild("Icon").Image = item.icon
		slot:WaitForChild("Quantity").Text = item.qty > 1 and ("x" .. item.qty) or ""

		slot.Activated:Connect(function()
			if activeSlot then
				activeSlot.UIStroke.Transparency = 1
			end
			slot.UIStroke.Transparency = 0
			activeSlot = slot
			equipRemote:FireServer(item.id)
		end)

		slot.Parent = scroll
	end
end`,
      },
      {
        heading: "4. Validate equip and use requests on the server",
        paragraphs: [
          "The client GUI only shows what the player owns and requests an equip or use action. A Script in ServerScriptService must verify the player actually owns that itemId inside their server-side inventory table or DataStore session before equipping a Tool or applying stats.",
        ],
        tip: "Set ClipsDescendants = true on the ScrollingFrame so rows sliding off the top and bottom edges clip cleanly inside the panel border.",
      },
    ],
    faq: [
      {
        q: "How do I add or remove items at runtime without breaking the grid?",
        a: "Clone your template slot and parent it to the ScrollingFrame to add an item, or call slot:Destroy() to remove one. Because UIGridLayout manages positioning automatically, the remaining slots reflow cleanly.",
      },
      {
        q: "Why did my UIGridLayout stop working after clearing the ScrollingFrame?",
        a: "Calling scroll:ClearAllChildren() deletes the UIGridLayout and UIPadding along with the slots. Always loop over scroll:GetChildren() and only destroy children where child:IsA(\"GuiObject\").",
      },
      {
        q: "How do I show which item is currently equipped?",
        a: "Give the template slot a UIStroke starting with Transparency = 1, then set Transparency = 0 (and clear the previous slot's stroke) when the server confirms the item is equipped.",
      },
      {
        q: "How do I add category tabs like Weapons, Pets, and Consumables?",
        a: "Pass a category string into populateInventory(items, selectedCategory) and skip items whose item.category does not match before cloning, or toggle Visible = false on non-matching slots because UIGridLayout ignores invisible GuiObjects.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-use-uilistlayout-in-roblox", title: "How to Use UIListLayout in Roblox" },
      { slug: "how-to-make-a-responsive-roblox-gui", title: "How to Make a Responsive Roblox GUI" },
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "How to Open a GUI with a Key Press in Roblox" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-code-redeem-gui",
    metaDescription:
      "How to build a Roblox Twitter/promo code redeem GUI: TextBox input, server-side RemoteFunction validation, DataStore duplicate protection and error feedback.",
    title: "How to Make a Roblox Code Redeem GUI",
    description:
      "How to build a working Roblox Twitter/promo code redeem GUI with TextBox input, server-side RemoteFunction validation, DataStore duplicate protection, and error feedback.",
    category: "Menus",
    relatedTemplate: "code-redeem",
    intro:
      "A code redeem GUI lets players type promotional, milestone, or creator codes into a TextBox to claim coins, boosts, or exclusive items. While the client UI takes only a few instances, security and anti-duplicate tracking belong completely on the server. Follow this complete client + server pattern with copy-paste Luau.",
    sections: [
      {
        heading: "1. Build the TextBox, Redeem button, and status label",
        paragraphs: [
          "Inside StarterGui, create a panel Frame containing a TextBox (with ClearTextOnFocus = false so players can fix a typo without retyping), a TextButton labeled REDEEM, and a status TextLabel below them for messages like \"Redeemed +500 Coins!\" or \"Code already claimed.\"",
        ],
        code: `-- LocalScript inside the CodeRedeem ScreenGui
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local redeemFunction = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("RedeemCode") :: RemoteFunction

local panel = script.Parent:WaitForChild("Panel")
local box = panel:WaitForChild("CodeInput") :: TextBox
local redeemBtn = panel:WaitForChild("RedeemButton") :: TextButton
local statusLabel = panel:WaitForChild("StatusLabel") :: TextLabel

local busy = false

redeemBtn.Activated:Connect(function()
	if busy then return end
	local rawCode = box.Text
	if string.gsub(rawCode, "%s+", "") == "" then
		statusLabel.Text = "Please enter a code first."
		return
	end

	busy = true
	statusLabel.Text = "Checking code..."
	local ok, message = redeemFunction:InvokeServer(rawCode)
	statusLabel.Text = message or (ok and "Reward granted!" or "Could not redeem code.")
	if ok then
		box.Text = ""
	end
	busy = false
end)`,
      },
      {
        heading: "2. Validate codes and enforce expiration on the server",
        paragraphs: [
          "Keep your code table strictly inside a Script in ServerScriptService so exploiters can never inspect valid codes from local memory. Normalize incoming input with string.upper and strip whitespace, reject non-string values immediately, and check optional expiresAt Unix timestamps via os.time().",
        ],
        code: `-- Script in ServerScriptService
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remotes = ReplicatedStorage:WaitForChild("Remotes")
local redeemFunction = remotes:WaitForChild("RedeemCode") :: RemoteFunction

local CODES = {
	LAUNCHDAY = { coins = 500, expiresAt = 1893456000 },
	WELCOME = { coins = 250, expiresAt = nil },
}

local playerCooldowns: { [Player]: number } = {}
local claimedByPlayer: { [number]: { [string]: boolean } } = {} -- hydrate from DataStore on join

redeemFunction.OnServerInvoke = function(player: Player, rawInput: unknown)
	if typeof(rawInput) ~= "string" then
		return false, "Invalid input."
	end

	local now = os.clock()
	if (playerCooldowns[player] or 0) > now then
		return false, "Please wait a moment before trying again."
	end
	playerCooldowns[player] = now + 1.5

	local code = string.upper((string.gsub(rawInput, "%s+", "")))
	local entry = CODES[code]
	if not entry then
		return false, "Invalid code."
	end
	if entry.expiresAt and os.time() > entry.expiresAt then
		return false, "This code has expired."
	end

	local claimed = claimedByPlayer[player.UserId]
	if not claimed then
		claimed = {}
		claimedByPlayer[player.UserId] = claimed
	end
	if claimed[code] then
		return false, "You have already redeemed this code."
	end

	claimed[code] = true
	-- Grant entry.coins to player leaderstats & persist claimed table in DataStore
	return true, ("Redeemed +%d Coins!"):format(entry.coins)
end`,
        tip: "Always add a short per-player cooldown (e.g. 1.5 seconds) and clear playerCooldowns[player] on Players.PlayerRemoving to stop brute-force spam and memory leaks.",
      },
      {
        heading: "3. Save redeemed codes inside the player's DataStore profile",
        paragraphs: [
          "Storing redeemed codes only in a server script table forgets them when the player rejoins another server. Save the player's claimed code dictionary alongside their currency inside DataStoreService, and mark claimed[code] = true before yielding on any async calls so rapid double-invokes cannot redeem twice.",
        ],
      },
      {
        heading: "4. Polish feedback states and mobile usability",
        paragraphs: [
          "Color statusLabel green on success and red on errors, reset the TextBox only when ok is true, and ensure the TextBox does not sit too close to the bottom edge where virtual mobile keyboards cover the prompt.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I use a RemoteEvent or a RemoteFunction for a code redeem GUI?",
        a: "Either works, though a RemoteFunction lets the server return (ok, message) cleanly to update the status label in one round trip. Just keep a client debounce and server rate limit so players cannot spam InvokeServer.",
      },
      {
        q: "How do I prevent a player from redeeming the same code twice?",
        a: "Store a dictionary of claimed code keys inside each player's DataStore save (for example playerProfile.RedeemedCodes[code] = true). Check it on the server before granting coins or items, and save on leave.",
      },
      {
        q: "Can players see my promo codes if they use an exploit?",
        a: "No, as long as the CODES table lives strictly inside ServerScriptService. Server scripts are never replicated to clients.",
      },
      {
        q: "Why does typing lowercase or trailing spaces make a valid code fail?",
        a: "Phone keyboards frequently add a trailing space after autocorrect. Calling string.upper((string.gsub(rawInput, \"%s+\", \"\"))) on the server fixes casing and accidental whitespace automatically.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-shop-gui", title: "How to Make a Roblox Shop GUI" },
      { slug: "how-to-make-a-roblox-daily-rewards-gui", title: "How to Make a Roblox Daily Rewards GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-daily-rewards-gui",
    title: "How to Make a Roblox Daily Rewards GUI",
    description:
      "How to build a 7-day Roblox daily login rewards GUI with claimed, ready, and locked visual states, UTC server-time validation, DataStore streaks, and Luau code.",
    category: "Menus",
    relatedTemplate: "daily-rewards",
    intro:
      "A 7-day daily rewards calendar boosts retention by rewarding players who return each day. On the UI side, each day card displays one of three states (claimed, today ready, or locked); on the server side, os.time() and DataStoreService determine eligibility so players cannot spoof their device clock. Here is the complete layout and server streak system.",
    sections: [
      {
        heading: "1. Lay out a 7-day grid with clear visual states",
        paragraphs: [
          "Create seven numbered day Frames named Day1 through Day7 inside a container using UIListLayout (with HorizontalAlignment = Center and Wraps = true) or UIGridLayout so desktop shows a wide strip and narrow mobile screens wrap into clean rows. Style each card with three clear attributes or state colors: muted/checkmarked for claimed days, bright Electric Blue outline for today's claimable card, and dimmed with a lock label for future days.",
        ],
      },
      {
        heading: "2. Validate eligibility and track streaks on the server",
        paragraphs: [
          "Never check time in a LocalScript because client clocks depend on the player's device timezone and can be changed freely. Store lastClaimEpoch and streak in the player's DataStore profile. When the Claim RemoteEvent fires, compare os.time() on the server: wait at least 86400 seconds (or compare UTC day index math.floor(os.time() / 86400) for calendar-day resets) before advancing the streak.",
        ],
        code: `-- Script in ServerScriptService
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local claimEvent = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("ClaimDailyReward") :: RemoteEvent
local syncEvent = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("SyncDailyRewards") :: RemoteEvent

local DAY_SECONDS = 86400
local REWARDS = { 100, 150, 200, 300, 400, 500, 1000 }

local profiles: { [number]: { lastDayIndex: number, streak: number } } = {}

local function currentDayIndex(): number
	return math.floor(os.time() / DAY_SECONDS)
end

claimEvent.OnServerEvent:Connect(function(player: Player)
	local profile = profiles[player.UserId]
	if not profile then return end

	local today = currentDayIndex()
	if profile.lastDayIndex >= today then
		return -- already claimed today
	end

	local nextStreak = (today - profile.lastDayIndex == 1)
		and ((profile.streak % #REWARDS) + 1)
		or 1

	profile.lastDayIndex = today
	profile.streak = nextStreak

	local coins = REWARDS[nextStreak]
	-- Grant coins here and mark DataStore dirty
	syncEvent:FireClient(player, {
		streak = nextStreak,
		canClaim = false,
		rewardGranted = coins,
	})
end)`,
        tip: "Comparing UTC day indices via math.floor(os.time() / 86400) feels much friendlier than strict 24-hour timers because players who play at 9 PM one day and 7 PM the next day still count as returning the next calendar day.",
      },
      {
        heading: "3. Update the client calendar UI from server state",
        paragraphs: [
          "When the player joins and whenever a claim succeeds, the server sends { streak, canClaim } through SyncDailyRewards. Your LocalScript loops through Day1 to Day7 and updates background colors, borders, and button interactability so the GUI never drifts out of sync with DataStore truth.",
        ],
        code: `-- LocalScript inside DailyRewards ScreenGui
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local syncEvent = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("SyncDailyRewards") :: RemoteEvent
local claimEvent = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("ClaimDailyReward") :: RemoteEvent

local grid = script.Parent:WaitForChild("Panel"):WaitForChild("DaysGrid")
local claimBtn = script.Parent:WaitForChild("Panel"):WaitForChild("ClaimButton") :: TextButton

syncEvent.OnClientEvent:Connect(function(state)
	local nextDay = state.canClaim and ((state.streak % 7) + 1) or 0
	for day = 1, 7 do
		local card = grid:FindFirstChild("Day" .. day) :: Frame?
		if not card then continue end
		if day <= state.streak and not (state.canClaim and state.streak == 7) then
			card.BackgroundColor3 = Color3.fromRGB(32, 48, 38) -- claimed
		elseif day == nextDay then
			card.BackgroundColor3 = Color3.fromRGB(0, 120, 215) -- claim today
		else
			card.BackgroundColor3 = Color3.fromRGB(28, 30, 40) -- locked
		end
	end
	claimBtn.Active = state.canClaim
	claimBtn.Text = state.canClaim and "CLAIM REWARD" or "COME BACK TOMORROW"
end)

claimBtn.Activated:Connect(function()
	claimEvent:FireServer()
end)`,
      },
      {
        heading: "4. Add a red notification dot to prompt claims",
        paragraphs: [
          "Most top games avoid popping up the full Daily Rewards screen immediately over a loading or tutorial view; instead, if state.canClaim is true, show a small pulsing badge on the main HUD's Rewards button until claimed.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I check 24-hour intervals or calendar days for daily rewards?",
        a: "Calendar day checks (math.floor(os.time() / 86400)) usually create better retention because players playing an hour earlier the next evening aren't forced to wait out a strict 24-hour timer.",
      },
      {
        q: "How do I store streaks between play sessions?",
        a: "Save lastDayIndex and streak inside a DataStore table keyed by tostring(player.UserId). Load the profile in Players.PlayerAdded and persist via UpdateAsync on PlayerRemoving and game:BindToClose.",
      },
      {
        q: "What happens after a player finishes Day 7?",
        a: "Using (profile.streak % 7) + 1 loops smoothly back to Day 1 on Day 8 so loyal players continue earning rewards every week.",
      },
      {
        q: "Can players cheat daily rewards by changing Windows or phone date/time?",
        a: "No, as long as all checks run on the server using os.time(), which reads Roblox's server clock rather than the client's device clock.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-code-redeem-gui", title: "How to Make a Roblox Code Redeem GUI" },
      { slug: "how-to-make-a-roblox-shop-gui", title: "How to Make a Roblox Shop GUI" },
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "How to Animate Roblox GUIs with TweenService" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-quest-tracker-gui",
    title: "How to Make a Roblox Quest Tracker HUD",
    description:
      "How to build a compact Roblox quest tracker HUD pinned to the screen edge with a tweened progress bar, collapse/expand toggle, and live quest updates.",
    category: "HUD",
    relatedTemplate: "quest-tracker",
    intro:
      "A quest tracker HUD stays visible during active gameplay to remind players of their current objective and live progress without blocking the center viewport. The secret is edge-anchored Scale positioning, a two-frame tweened progress bar, and a quick collapse toggle for smaller phone screens. Here is the complete Luau pattern.",
    sections: [
      {
        heading: "1. Pin a compact corner HUD away from Roblox's core buttons",
        paragraphs: [
          "Anchor the tracker to the top-right (AnchorPoint = Vector2.new(1, 0), Position = UDim2.fromScale(0.98, 0.08)) or middle-left below Roblox's top bar so it never collides with the Chat, Leaderboard, or Backpack controls. Use a UIPadding inside the panel and cap width with a UISizeConstraint so it does not eat half the screen on phones or stretch overly wide on ultrawide monitors.",
        ],
        code: `-- LocalScript inside QuestTracker ScreenGui
local TweenService = game:GetService("TweenService")
local panel = script.Parent:WaitForChild("TrackerPanel") :: Frame
panel.AnchorPoint = Vector2.new(1, 0)
panel.Position = UDim2.fromScale(0.98, 0.14)
panel.Size = UDim2.fromScale(0.24, 0.15)

local sizeLimit = Instance.new("UISizeConstraint")
sizeLimit.MinSize = Vector2.new(210, 88)
sizeLimit.MaxSize = Vector2.new(340, 140)
sizeLimit.Parent = panel`,
      },
      {
        heading: "2. Animate progress with a nested track and fill Frame",
        paragraphs: [
          "Build the bar using a dark rounded Track Frame and a child Fill Frame anchored at (0, 0) with Size = UDim2.fromScale(0, 1). Set ClipsDescendants = true on the Track so rounded corners stay crisp even when the Fill is narrow, and tween Fill.Size whenever progress changes.",
        ],
        code: `local titleLabel = panel:WaitForChild("ObjectiveLabel") :: TextLabel
local countLabel = panel:WaitForChild("CountLabel") :: TextLabel
local fill = panel:WaitForChild("Track"):WaitForChild("Fill") :: Frame

local function updateQuestProgress(objectiveText: string, current: number, goal: number)
	local safeGoal = math.max(goal, 1)
	local clamped = math.clamp(current, 0, safeGoal)
	local ratio = clamped / safeGoal

	titleLabel.Text = objectiveText
	countLabel.Text = ("%d / %d"):format(clamped, safeGoal)

	TweenService:Create(
		fill,
		TweenInfo.new(0.28, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
		{ Size = UDim2.fromScale(ratio, 1) }
	):Play()
end`,
        tip: "Keep quest titles under 5–7 words (for example \"Collect 10 Star Shards\") so text stays legible at 14px without wrapping awkwardly on mobile.",
      },
      {
        heading: "3. Add a collapse/expand toggle for small screens",
        paragraphs: [
          "Players on phones appreciate being able to fold the tracker down to a single slim header pill. Add a small arrow TextButton in the panel header that toggles bodyContainer.Visible and smoothly tweens the panel height between expanded and collapsed states.",
        ],
        code: `local toggleBtn = panel:WaitForChild("Header"):WaitForChild("ToggleButton") :: TextButton
local body = panel:WaitForChild("Body") :: Frame
local expanded = true

toggleBtn.Activated:Connect(function()
	expanded = not expanded
	body.Visible = expanded
	toggleBtn.Text = expanded and "−" or "+"
	TweenService:Create(
		panel,
		TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
		{ Size = expanded and UDim2.fromScale(0.24, 0.15) or UDim2.fromScale(0.24, 0.05) }
	):Play()
end)`,
      },
      {
        heading: "4. Drive updates from server events cleanly",
        paragraphs: [
          "Track real quest progress on the server (coins picked up, NPCs defeated, stages cleared) and fire a RemoteEvent like QuestUpdated:FireClient(player, questData) only when counts change or on join. The client never decides when a quest finishes — the server sends a completion state so you can pulse the bar green and show a Claim button or toast.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I make the quest progress bar fill smoothly without jumping?",
        a: "Calculate ratio = math.clamp(current / goal, 0, 1) and use TweenService:Create on the fill Frame's Size to UDim2.fromScale(ratio, 1) over roughly 0.25–0.35 seconds.",
      },
      {
        q: "Where should I position a quest HUD so it doesn't overlap Roblox UI?",
        a: "Avoid the extreme top-left (Roblox menu and chat) and top-right topbar inset. Start around Y Scale 0.12–0.16 on the right or left edge, or set IgnoreGuiInset = false so your coordinates automatically start below the 36px/58px core topbar.",
      },
      {
        q: "How do I display multiple active quests at once?",
        a: "Turn TrackerPanel into a vertical UIListLayout container, convert the quest card into a reusable template Frame, and clone one card per active quest ID.",
      },
      {
        q: "Why does the rounded fill bar stick out of the track corners at low percentages?",
        a: "Enable ClipsDescendants = true on the Track Frame or give both Track and Fill a matching UICorner (CornerRadius = UDim.new(1, 0)).",
      },
    ],
    relatedGuides: [
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "How to Animate Roblox GUIs with TweenService" },
      { slug: "how-to-make-a-responsive-roblox-gui", title: "How to Make a Responsive Roblox GUI" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-main-menu-gui",
    title: "How to Make a Roblox Main Menu GUI",
    description:
      "Step-by-step guide: build a Roblox main menu GUI with a centered Frame, UIListLayout buttons, BlurEffect camera intro, and .Activated Luau click handling.",
    category: "Menus",
    relatedTemplate: "main-menu",
    intro:
      "Your main menu is the first screen every player sees, and a clunky or off-center menu hurts first impressions before gameplay even begins. This guide walks through the full setup: ScreenGui settings, centered responsive container, UIListLayout stacked buttons, cross-device .Activated click events, and clean Play transition with Lighting BlurEffect.",
    sections: [
      {
        heading: "1. Configure the ScreenGui container correctly",
        paragraphs: [
          "Create a ScreenGui inside StarterGui named MainMenu (or build it inside a LocalScript). Set ResetOnSpawn = false so dying in the game never brings the title screen back, and set IgnoreGuiInset = true if your dimmed backdrop should cover the full viewport cleanly behind Roblox's top bar.",
        ],
        code: `local Players = game:GetService("Players")
local player = Players.LocalPlayer

local gui = Instance.new("ScreenGui")
gui.Name = "MainMenu"
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true
gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
gui.Parent = player:WaitForChild("PlayerGui")`,
      },
      {
        heading: "2. Center the menu panel and add a responsive cap",
        paragraphs: [
          "Setting AnchorPoint = Vector2.new(0.5, 0.5) paired with Position = UDim2.fromScale(0.5, 0.5) centers any panel by its midpoint rather than its top-left corner. Add a UISizeConstraint and UIPadding so the card never looks huge on an ultrawide desktop or tiny on a phone.",
        ],
        code: `local panel = Instance.new("Frame")
panel.Size = UDim2.fromScale(0.38, 0.56)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.BackgroundColor3 = Color3.fromRGB(21, 23, 31)
panel.Parent = gui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 18)
corner.Parent = panel

local pad = Instance.new("UIPadding")
pad.PaddingTop = UDim.new(0, 20)
pad.PaddingBottom = UDim.new(0, 20)
pad.PaddingLeft = UDim.new(0, 20)
pad.PaddingRight = UDim.new(0, 20)
pad.Parent = panel

local title = Instance.new("TextLabel")
title.Size = UDim2.fromScale(1, 0.18)
title.BackgroundTransparency = 1
title.Text = "GAME TITLE"
title.Font = Enum.Font.GothamBlack
title.TextScaled = true
title.TextColor3 = Color3.fromRGB(153, 203, 255)
title.Parent = panel`,
      },
      {
        heading: "3. Stack Play, Shop, and Settings buttons with UIListLayout",
        paragraphs: [
          "Drop a UIListLayout into the panel and set SortOrder = Enum.SortOrder.LayoutOrder. Assigning LayoutOrder = 1 to the title, 2 to Play, and 3 to Settings guarantees predictable ordering without wrestling with Y offsets every time you add a Credits or Updates button.",
        ],
        code: `local layout = Instance.new("UIListLayout")
layout.Padding = UDim.new(0, 12)
layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
layout.SortOrder = Enum.SortOrder.LayoutOrder
layout.Parent = panel`,
      },
      {
        heading: "4. Handle Play, sub-panels, and camera/blur polish with .Activated",
        paragraphs: [
          "Always wire buttons using button.Activated instead of MouseButton1Click so desktop clicks, mobile taps, and controller selection trigger the same callback. When Play is clicked, disable BlurEffect in Lighting, smoothly hide the menu, and enable your HUD ScreenGui.",
        ],
        code: `local Lighting = game:GetService("Lighting")
local blur = Instance.new("BlurEffect")
blur.Size = 14
blur.Parent = Lighting

local playBtn = Instance.new("TextButton")
playBtn.LayoutOrder = 2
playBtn.Size = UDim2.fromScale(1, 0.16)
playBtn.Text = "PLAY"
playBtn.Font = Enum.Font.GothamBold
playBtn.TextSize = 20
playBtn.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
playBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
playBtn.Parent = panel
Instance.new("UICorner", playBtn).CornerRadius = UDim.new(0, 12)

playBtn.Activated:Connect(function()
	blur.Enabled = false
	gui.Enabled = false
	-- Enable your HUD ScreenGui or reset CameraType here
end)`,
        tip: "Use gui.Enabled = false rather than gui:Destroy() if players can return to the main menu or open Settings from an in-game button later.",
      },
    ],
    faq: [
      {
        q: "How do I center a Roblox Main Menu GUI on every screen size?",
        a: "Set AnchorPoint to Vector2.new(0.5, 0.5) and Position to UDim2.fromScale(0.5, 0.5), then size the Frame with Scale (plus a UISizeConstraint) so its midpoint stays locked to the screen center on desktop, tablet, and mobile.",
      },
      {
        q: "Why does my main menu reappear every time a player dies?",
        a: "By default ScreenGui.ResetOnSpawn is true, which clones a fresh copy from StarterGui when the character respawns. Set ResetOnSpawn = false on your MainMenu ScreenGui.",
      },
      {
        q: "Should I use Activated or MouseButton1Click for main menu buttons?",
        a: "Use Activated. Unlike MouseButton1Click, Activated fires reliably across mouse clicks, mobile touchscreen taps, and console gamepad confirmations.",
      },
      {
        q: "How do I freeze or point the camera at the lobby behind the main menu?",
        a: "In a LocalScript, set workspace.CurrentCamera.CameraType = Enum.CameraType.Scriptable and assign Camera.CFrame to a pre-placed Part in your map, then switch back to Enum.CameraType.Custom inside playBtn.Activated.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "How to Open a GUI with a Key Press in Roblox" },
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "How to Use UIListLayout in Roblox" },
      { slug: "how-to-import-rbxmx-into-roblox-studio", title: "How to Import .rbxmx GUI Files into Roblox Studio" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-shop-gui",
    title: "How to Make a Roblox Shop GUI",
    description:
      "How to make a working Roblox item shop GUI with a UIGridLayout ScrollingFrame, item cards, close button, and secure server-side RemoteEvent currency checks.",
    category: "Shop",
    relatedTemplate: "shop",
    intro:
      "A great Roblox shop GUI makes browsing items effortless while keeping every coin deduction strictly on the server. Using a ScrollingFrame with UIGridLayout ensures new weapons, pets, or trails tile cleanly into rows without overlapping, and wiring each card through a RemoteEvent keeps exploiters from granting themselves free gear. Follow this step-by-step setup.",
    sections: [
      {
        heading: "1. Build the shop container, close button, and ScrollingFrame grid",
        paragraphs: [
          "Place a centered Frame inside StarterGui > ShopGui. Give it a top header bar with a Close TextButton (`X`), then fill the body with a ScrollingFrame using AutomaticCanvasSize = Enum.AutomaticSize.Y and CanvasSize = UDim2.new(0, 0, 0, 0) so the scrollbar grows cleanly as your catalog expands.",
          "Inside the ScrollingFrame, add a UIGridLayout plus UIPadding so cards stay framed neatly away from the scrollbar track.",
        ],
        code: `-- LocalScript inside ShopGui
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local gui = script.Parent :: ScreenGui
gui.ResetOnSpawn = false

local panel = gui:WaitForChild("Panel") :: Frame
local scroll = panel:WaitForChild("ItemsScroll") :: ScrollingFrame
scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y
scroll.CanvasSize = UDim2.new(0, 0, 0, 0)
scroll.ClipsDescendants = true

local grid = scroll:WaitForChild("UIGridLayout") :: UIGridLayout
grid.CellPadding = UDim2.fromOffset(10, 10)
grid.SortOrder = Enum.SortOrder.LayoutOrder`,
      },
      {
        heading: "2. Populate item cards dynamically from a shared catalog module",
        paragraphs: [
          "Put item names, prices, and rbxassetid icons in a single ModuleScript inside ReplicatedStorage so both the client shop UI and server purchase handler read the exact same source of truth.",
        ],
        code: `-- ReplicatedStorage/ShopCatalog (ModuleScript)
return {
	SpeedCoil = { Name = "Speed Coil", Price = 250, Icon = "rbxassetid://0", Order = 1 },
	GravityCoil = { Name = "Gravity Coil", Price = 600, Icon = "rbxassetid://0", Order = 2 },
}`,
      },
      {
        heading: "3. Fire purchases through a RemoteEvent and validate on the server",
        paragraphs: [
          "Never let the client tell the server how much an item costs. The client button only fires the item's string ID via buyRemote:FireServer(itemId). On the server, look up the real price from ShopCatalog, confirm the player isn't already holding it (if permanent), check leaderstats.Coins, deduct safely, and grant the item.",
        ],
        code: `-- LocalScript (client)
local buyRemote = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("BuyItem") :: RemoteEvent
buyButton.Activated:Connect(function()
	buyRemote:FireServer(itemId)
end)

-- Script in ServerScriptService (server)
local ShopCatalog = require(ReplicatedStorage:WaitForChild("ShopCatalog"))
buyRemote.OnServerEvent:Connect(function(player: Player, itemId: unknown)
	if typeof(itemId) ~= "string" then return end
	local item = ShopCatalog[itemId]
	if not item then return end

	local coins = player:FindFirstChild("leaderstats") and player.leaderstats:FindFirstChild("Coins")
	if not coins or coins.Value < item.Price then return end

	coins.Value -= item.Price
	-- Grant tool/item to player's Backpack & save to DataStore
end)`,
        tip: "If you are selling Robux Game Passes rather than in-game Coin items, pair this grid pattern with MarketplaceService:PromptGamePassPurchase instead of deducting leaderstats.",
      },
      {
        heading: "4. Toggle the shop smoothly without losing scroll position",
        paragraphs: [
          "Toggle ShopGui.Enabled rather than destroying the shop on close. Keeping the ScreenGui cached preserves images and scroll offset while avoiding repeated Instance creation every time a player taps the Shop icon.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I make the Roblox shop scroll smoothly as I add more items?",
        a: "Set ScrollingFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y and CanvasSize = UDim2.new(0, 0, 0, 0), and add UIPadding inside the ScrollingFrame so top and bottom cards never hug the edge.",
      },
      {
        q: "How do shop items automatically arrange into rows and columns?",
        a: "Parent a UIGridLayout inside the ScrollingFrame and configure CellSize and CellPadding. Every GuiObject child added to the ScrollingFrame auto-tiles left-to-right.",
      },
      {
        q: "Why shouldn't the client check coins and fire a 'Bought' remote?",
        a: "Exploiters can fire any RemoteEvent directly with fake parameters. Only send the item ID from the client and always verify ownership and coin balance inside a Script in ServerScriptService.",
      },
      {
        q: "What is the difference between a Coin Shop GUI and a Game Pass Shop GUI?",
        a: "A Coin Shop uses your own RemoteEvent and deducts server-side in-game currency, whereas a Game Pass Shop calls MarketplaceService:PromptGamePassPurchase(player, passId) to process Robux purchases.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-gamepass-shop-gui", title: "How to Make a Roblox Game Pass Shop GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
      { slug: "how-to-make-a-roblox-inventory-gui", title: "How to Make a Roblox Inventory GUI" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-loading-screen-gui",
    title: "How to Make a Roblox Loading Screen GUI",
    description:
      "How to build a custom Roblox loading screen GUI inside ReplicatedFirst with ContentProvider:PreloadAsync, smooth progress bar tweening, and clean fade-out.",
    category: "Menus",
    relatedTemplate: "loading-screen",
    intro:
      "A great Roblox loading screen covers the viewport the instant a player joins, displays real preload progress rather than a fake timer, and fades out smoothly once essential assets are ready. Putting the LocalScript inside ReplicatedFirst ensures it appears immediately before StarterGui finishes replicating.",
    sections: [
      {
        heading: "1. Place the loading script inside ReplicatedFirst",
        paragraphs: [
          "Scripts in StarterGui wait for ReplicatedFirst and character replication, which makes your loading screen appear late. Instead, keep your LoadingScreen ScreenGui inside ReplicatedFirst alongside a LocalScript, call ReplicatedFirst:RemoveDefaultLoadingScreen(), and clone the GUI straight into PlayerGui.",
          "Remember to set ScreenGui.IgnoreGuiInset = true and ScreenGui.DisplayOrder = 100 so your backdrop covers Roblox's top bar and sits above any early HUD elements.",
        ],
        code: `-- LocalScript inside ReplicatedFirst
local ReplicatedFirst = game:GetService("ReplicatedFirst")
local Players = game:GetService("Players")

ReplicatedFirst:RemoveDefaultLoadingScreen()

local playerGui = Players.LocalPlayer:WaitForChild("PlayerGui")
local loadingGui = script:WaitForChild("LoadingScreen"):Clone()
loadingGui.IgnoreGuiInset = true
loadingGui.DisplayOrder = 100
loadingGui.Parent = playerGui`,
      },
      {
        heading: "2. Build the progress track, fill, and rotating tip label",
        paragraphs: [
          "Style your track and fill with rounded pill corners (CornerRadius = UDim.new(1, 0)) and enable ClipsDescendants on the track. Rotating gameplay tips every 2.5 seconds inside a task.spawn loop keeps the screen feeling alive while assets finish streaming.",
        ],
      },
      {
        heading: "3. Drive the bar from ContentProvider:PreloadAsync",
        paragraphs: [
          "Instead of locking players behind an artificial 5-second wait, feed key UI decals, sounds, and models into ContentProvider:PreloadAsync and advance the bar ratio smoothly for each completed asset. Once preloaded and game:IsLoaded() is true, add a short minimum display cap only if you want an intro beat, or fade right away.",
        ],
        code: `local ContentProvider = game:GetService("ContentProvider")
local TweenService = game:GetService("TweenService")

local fill = loadingGui.Backdrop.Track.Fill
local status = loadingGui.Backdrop.StatusLabel

local assets = workspace:WaitForChild("MapPreload"):GetDescendants()
local total = math.max(#assets, 1)

for i, asset in ipairs(assets) do
	ContentProvider:PreloadAsync({ asset })
	local ratio = i / total
	status.Text = ("Loading assets (%d%%)"):format(math.floor(ratio * 100))
	TweenService:Create(fill, TweenInfo.new(0.15, Enum.EasingStyle.Quad), {
		Size = UDim2.fromScale(ratio, 1),
	}):Play()
end`,
        tip: "Keep the preload list focused on critical UI images, lobby geometry, and audio so mobile players with slower connections load quickly instead of stalling on distant map parts.",
      },
      {
        heading: "4. Fade out and destroy the loading screen cleanly",
        paragraphs: [
          "Wait for game.Loaded if not already loaded, wrap the backdrop in a CanvasGroup (or tween BackgroundTransparency and TextTransparency), then call loadingGui:Destroy() once the fade finishes so no hidden full-screen frame swallows clicks.",
        ],
        code: `if not game:IsLoaded() then
	game.Loaded:Wait()
end

local fade = TweenService:Create(loadingGui.Backdrop, TweenInfo.new(0.45), {
	GroupTransparency = 1,
})
fade:Play()
fade.Completed:Wait()
loadingGui:Destroy()`,
      },
    ],
    faq: [
      {
        q: "How do I cover the top bar completely with a loading screen?",
        a: "Set ScreenGui.IgnoreGuiInset = true and set your background Frame's Size to UDim2.fromScale(1, 1) at Position (0, 0). Without IgnoreGuiInset, Roblox leaves a gap at the top.",
      },
      {
        q: "Why does Roblox's default loading screen flash before mine shows up?",
        a: "Put your script and ScreenGui in ReplicatedFirst and call ReplicatedFirst:RemoveDefaultLoadingScreen() on the first line so Roblox hands over control as early as possible.",
      },
      {
        q: "Should I add a 'Skip' button to my Roblox loading screen?",
        a: "Yes — players love a Skip button once game:IsLoaded() is true, especially on rejoin. Preload essential UI images first and let players jump straight in if decorative assets are still streaming.",
      },
      {
        q: "Why can't players click my Main Menu after the loading screen fades out?",
        a: "You probably faded BackgroundTransparency to 1 without calling loadingGui:Destroy() or setting Enabled = false. Invisible frames still block inputs if Active = true or GuiButtons sit above your menu.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "How to Animate Roblox GUIs with TweenService" },
      { slug: "roblox-gui-script-generator", title: "Roblox GUI Script Generator" },
    ],
  },
  {
    slug: "how-to-use-uilistlayout-in-roblox",
    metaDescription:
      "A complete UIListLayout guide for Roblox: Padding and alignment, LayoutOrder sorting, AbsoluteContentSize auto-sizing and position overrides. Copy-paste Luau.",
    title: "How to Use UIListLayout in Roblox",
    metaTitle: "Roblox UIListLayout: LayoutOrder, AbsoluteContentSize, Position",
    description:
      "A complete UIListLayout guide for Roblox: Padding and alignment, LayoutOrder sorting, AbsoluteContentSize auto-sizing, and position overrides — all with copy-paste Luau.",
    category: "Layouts",
    relatedTemplate: "settings",
    hideTemplateCta: true,
    intro:
      "UIListLayout is the Roblox layout object that automatically stacks a Frame's children into a vertical list or horizontal row. Instead of hand-positioning every button, you parent one UIListLayout to the container and the children arrange themselves — add one, remove one, reorder them, and the stack updates instantly. This guide covers every property that matters, then the three things that trip people up next: sorting with LayoutOrder, sizing containers to the stack with AbsoluteContentSize, and how position overrides work when the layout ignores a child's Position. Full Luau examples throughout, ending with a complete settings menu you can paste straight into Studio.",
    sections: [
      {
        heading: "1. What UIListLayout does",
        paragraphs: [
          "UIListLayout is a layout object, not a visible element: it has no size or color of its own. Parent it to any container — a Frame, a ScrollingFrame, a panel — and from that moment the container's children are arranged for you. Children keep their own Size; the layout only takes over their Position, stacking them top-to-bottom (or left-to-right) in sort order. New children are slotted in the instant they're parented, so you can build rows in a loop and never set a Position.",
          "The one rule to remember: one layout per container, and the layout must be a child of the container it controls. Siblings of the layout — Frames, buttons, labels — get arranged. Elements inside those Frames do not; a layout only controls its direct siblings.",
          "Why bother instead of positioning children by hand? Because a hand-built list is a maintenance trap: every Position is a number you must recalculate when you insert a row, change a height, or resize for mobile. A UIListLayout is one object doing that math forever — which is why nearly every shipped Roblox menu, shop and leaderboard panel uses one.",
        ],
        code: `local panel = Instance.new("Frame")
panel.Size = UDim2.fromScale(0.35, 0.5)
panel.Parent = screenGui

local layout = Instance.new("UIListLayout")
layout.Parent = panel`,
      },
      {
        heading: "2. Direction, padding and alignment",
        paragraphs: [
          "Three properties shape the stack. FillDirection picks the axis: Enum.FillDirection.Vertical stacks children top to bottom, Horizontal goes left to right. Padding is a UDim whose offset part sets the pixel gap between children — UDim.new(0, 12) leaves 12 pixels between every element. HorizontalAlignment and VerticalAlignment position the whole stack inside the container, so a vertical list can sit centered, left- or right-aligned without touching the children.",
          "Alignment applies to the stack as a whole, not to individual children. If you want one group of buttons centered and another left-aligned, that's two containers with two layouts — each with its own alignment settings.",
        ],
        code: `layout.FillDirection = Enum.FillDirection.Vertical
layout.Padding = UDim.new(0, 12)
layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
layout.VerticalAlignment = Enum.VerticalAlignment.Top`,
        tip: "Pair UIListLayout with a UIPadding on the same container to inset the whole stack from the panel's edges — spacing that applies to the group, not to each child.",
      },
      {
        heading: "3. Control order with LayoutOrder",
        paragraphs: [
          "By default a UIListLayout sorts children by LayoutOrder, breaking ties by Name — which is why renaming elements sometimes changes your menu. The robust pattern is to set SortOrder explicitly to Enum.SortOrder.LayoutOrder and give every child an explicit LayoutOrder number. Lower numbers come first, negatives are allowed, and gaps in the sequence don't matter — number your rows 10, 20, 30 and you can slot a new row at 15 later without renumbering anything.",
          "SortOrder.Name is the other option: children sort alphabetically by their Name property. It's convenient for generated lists whose names already encode the order, but LayoutOrder survives renames and reads as intent in code.",
        ],
        code: `layout.SortOrder = Enum.SortOrder.LayoutOrder

musicRow.LayoutOrder = 10
graphicsRow.LayoutOrder = 20
controlsRow.LayoutOrder = 30
-- insert a new "Account" row between them later, no renumbering:
accountRow.LayoutOrder = 15`,
        tip: "If your list reorders itself when you rename an element in Studio, a LayoutOrder tie broken by Name (or SortOrder.Name) is why — give each child a unique LayoutOrder.",
      },
      {
        heading: "4. Auto-size containers with AbsoluteContentSize",
        paragraphs: [
          "A UIListLayout always knows how much space its stack needs, and exposes it as the read-only AbsoluteContentSize property: a Vector2 where Y is the total height of a vertical list (every child's height plus the Padding gaps) and X is the total width of a horizontal one. Because it updates whenever children are added, removed or resized, it's the key to containers that grow to fit their contents — leaderboards, settings menus, quest logs.",
          "Two patterns use it. On a plain Frame, listen to the layout's AbsoluteContentSize change signal and set the frame's height to match. On a ScrollingFrame, drive CanvasSize the same way so the scrollable area is always exactly as tall as the stack — no guessing, no overflow.",
          "One timing detail: the signal fires after the layout pass, so set the size once up front too — otherwise the first frame renders with your placeholder height. That single visible frame is exactly the flash-of-wrong-size bug people report with auto-sized panels.",
        ],
        code: `layout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
	-- grow a plain panel to fit its rows:
	panel.Size = UDim2.new(panel.Size.X.Scale, panel.Size.X.Offset, 0, layout.AbsoluteContentSize.Y)
	-- or size a ScrollingFrame's canvas to the stack:
	scroll.CanvasSize = UDim2.new(0, 0, 0, layout.AbsoluteContentSize.Y)
end)`,
        tip: "On modern Roblox you can often skip the manual binding: set the container's AutomaticSize to Enum.AutomaticSize.Y and it grows to fit the layout's contents on its own.",
      },
      {
        heading: "5. Position override: when UIListLayout ignores Position",
        paragraphs: [
          "The moment a UIListLayout controls a container, it owns its children's Position — whatever you set is overwritten on the next layout pass. That's the number-one source of \"my Position isn't working\" questions: the property is fine, the layout is winning. AnchorPoint still applies to each child inside the slot the layout gave it, and ZIndex is untouched, but a direct child of the container can never break out of the stack.",
          "The escape hatch is nesting. Wrap the element you want to position freely in an intermediate Frame, and give that wrapper a LayoutOrder so it takes a normal slot in the stack. The layout arranges the wrapper — and inside the wrapper, which has no layout of its own, Position works exactly as usual. This is how you put a close button overlapping a title row, or a notification badge pinned to the corner of a list entry.",
        ],
        code: `-- the layout arranges \`header\`, so position freely INSIDE it:
local header = Instance.new("Frame")
header.Size = UDim2.new(1, 0, 0, 40)
header.LayoutOrder = 1
header.Parent = panel

local close = Instance.new("TextButton")
close.AnchorPoint = Vector2.new(1, 0.5)
close.Position = UDim2.new(1, -6, 0.5, 0) -- pinned to the row's right edge
close.Size = UDim2.fromOffset(28, 28)
close.Text = "X"
close.Parent = header`,
        tip: "Decorators like UICorner, UIStroke and UIPadding aren't laid out — only visible GuiObjects occupy slots — so they can stay direct children of the container.",
      },
      {
        heading: "6. Complete example: a settings menu",
        paragraphs: [
          "Everything above in one runnable LocalScript: a centered panel, UIPadding for breathing room, a UIListLayout with explicit LayoutOrder sorting, a title, and three rows generated by a helper. Put it in StarterGui as a LocalScript and it runs as-is.",
          "Because the rows are numbered 10, 20, 30, you can add a fourth row later with any LayoutOrder between them and the menu absorbs it without touching existing code. And since each row comes from the same helper, they stay pixel-identical — which is the whole point of letting a layout own the positioning.",
          "From here, wiring the buttons is ordinary Activated code — toggles, tweens and the rest are covered in the GUI scripting guide.",
        ],
        code: `local screenGui = Instance.new("ScreenGui")
screenGui.ResetOnSpawn = false
screenGui.Parent = script.Parent

local panel = Instance.new("Frame")
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.Size = UDim2.fromScale(0.32, 0.42)
panel.BackgroundColor3 = Color3.fromRGB(28, 32, 44)
panel.Parent = screenGui

local pad = Instance.new("UIPadding")
pad.PaddingTop = UDim.new(0, 16)
pad.PaddingBottom = UDim.new(0, 16)
pad.PaddingLeft = UDim.new(0, 16)
pad.PaddingRight = UDim.new(0, 16)
pad.Parent = panel

local layout = Instance.new("UIListLayout")
layout.SortOrder = Enum.SortOrder.LayoutOrder
layout.Padding = UDim.new(0, 10)
layout.HorizontalAlignment = Enum.HorizontalAlignment.Center
layout.Parent = panel

local title = Instance.new("TextLabel")
title.LayoutOrder = 1
title.Size = UDim2.new(1, 0, 0, 32)
title.BackgroundTransparency = 1
title.Font = Enum.Font.GothamBold
title.TextSize = 22
title.TextColor3 = Color3.new(1, 1, 1)
title.Text = "Settings"
title.Parent = panel

local function row(order: number, text: string)
	local button = Instance.new("TextButton")
	button.LayoutOrder = order
	button.Size = UDim2.new(1, 0, 0, 44)
	button.BackgroundColor3 = Color3.fromRGB(41, 47, 63)
	button.Font = Enum.Font.Gotham
	button.TextSize = 16
	button.TextColor3 = Color3.new(1, 1, 1)
	button.Text = text
	button.Parent = panel
	return button
end

row(10, "Music: ON")
row(20, "Graphics: Auto")
row(30, "Rejoin server")`,
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
      {
        q: "What is AbsoluteContentSize on a UIListLayout?",
        a: "A read-only Vector2 telling you the total size the laid-out children occupy: for a vertical list, Y is the full stack height (children plus Padding gaps). Listen with GetPropertyChangedSignal(\"AbsoluteContentSize\") and use it to auto-size a Frame or a ScrollingFrame's CanvasSize.",
      },
      {
        q: "Why does UIListLayout ignore my child's Position?",
        a: "Because the layout controls Position for every direct child of its container. To position one element freely, wrap it in a Frame, give the wrapper a LayoutOrder so it slots into the stack, and set Position on the element inside the wrapper.",
      },
      {
        q: "How do I change the order of children at runtime?",
        a: "Set the child's LayoutOrder property — the list re-sorts immediately, no rebuild needed. With SortOrder.LayoutOrder this is the supported way to move rows around, e.g. re-ranking a leaderboard after every score change.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
      { slug: "how-to-make-a-roblox-inventory-gui", title: "How to Make a Roblox Inventory GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-global-leaderboard-gui",
    metaTitle: "How to Make a Roblox Global Leaderboard GUI",
    title: "How to Make a Roblox Global Leaderboard GUI",
    description:
      "How to make a cross-server Roblox global leaderboard GUI using OrderedDataStore, GetNameFromUserIdAsync caching, SurfaceGui or ScreenGui rows, and UIListLayout.",
    category: "Data",
    relatedTemplate: "leaderboard",
    intro:
      "A global leaderboard ranks players across every server by total coins, wins, or rebirths and updates automatically as records change. While UIListLayout makes stacking rank rows easy, the real challenge is respecting OrderedDataStore rate limits and caching usernames so your game never throttles. Here is the complete server and client implementation.",
    sections: [
      {
        heading: "1. Store integer scores by UserId inside OrderedDataStore",
        paragraphs: [
          "An OrderedDataStore only accepts positive integers and automatically indexes them for fast sorting. Always key entries by tostring(player.UserId) rather than Username so players never create duplicate entries when changing display names or usernames. Use UpdateAsync with math.max so stale servers cannot overwrite higher scores.",
        ],
        code: `-- Script in ServerScriptService
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local scoreStore = DataStoreService:GetOrderedDataStore("CoinsLeaderboard_v1")
local leaderboardRemote = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("LeaderboardUpdate") :: RemoteEvent

local function saveScore(player: Player, coins: number)
	local rounded = math.max(0, math.floor(coins))
	pcall(function()
		scoreStore:UpdateAsync(tostring(player.UserId), function(old)
			return math.max(old or 0, rounded)
		end)
	end)
end`,
      },
      {
        heading: "2. Fetch top N players on a 60-second timer and cache usernames",
        paragraphs: [
          "Call GetSortedAsync(false, 10) for descending top-10 rankings. OrderedDataStore only stores keys and numbers, so resolve readable names with Players:GetNameFromUserIdAsync(userId) wrapped in pcall — and cache resolved names in a lookup table so you do not hammer Roblox web APIs every minute.",
        ],
        code: `local nameCache: { [number]: string } = {}

local function resolveName(userId: number): string
	if nameCache[userId] then
		return nameCache[userId]
	end
	local ok, result = pcall(function()
		return Players:GetNameFromUserIdAsync(userId)
	end)
	local username = (ok and result) or ("Player_" .. userId)
	nameCache[userId] = username
	return username
end

local cachedTop: { { rank: number, name: string, score: number } } = {}

local function refreshLeaderboard()
	local ok, pages = pcall(function()
		return scoreStore:GetSortedAsync(false, 10)
	end)
	if not ok or not pages then return end

	local nextList = {}
	for rank, entry in ipairs(pages:GetCurrentPage()) do
		local userId = tonumber(entry.key) or 0
		table.insert(nextList, {
			rank = rank,
			name = resolveName(userId),
			score = entry.value,
		})
	end
	cachedTop = nextList
	leaderboardRemote:FireAllClients(cachedTop)
end`,
        tip: "Immediately call leaderboardRemote:FireClient(player, cachedTop) inside Players.PlayerAdded so joining players see the board right away instead of waiting up to 60 seconds for the next tick.",
      },
      {
        heading: "3. Render ranked rows inside UIListLayout without destroying layout constraints",
        paragraphs: [
          "When LeaderboardUpdate fires on the client, destroy existing row Frames (checking child:IsA(\"Frame\") so you preserve the UIListLayout and UIPadding), then clone a styled RowTemplate per rank. Highlight rank #1–#3 with gold, silver, and bronze accents.",
        ],
        code: `-- LocalScript inside LeaderboardGui
local container = script.Parent:WaitForChild("Panel"):WaitForChild("Rows") :: ScrollingFrame
local rowTemplate = script:WaitForChild("RowTemplate") :: Frame

leaderboardRemote.OnClientEvent:Connect(function(rows)
	for _, child in ipairs(container:GetChildren()) do
		if child:IsA("GuiObject") then
			child:Destroy()
		end
	end

	for _, item in ipairs(rows) do
		local row = rowTemplate:Clone()
		row.LayoutOrder = item.rank
		row:WaitForChild("RankLabel").Text = "#" .. item.rank
		row:WaitForChild("NameLabel").Text = item.name
		row:WaitForChild("ScoreLabel").Text = tostring(item.score)
		row.Parent = container
	end
end)`,
      },
      {
        heading: "4. Reuse the exact same layout in a lobby SurfaceGui",
        paragraphs: [
          "If you want a physical leaderboard wall inside your spawn lobby as well as a HUD modal, drop the exact same Panel frame into a SurfaceGui parented to a Part in Workspace and set PixelsPerStud to 50 for sharp text.",
        ],
      },
    ],
    faq: [
      {
        q: "How often should I refresh a Roblox global leaderboard?",
        a: "Every 45 to 60 seconds in a server loop. OrderedDataStore shares strict per-minute request budgets; refreshing on every coin pickup will hit throttle errors.",
      },
      {
        q: "Why does the same player appear twice on my leaderboard?",
        a: "You are likely keying OrderedDataStore by Username instead of tostring(player.UserId), or testing with multiple accounts. Always key by UserId.",
      },
      {
        q: "How do I show shortened numbers like 1.5M while keeping sorting accurate?",
        a: "Store the full raw integer inside OrderedDataStore so sorting stays exact, then format item.score into \"1.5M\" on the client right before assigning ScoreLabel.Text.",
      },
      {
        q: "Can a LocalScript read OrderedDataStore directly?",
        a: "No. DataStoreService only runs on the server inside ServerScriptService. Always fetch rankings on the server and push the sanitized array to clients via RemoteEvent.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
      { slug: "roblox-gui-code-structure", title: "Roblox GUI Code Explained: Instance.new, UDim2 & Parenting" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "How to Use UIListLayout in Roblox" },
    ],
  },
  {
    slug: "how-to-animate-roblox-guis-with-tweenservice",
    metaTitle: "How to Animate Roblox GUIs with TweenService",
    metaDescription:
      "How to animate Roblox GUIs with TweenService: slide-in panels, CanvasGroup whole-UI fades, UIScale button hover/press bounce, and cancelling overlapping tweens.",
    title: "How to Animate Roblox GUIs with TweenService",
    description:
      "How to animate Roblox GUIs cleanly with TweenService: slide-in panels, CanvasGroup whole-UI fades, UIScale button hover/press bounce, and cancelling overlapping tweens.",
    category: "Animation",
    relatedTemplate: "main-menu",
    intro:
      "Smooth animations separate polished front-page games from rigid starter interfaces. Using TweenService alongside CanvasGroup and UIScale lets you fade entire menus cleanly, animate button hover feedback inside UIListLayout containers without layout jitter, and prevent glitchy overlap when players spam clicks.",
    sections: [
      {
        heading: "1. Slide a panel in cleanly using Quint or Back easing",
        paragraphs: [
          "Position closed panels just off-screen (for example UDim2.fromScale(0.5, 1.35)), then animate to center (0.5, 0.5) using TweenInfo.new(0.32, Enum.EasingStyle.Quint, Enum.EasingDirection.Out). Use Quint or Quad for clean sci-fi/simulator menus, and Back when you want subtle playful overshoot.",
        ],
        code: `local TweenService = game:GetService("TweenService")
local activeTween: Tween? = nil

local function slidePanel(panel: GuiObject, open: boolean)
	if activeTween then
		activeTween:Cancel()
	end
	local target = open and UDim2.fromScale(0.5, 0.5) or UDim2.fromScale(0.5, 1.4)
	local info = TweenInfo.new(0.32, Enum.EasingStyle.Quint, Enum.EasingDirection.Out)
	activeTween = TweenService:Create(panel, info, { Position = target })
	activeTween:Play()
end`,
      },
      {
        heading: "2. Fade entire menus smoothly with CanvasGroup",
        paragraphs: [
          "Tweening BackgroundTransparency and TextTransparency across twenty nested labels makes overlapping layers bleed through each other. Wrap your modal inside a CanvasGroup and tween GroupTransparency between 1 and 0 so the entire window fades as a single unified layer.",
        ],
        code: `local function setModalFade(group: CanvasGroup, gui: ScreenGui, open: boolean)
	if open then
		group.GroupTransparency = 1
		gui.Enabled = true
	end
	local goal = open and 0 or 1
	local tween = TweenService:Create(group, TweenInfo.new(0.22, Enum.EasingStyle.Quad), {
		GroupTransparency = goal,
	})
	tween.Completed:Connect(function()
		if not open and group.GroupTransparency == 1 then
			gui.Enabled = false
		end
	end)
	tween:Play()
end`,
        tip: "Set gui.Enabled = false once GroupTransparency reaches 1 so Roblox stops caching the off-screen CanvasGroup texture and releases input focus.",
      },
      {
        heading: "3. Animate button hover & press without breaking UIListLayout",
        paragraphs: [
          "Never tween a button's Size directly if it lives inside a UIListLayout or UIGridLayout — sibling buttons will jump sideways on every frame. Instead, parent a UIScale inside the button and tween UIScale.Scale (1.05 on hover, 0.95 on press, 1.0 on release).",
        ],
        code: `local function attachButtonJuice(button: GuiButton)
	local uiScale = button:FindFirstChildOfClass("UIScale") or Instance.new("UIScale", button)
	local info = TweenInfo.new(0.12, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

	button.MouseEnter:Connect(function()
		TweenService:Create(uiScale, info, { Scale = 1.05 }):Play()
	end)
	button.MouseLeave:Connect(function()
		TweenService:Create(uiScale, info, { Scale = 1 }):Play()
	end)
	button.MouseButton1Down:Connect(function()
		TweenService:Create(uiScale, info, { Scale = 0.95 }):Play()
	end)
	button.Activated:Connect(function()
		TweenService:Create(uiScale, info, { Scale = 1.05 }):Play()
	end)
end`,
      },
      {
        heading: "4. Cancel stale tweens and avoid rapid-toggle bugs",
        paragraphs: [
          "Always store a reference to the active Tween for a panel and call :Cancel() before creating the reverse animation. Guard Completed callbacks with a final state check so a canceled close tween never shuts off a panel the player just reopened.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I tween BackgroundColor3, TextColor3, and Rotation too?",
        a: "Yes — TweenService interpolates UDim2, Vector2, number properties like Rotation/Transparency, and Color3 values inside the same goal dictionary.",
      },
      {
        q: "Why do nearby buttons jump around when I tween a button's Size inside a menu?",
        a: "UIListLayout and UIGridLayout reflow neighbors whenever a child's Size changes. Parent a UIScale object inside the button and tween UIScale.Scale instead.",
      },
      {
        q: "How do I make a Roblox GUI animation loop forever?",
        a: "Pass RepeatCount = -1 and Reverses = true to TweenInfo.new(duration, style, direction, -1, true). Calling :Play() once repeats back and forth continuously.",
      },
      {
        q: "Why does my GUI suddenly vanish right after reopening it quickly?",
        a: "An earlier close tween's Completed event fired and set Enabled = false or Visible = false. Always cancel the previous tween before playing a new one and check the current open state inside Completed.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
      { slug: "how-to-design-polished-roblox-ui", title: "How to Design Polished Roblox UI (Gradients, Strokes & Depth)" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
    ],
  },
  {
    slug: "how-to-make-a-draggable-roblox-gui",
    metaDescription:
      "How to make a smooth draggable Roblox GUI window on PC and mobile: UserInputService title-bar drag script, grab-offset fix, viewport clamping, UIDragDetector.",
    title: "How to Make a Draggable Roblox GUI",
    description:
      "How to make a smooth draggable Roblox GUI window on PC and mobile: UserInputService title-bar drag script, grab-offset fix, screen viewport clamping, and UIDragDetector note.",
    category: "Interaction",
    intro:
      "Roblox's legacy Frame.Draggable property is deprecated and breaks unpredictably on touch devices and nested layouts. The reliable cross-platform method tracks pointer start, cursor delta, and release via UserInputService on a dedicated title bar while clamping coordinates so players never drag windows off-screen.",
    sections: [
      {
        heading: "1. Attach the drag trigger to a title bar, not the full panel",
        paragraphs: [
          "If you capture dragging across the entire window Frame, players miss clicks on buttons, sliders, and ScrollingFrames inside it. Put a slim TitleBar Frame at the top (or add a DragHandle button) and start dragging only on InputBegan there.",
        ],
        code: `-- LocalScript inside the ScreenGui
local UserInputService = game:GetService("UserInputService")
local frame = script.Parent:WaitForChild("Window") :: Frame
local titleBar = frame:WaitForChild("TitleBar") :: Frame

local dragging = false
local dragStart = Vector2.zero
local startPos = frame.Position`,
      },
      {
        heading: "2. Preserve the grab offset on mouse and touch",
        paragraphs: [
          "Instead of snapping frame.Position straight to input.Position (which makes the top-left corner jump under your cursor), save both dragStart and startPos when the pointer presses down, then add delta = input.Position - dragStart during InputChanged.",
        ],
        code: `titleBar.InputBegan:Connect(function(input: InputObject)
	if input.UserInputType == Enum.UserInputType.MouseButton1
		or input.UserInputType == Enum.UserInputType.Touch then
		dragging = true
		dragStart = Vector2.new(input.Position.X, input.Position.Y)
		startPos = frame.Position
	end
end)`,
      },
      {
        heading: "3. Clamp position inside the screen viewport",
        paragraphs: [
          "Without clamping, players can fling your Settings or Inventory window completely off the viewport edge where the title bar can never be clicked again. Clamp the computed pixel offset against workspace.CurrentCamera.ViewportSize and reset dragging on global UserInputService.InputEnded.",
        ],
        code: `local function clampPosition(pos: UDim2): UDim2
	local viewport = workspace.CurrentCamera and workspace.CurrentCamera.ViewportSize
	if not viewport then return pos end
	local absSize = frame.AbsoluteSize
	local anchorOffset = frame.AnchorPoint * absSize

	local targetX = pos.X.Scale * viewport.X + pos.X.Offset
	local targetY = pos.Y.Scale * viewport.Y + pos.Y.Offset
	local clampedX = math.clamp(targetX, anchorOffset.X, viewport.X - absSize.X + anchorOffset.X)
	local clampedY = math.clamp(targetY, anchorOffset.Y, viewport.Y - absSize.Y + anchorOffset.Y)

	return UDim2.fromOffset(clampedX, clampedY)
end

UserInputService.InputChanged:Connect(function(input: InputObject)
	if not dragging then return end
	if input.UserInputType == Enum.UserInputType.MouseMovement
		or input.UserInputType == Enum.UserInputType.Touch then
		local delta = Vector2.new(input.Position.X, input.Position.Y) - dragStart
		local rawPos = UDim2.new(
			startPos.X.Scale, startPos.X.Offset + delta.X,
			startPos.Y.Scale, startPos.Y.Offset + delta.Y
		)
		frame.Position = clampPosition(rawPos)
	end
end)

UserInputService.InputEnded:Connect(function(input: InputObject)
	if input.UserInputType == Enum.UserInputType.MouseButton1
		or input.UserInputType == Enum.UserInputType.Touch then
		dragging = false
	end
end)`,
        tip: "Listen to UserInputService.InputEnded globally rather than titleBar.InputEnded, because fast cursor sweeps frequently release outside the title bar bounds.",
      },
      {
        heading: "4. Alternative: Studio's built-in UIDragDetector",
        paragraphs: [
          "For quick windows with no custom snapping or tween inertia, you can insert a UIDragDetector directly inside your Frame and point BoundingUI to an outer screen bounds Frame — zero Luau needed. Keep the UserInputService script above whenever you want saveable window positions or toggleable drag permissions.",
        ],
      },
    ],
    faq: [
      {
        q: "Why shouldn't I use Frame.Draggable = true anymore?",
        a: "Frame.Draggable has been deprecated by Roblox for years: it fails on many Scale/AnchorPoint combinations, glitches with touchscreens, and does not keep windows inside viewport boundaries.",
      },
      {
        q: "Why does the GUI jump to the cursor corner as soon as I click it?",
        a: "Setting frame.Position directly to the pointer coordinates discards where on the title bar you clicked. Store dragStart and startPos on InputBegan and add the movement delta instead.",
      },
      {
        q: "Does this draggable script work on mobile and tablets?",
        a: "Yes — checking Enum.UserInputType.Touch alongside MouseButton1 and MouseMovement supports mobile touchscreens cleanly.",
      },
      {
        q: "Should I use UIDragDetector or a UserInputService script?",
        a: "UIDragDetector is fastest if you only need simple constrained dragging with zero code. Choose UserInputService when you want snap grids, edge bounds callbacks, or persistence across spawns.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "How to Open a GUI with a Key Press in Roblox" },
      { slug: "how-to-make-a-responsive-roblox-gui", title: "How to Make a Responsive Roblox GUI" },
    ],
  },
  {
    slug: "how-to-make-a-responsive-roblox-gui",
    metaDescription:
      "How to scale Roblox GUIs on PC, phone, tablet and 4K screens: Scale vs Offset UDim2, AnchorPoint, UIAspectRatioConstraint, UITextSizeConstraint and UIScale.",
    title: "How to Make a Responsive Roblox GUI",
    description:
      "How to scale Roblox GUIs accurately on PC, phone, tablet, and 4K screens: Scale vs Offset UDim2, AnchorPoint centering, UIAspectRatioConstraint, UITextSizeConstraint, and UIScale.",
    category: "Layouts",
    relatedTemplate: "main-menu",
    intro:
      "More than half of Roblox players join from phones and tablets, while the rest play on laptops, 4K monitors, or TVs. If you design strictly with pixel Offsets, your interface looks crisp on your Studio screen and broken everywhere else. Adopting these five layout constraints keeps every menu and HUD proportional across all aspect ratios.",
    sections: [
      {
        heading: "1. Size and position containers with Scale, reserve Offset for micro-padding",
        paragraphs: [
          "Every UDim2 holds Scale (fraction of parent width or height) and Offset (fixed screen pixels). Build all major panels, HUD corners, and button widths using UDim2.fromScale(...) so they expand and contract smoothly across viewports, and save small pixel Offsets only for rounded corners, UIPadding, or 1–2px strokes.",
        ],
        code: `-- Responsive centered panel: 42% wide, 58% tall
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.Size = UDim2.fromScale(0.42, 0.58)

-- Avoid fixed pixels for main frames: cuts off on phones
-- panel.Size = UDim2.fromOffset(640, 480)`,
      },
      {
        heading: "2. Lock edges and screen centers using AnchorPoint",
        paragraphs: [
          "AnchorPoint defines which point on your Frame attaches to Position. Use (0.5, 0.5) for centered popups, (1, 1) with Position (0.98, 0.96) for bottom-right action clusters, and (0.5, 1) with Position (0.5, 0.97) for bottom hotbars so resizing the window never pushes elements off the edge.",
        ],
      },
      {
        heading: "3. Preserve card and icon shapes with UIAspectRatioConstraint",
        paragraphs: [
          "Pure Scale looks stretched on narrow phones or ultrawide monitors — a square shop slot turns into a thin tall strip. Add a UIAspectRatioConstraint (AspectRatio = 1 for square inventory slots or 1.6 for landscape windows) plus a UISizeConstraint (MinSize) so small phone buttons never shrink below tappable fingertip size.",
        ],
        code: `local aspect = Instance.new("UIAspectRatioConstraint")
aspect.AspectRatio = 1.6
aspect.DominantAxis = Enum.DominantAxis.Width
aspect.Parent = panel

local limits = Instance.new("UISizeConstraint")
limits.MinSize = Vector2.new(280, 180)
limits.MaxSize = Vector2.new(760, 520)
limits.Parent = panel`,
      },
      {
        heading: "4. Cap scaled typography with UITextSizeConstraint and shrink HUDs via UIScale",
        paragraphs: [
          "Setting TextScaled = true makes labels adapt to small boxes, yet blows headlines up huge on 4K displays. Parent a UITextSizeConstraint with MinTextSize = 11 and MaxTextSize = 24 so typography stays balanced. For dense corner HUDs, attach a single UIScale under the ScreenGui and drop Scale to 0.8 on phone viewports.",
        ],
        code: `label.TextScaled = true
local textCap = Instance.new("UITextSizeConstraint")
textCap.MinTextSize = 11
textCap.MaxTextSize = 24
textCap.Parent = label`,
        tip: "Always test every ScreenGui inside Roblox Studio's Test -> Device Emulator (iPhone, iPad, 1080p, 4K) AND inside Roblox GUI Maker's Desktop/Tablet/Mobile switcher before shipping.",
      },
    ],
    faq: [
      {
        q: "Why does my Roblox GUI look huge or cut off on mobile phones?",
        a: "Your panel Sizes or Positions likely use Offset (fixed pixels) instead of Scale (screen fractions), or lack UIAspectRatioConstraint / UISizeConstraint bounds.",
      },
      {
        q: "Where do I preview mobile and console screen sizes inside Roblox Studio?",
        a: "Go to Test -> Device (the Device Emulator button) in Roblox Studio to switch between iPhone, iPad, Xbox, 1080p, and custom aspect ratios interactively.",
      },
      {
        q: "How do I shrink an entire HUD uniformly for mobile players?",
        a: "Parent a UIScale directly under your HUD ScreenGui and set UIScale.Scale (for example 0.8 when Workspace.CurrentCamera.ViewportSize.X < 800) instead of resizing dozens of Frames individually.",
      },
      {
        q: "How do I stop buttons inside a UIListLayout from having uneven text sizes?",
        a: "When TextScaled = true, shorter words scale larger than longer labels. Add a UITextSizeConstraint with the same MaxTextSize to every button, or set explicit FontSize / TextSize with AutomaticSize.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "How to Make a GUI in Roblox" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "How to Use UIListLayout in Roblox" },
      { slug: "how-to-design-polished-roblox-ui", title: "How to Design Polished Roblox UI (Gradients, Strokes & Depth)" },
    ],
  },
  {
    slug: "roblox-gui-script-generator",
    metaDescription:
      "Use a visual Roblox GUI script generator to build responsive interfaces, preview interactions and export client Luau, server handlers, JSON or a ZIP project.",
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
    metaDescription:
      "Learn how to make a GUI in Roblox: plan the player task, build a ScreenGui hierarchy, make responsive layouts, wire buttons, preview states and test in Studio.",
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
    metaTitle: "Roblox UI Design — Layout, Color, and Sizing Guide",
    metaDescription:
      "Roblox UI design fundamentals: UDim2 sizing, AnchorPoint alignment, color palettes, font pairing, UIListLayout spacing and responsive mobile/desktop patterns.",
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
    metaTitle: "Roblox GUI Code Explained: Instance.new, UDim2 and Parenting",
    metaDescription:
      "How Roblox GUI Luau is structured: each element is an Instance.new, positioned with UDim2 scale and parented into a tree, plus button handlers. Copy-paste Luau.",
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
  {
    slug: "how-to-script-a-roblox-gui",
    metaTitle: "How to Script a Roblox GUI (Clicks, Toggles and Tweens)",
    metaDescription:
      "Roblox GUI scripting for beginners: where LocalScripts live, TextButton clicks, toggling visibility and animating panels with TweenService. Copy-paste Luau.",
    title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)",
    description:
      "GUI scripting in Roblox explained for beginners: where LocalScripts live, connecting TextButton clicks, toggling visibility, and animating panels with TweenService — with copy-paste Luau.",
    category: "Scripting",
    relatedTemplate: "settings",
    intro:
      "Building the frames is half of a Roblox GUI — the other half is scripting: making the close button actually close, the shop toggle open and shut, and the panel slide in instead of popping. This guide covers the four pieces of Luau that almost every GUI script needs: a LocalScript under StarterGui, a connected button, a visibility toggle, and a TweenService animation. Every snippet is complete and paste-ready.",
    sections: [
      {
        heading: "1. Where GUI scripts go: LocalScript under StarterGui",
        paragraphs: [
          "A GUI that each player sees for themselves is client-side. Put a LocalScript inside StarterGui (or inside the ScreenGui itself) and Roblox clones it into every player's PlayerGui when they join. Regular Scripts — the server kind — do not run inside PlayerGui.",
          "If your GUI was built in Studio, the script can reach it through the player object. If you are creating the GUI from code instead, the script can build every Instance itself — the approach the exported code from this editor uses.",
        ],
        code: `-- LocalScript under StarterGui
local player = game:GetService("Players").LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "SettingsGui"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui`,
        tip: "Set ResetOnSpawn = false on any menu or shop GUI, or it will disappear and rebuild every time the player respawns.",
      },
      {
        heading: "2. Connect a button click (the pattern behind every button)",
        paragraphs: [
          "Every interactive GUI element is wired the same way: get a reference to the instance, connect a function to its Activated event (works for mouse and touch), and do the work inside that function. Activated is preferred over MouseButton1Click because it also fires on mobile taps.",
        ],
        code: `local button = screenGui:WaitForChild("Panel"):WaitForChild("CloseButton")

button.Activated:Connect(function()
    screenGui.Enabled = false
end)`,
        tip: "If nothing happens when you click, print something inside the connect function. No output in the console means the path or the event name is wrong — nine times out of ten it is a typo'd Name in WaitForChild.",
      },
      {
        heading: "3. Toggle a GUI open and closed with one button",
        paragraphs: [
          "Shops and settings panels usually open from a HUD button and close from an X. The clean way is to flip ScreenGui.Enabled — when it is false, Roblox stops rendering the whole tree, so you get hiding for free.",
        ],
        code: `local toggleButton = playerGui:WaitForChild("Hud"):WaitForChild("OpenShop")
local shopGui = playerGui:WaitForChild("ShopGui")

toggleButton.Activated:Connect(function()
    shopGui.Enabled = not shopGui.Enabled
end)`,
      },
      {
        heading: "4. Animate the panel with TweenService",
        paragraphs: [
          "A GUI that fades or slides in feels dramatically more polished, and TweenService does it in a few lines. Create a Tween with a target property table, a time, and an easing style, then :Play() it. Position tweens interpolate UDim2 values directly.",
        ],
        code: `local TweenService = game:GetService("TweenService")

local panel = screenGui:WaitForChild("Panel")
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.Position = UDim2.fromScale(0.5, 0.6) -- start slightly low

local open = TweenService:Create(
    panel,
    TweenInfo.new(0.25, Enum.EasingStyle.Quint, Enum.EasingDirection.Out),
    { Position = UDim2.fromScale(0.5, 0.5) }
)

open:Play()`,
        tip: "For a fade instead of a slide, tween a NumberValue and map it to GroupTransparency on a CanvasGroup — tweening TextTransparency per label is the slow path.",
      },
      {
        heading: "5. The one rule about client and server",
        paragraphs: [
          "Clicks happen on the client, but anything the game must enforce — currency, purchases, item grants, permissions — happens on the server. The pattern: the LocalScript fires a RemoteEvent, and a Script in ServerScriptService listens, validates, and applies the result.",
          "If you can describe the change as purely visual (opening a panel, highlighting a tab), it can stay client-side forever.",
        ],
      },
      {
        heading: "6. Script it here, or script it there",
        paragraphs: [
          "The visual editor generates exactly this shape of code: a LocalScript that builds the hierarchy under a ScreenGui and wires Activated handlers for visibility actions, plus an optional server Script for Fire RemoteEvent actions. Build the layout visually, export, and read the generated Luau alongside this guide — the structure will match section for section.",
        ],
      },
    ],
    faq: [
      {
        q: "Why won't my GUI button do anything when I click it?",
        a: "Three usual causes: the script is a regular Script instead of a LocalScript (Scripts don't run in PlayerGui), the WaitForChild path doesn't match the actual Name of the button, or the connection was made before the instance existed. Add a print inside the handler to see which one it is.",
      },
      {
        q: "Should I use MouseButton1Click or Activated?",
        a: "Activated. It fires for mouse clicks and touch taps alike, while MouseButton1Click is mouse-oriented. Both live on GuiButton (TextButton, ImageButton).",
      },
      {
        q: "How do I close a GUI when the player presses a key?",
        a: "Connect UserInputService.InputBegan, check input.KeyCode, and flip ScreenGui.Enabled — the companion guide 'How to Open a GUI with a Key Press in Roblox' covers it with full code, including the gameProcessedEvent guard.",
      },
      {
        q: "Can a LocalScript create the whole GUI from code?",
        a: "Yes — Instance.new every element, set properties, and parent bottom-up. That is exactly what the Luau exported from this editor does, which keeps the GUI reproducible from one file.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "How to Make a GUI in Roblox" },
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "How to Open a GUI with a Key Press in Roblox" },
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "How to Animate Roblox GUIs with TweenService" },
    ],
  },
  {
    slug: "how-to-open-a-gui-with-a-key-in-roblox",
    metaTitle: "How to Open a GUI with a Key Press in Roblox",
    metaDescription:
      "Bind a key like M or B to open a Roblox GUI: UserInputService.InputBegan toggling, the gameProcessedEvent guard, and gamepad support via ContextActionService.",
    title: "How to Open a GUI with a Key Press in Roblox",
    description:
      "Bind a key like M or B to open a Roblox GUI: UserInputService.InputBegan toggling, the gameProcessedEvent guard against double-fires, and gamepad support with ContextActionService.",
    category: "Scripting",
    relatedTemplate: "main-menu",
    intro:
      "Press M for a map, B for a backpack, Tab for a leaderboard — key-press toggles are one of the most-asked GUI questions in Roblox. The mechanism is a single UserInputService event, but two details trip everyone up: the event also fires while the player is typing in a TextBox, and the toggle can end up on both client and server. This guide shows the full pattern done right, plus the gamepad-friendly variant.",
    sections: [
      {
        heading: "1. The core: UserInputService.InputBegan",
        paragraphs: [
          "UserInputService fires InputBegan for every key, tap, and button press on the client. Listen for it in a LocalScript, compare input.KeyCode to the key you want, and toggle the ScreenGui's Enabled property. That is the whole mechanism.",
        ],
        code: `-- LocalScript under StarterGui
local UserInputService = game:GetService("UserInputService")

local player = game:GetService("Players").LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local menuGui = playerGui:WaitForChild("MenuGui")

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.M then
        menuGui.Enabled = not menuGui.Enabled
    end
end)`,
        tip: "gameProcessed is true when Roblox already consumed the input — the player is typing in a chat box or TextBox. Returning early there is what stops your menu from opening mid-sentence.",
      },
      {
        heading: "2. Which keys are safe to bind",
        paragraphs: [
          "Avoid keys Roblox or common games already own: W A S D and the arrows (movement), slash (chat), Escape (Roblox menu), and Enter. Letters like M, B, I, G, and K, plus Tab and Q, are popular and conflict-free choices. F-keys and Return often collide with platform UI.",
          "Enum.KeyCode lists every bindable key and gamepad button — you can also bind Enum.KeyCode.ButtonX for controller users with the same InputBegan code.",
        ],
      },
      {
        heading: "3. Show and hide with a transition",
        paragraphs: [
          "Flipping Enabled is instant. If you want the menu to fade or slide, keep the GUI enabled and tween a property instead — a CanvasGroup's GroupTransparency for fades, or the panel's Position for a slide — then disable it after the close tween finishes.",
        ],
        code: `local TweenService = game:GetService("TweenService")

local function openMenu()
    menuGui.Enabled = true
    local panel = menuGui:WaitForChild("Panel")
    TweenService:Create(
        panel,
        TweenInfo.new(0.2, Enum.EasingStyle.Quint, Enum.EasingDirection.Out),
        { GroupTransparency = 0 }
    ):Play()
end`,
      },
      {
        heading: "4. Gamepad and mobile players",
        paragraphs: [
          "Keyboards are not the only input. For a bind that works across keyboard and controller with a free on-screen button, use ContextActionService: it maps one action name to several key codes, shows a mobile touch button automatically when you give it a title, and lets you unbind when the GUI closes.",
        ],
        code: `local ContextActionService = game:GetService("ContextActionService")

local function handleOpen(actionName, inputState, input)
    if inputState ~= Enum.UserInputState.Begin then return end
    menuGui.Enabled = not menuGui.Enabled
end

ContextActionService:BindAction("OpenMenu", handleOpen, true, Enum.KeyCode.M, Enum.KeyCode.ButtonSelect)
ContextActionService:SetTitle("OpenMenu", "Menu")`,
        tip: "The third argument to BindAction (true here) is createTouchButton — on phones Roblox shows a labeled round button that triggers the same handler.",
      },
      {
        heading: "5. Keep the toggle client-side",
        paragraphs: [
          "Opening your own menu is a visual change, so it belongs in a LocalScript — no RemoteEvent needed. What crosses to the server is only the consequence: if pressing the key buys something or claims a reward, that button inside the GUI fires a RemoteEvent and the server validates it, exactly like any other button.",
        ],
      },
    ],
    faq: [
      {
        q: "Why does my GUI open when I type the letter in chat?",
        a: "You are missing the gameProcessedEvent guard. The second parameter UserInputService passes your handler is true when Roblox already used the input (chat, TextBox). Start every handler with: if gameProcessed then return end.",
      },
      {
        q: "How do I detect a key press on the server?",
        a: "You don't — input only exists on the client. Detect it in a LocalScript and, if the server must react, fire a RemoteEvent. Never trust the client for rewards or permissions; validate there.",
      },
      {
        q: "What is the difference between UserInputService and ContextActionService?",
        a: "UserInputService reports raw input — one event, you filter the keys. ContextActionService binds named actions to several inputs at once, can create a mobile touch button, and supports priorities and re-binding. For a single key either works; for cross-platform menus ContextActionService is the better fit.",
      },
      {
        q: "Can I let players choose their own keybind?",
        a: "Yes — store the chosen Enum.KeyCode and compare against it instead of hardcoding. To capture the choice, listen for the next InputBegan after the player clicks a 'rebind' button and save input.KeyCode.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-script-a-roblox-gui", title: "How to Script a Roblox GUI (Clicks, Toggles & Tweens)" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
      { slug: "how-to-make-a-draggable-roblox-gui", title: "How to Make a Draggable Roblox GUI" },
    ],
  },
  {
    slug: "how-to-import-rbxmx-into-roblox-studio",
    metaTitle: "How to Import .rbxmx GUI Files into Roblox Studio",
    metaDescription:
      "How to import .rbxmx Roblox XML GUI models into Roblox Studio StarterGui without plugins: Explorer steps, .rbxmx vs .lua comparison, and common UI fixes.",
    title: "How to Import .rbxmx GUI Files into Roblox Studio",
    description:
      "How to import .rbxmx Roblox XML GUI models into Roblox Studio StarterGui without plugins: step-by-step Explorer steps, .rbxmx vs .lua comparison, and common UI fixes.",
    category: "Workflow",
    relatedTemplate: "main-menu",
    customCta: {
      href: "/editor",
      label: "Open the Editor (.lua & .rbxmx export)",
    },
    intro:
      "If you exported or downloaded a .rbxmx XML model file from Roblox GUI Maker or a Studio teammate, importing it puts live ScreenGui, Frame, UIListLayout, and LocalScript instances straight into your Explorer tree with zero manual pasting. Here is the exact workflow for StarterGui, how .rbxmx compares to Instance.new Luau scripts, and how to fix common visibility or inset quirks after import.",
    sections: [
      {
        heading: "1. Choose between .rbxmx XML models and .lua runtime scripts",
        paragraphs: [
          "A .lua GUI script constructs elements at runtime using Instance.new inside PlayerGui, which keeps your workspace clean on disk and works great when syncing code through Rojo or Git. A .rbxmx file stores the serialized Roblox Studio XML hierarchy directly so you can drop finished ScreenGuis into StarterGui, drag panels visually with Studio handles, and inspect every UICorner, UIGradient, and UIStroke in the Properties widget right away.",
        ],
      },
      {
        heading: "2. Insert the .rbxmx file into StarterGui in Roblox Studio",
        paragraphs: [
          "Open your place in Roblox Studio and expand the Explorer panel. Always insert GUI models under StarterGui (not Workspace) so Roblox clones them automatically into every joining player's PlayerGui.",
          "Right-click StarterGui -> choose Insert from File... -> select your .rbxmx model (for example a single screen or a kit's *-complete.rbxmx bundle). Press Play (F5) in Studio to test buttons, tweens, and multi-screen navigation tabs immediately.",
        ],
        code: `-- Expected Explorer structure after Insert from File... into StarterGui:
-- StarterGui
--   └── ScreenGui (e.g. MainMenu or KitName)
--         ├── MainFrame (Frame / UIListLayout / UICorner)
--         ├── UIController (LocalScript — handles clicks & tweens)
--         └── KitScreenSwitcher (LocalScript — included in complete 5-screen kits)`,
        tip: "Avoid double-clicking a .rbxmx file outside Studio expecting it to merge automatically: use StarterGui -> Right-Click -> Insert from File... inside your open place file.",
      },
      {
        heading: "3. Move included server scripts into ServerScriptService",
        paragraphs: [
          "UI visuals and button animations stay inside StarterGui LocalScripts, while economy deductions, Daily Rewards, Code Redeem checks, and Marketplace purchases must run on the server. If your UI kit ZIP includes server/*.server.lua files, create a Script inside ServerScriptService and copy those server handlers there (alongside matching RemoteEvents in ReplicatedStorage).",
        ],
      },
      {
        heading: "4. Troubleshoot imported GUI visibility, inset, and clicks",
        paragraphs: [
          "If an imported overlay leaves a strip uncovered at the very top of the viewport, select its ScreenGui in Explorer and toggle IgnoreGuiInset = true. If a modal keeps popping open when players respawn, verify ResetOnSpawn = false on the ScreenGui. And if a whole kit package imported cleanly, check whether KitScreenSwitcher manages which screen starts Enabled = true.",
        ],
        tip: "Because .rbxmx stores native Roblox instances, every exported ScreenGui works offline with zero third-party Studio plugins required.",
      },
    ],
    faq: [
      {
        q: "Where should I import a .rbxmx GUI file in Roblox Studio Explorer?",
        a: "Right-click StarterGui in Explorer, choose Insert from File..., and pick your .rbxmx file. Importing directly into Workspace prevents the GUI from appearing on players' screens.",
      },
      {
        q: "Do I need a Studio plugin to open or use .rbxmx files?",
        a: "No. .rbxmx is Roblox Studio's built-in XML model format, so Insert from File... reads ScreenGuis, Frames, constraints, gradients, and scripts natively.",
      },
      {
        q: "Why does my imported ScreenGui sit slightly below the top edge of the screen?",
        a: "Roblox reserves topbar inset space by default unless ScreenGui.IgnoreGuiInset is enabled. Set IgnoreGuiInset = true on full-screen overlays and loading screens.",
      },
      {
        q: "What is the difference between a single-screen .rbxmx and a UI Kit -complete.rbxmx bundle?",
        a: "Single-screen .rbxmx files import one standalone ScreenGui, while a Pro UI Kit -complete.rbxmx file bundles all 5 matched screens plus KitScreenSwitcher so menu tabs and persistent HUD elements work together on first Play.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "How to Make a GUI in Roblox" },
      { slug: "roblox-gui-code-structure", title: "Roblox GUI Code Explained: Instance.new, UDim2 & Parenting" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "How to Make a Roblox Main Menu GUI" },
    ],
  },
  {
    slug: "how-to-make-roblox-gamepass-icons",
    metaTitle: "How to Make and Upload Roblox Gamepass Icons (512×512)",
    metaDescription:
      "How to size, design and upload crisp 512x512 Roblox Gamepass and Badge icons: circular crop safe zones, Creator Dashboard upload steps and ImageLabel tips.",
    title: "How to Make & Upload Roblox Gamepass Icons (512×512)",
    description:
      "How to size, design, and upload crisp 512x512 Roblox Gamepass and Badge icons: circular crop safe zones, Creator Dashboard pass upload steps, and in-game ImageLabel tips.",
    category: "Design",
    customCta: {
      href: "/gamepass-icon-maker",
      label: "Open the Free 512x512 Gamepass Icon Maker",
    },
    intro:
      "Roblox displays Game Pass and Badge icons in two completely different places: the circular experience Store tab on your game page and rounded rectangular cards inside your in-game Shop GUI. If you put text or shield rims too close to the outer corners, Roblox's circular store crop slices them off. Follow these exact 512x512 specifications and Creator Dashboard upload steps.",
    sections: [
      {
        heading: "1. Follow Roblox's 512x512 PNG dimensions and circular safe zone",
        paragraphs: [
          "Export every Game Pass icon and Developer Product / Badge icon as a square 512x512 pixel PNG with clear silhouette contrast so it remains readable even when scaled down to 64x64 thumbnails on mobile store lists.",
          "Keep titles, shiny badges, and emblem edges inside an inner circle occupying roughly 82–88% of the canvas width (about 30–40px margin from each outer side on a 512px file). That guarantees zero clipped corners in Roblox's round Store frame while still filling rectangular in-game shop tiles cleanly.",
        ],
      },
      {
        heading: "2. Choose emblems, rims, and two-word micro-labels that sell passes",
        paragraphs: [
          "Strong passes communicate their gameplay perk in half a second: crowns or VIP stars for status, lightning bolts or winged boots for 2x Speed, magnet icons for Auto Collect, and crossed blades for Damage multipliers. Pair one bold center emblem with at most 1–2 short words (such as 2X COINS or VIP) instead of cramming feature paragraphs into a tiny thumbnail.",
        ],
        tip: "Generate clean 512x512 PNGs and vector SVGs tailored to dark fantasy, anime, obby, simulator, or sci-fi palettes directly in our free Gamepass Icon Maker with live circular safe-zone preview.",
      },
      {
        heading: "3. Upload your pass icon in Roblox Creator Dashboard",
        paragraphs: [
          "Open create.roblox.com and go to Creations -> select your Experience -> Monetization -> Passes -> Create a Pass. Click Change Image, upload your 512x512 PNG, enter a concise pass name and perk description, and save.",
          "Wait briefly for Roblox asset moderation to approve the image, then copy both the Pass ID (from the pass URL or Pass Details) for PromptGamePassPurchase and, if you want to reuse the icon inside custom in-game cards, grab the image asset ID for your ImageLabel.",
        ],
      },
      {
        heading: "4. Render crisp icons inside your in-game Game Pass Shop GUI",
        paragraphs: [
          "Set ImageLabel.ScaleType = Enum.ScaleType.Fit alongside a 1:1 UIAspectRatioConstraint so your square 512x512 icon never squashes on ultrawide monitors or narrow phones. Set BackgroundTransparency = 1 on the ImageLabel so transparent PNG edges sit smoothly over your card theme.",
        ],
        code: `-- Snippet: square ImageLabel ready for a 512x512 rbxassetid icon
local icon = Instance.new("ImageLabel")
icon.Size = UDim2.fromScale(0.65, 0.65)
icon.BackgroundTransparency = 1
icon.ScaleType = Enum.ScaleType.Fit
icon.Image = "rbxassetid://YOUR_UPLOADED_IMAGE_ID"
icon.Parent = passCard
Instance.new("UIAspectRatioConstraint", icon).AspectRatio = 1`,
      },
    ],
    faq: [
      {
        q: "What pixel size should a Roblox Gamepass icon be?",
        a: "Use a square 512x512 pixel PNG file. Square 1:1 uploads prevent blurry upscaling and keep details sharp on both mobile store lists and high-DPI desktop displays.",
      },
      {
        q: "Why does part of my Gamepass icon get cut off on the Roblox game page?",
        a: "Roblox applies a circular mask to Pass and Badge thumbnails on the experience Store tab. Any corners, borders, or wide labels outside the inner circle safe zone are cropped automatically.",
      },
      {
        q: "Can I use transparent backgrounds on Roblox Gamepass icons?",
        a: "Yes — PNGs with clean alpha transparency work great both on the circular Store thumbnail and inside dark or glowing in-game Shop GUI cards.",
      },
      {
        q: "What is the difference between a Pass ID and the uploaded Image Asset ID?",
        a: "Pass ID is what you pass to MarketplaceService:PromptGamePassPurchase(player, passId) and UserOwnsGamePassAsync. Image Asset ID is the rbxassetid:// image texture applied to an ImageLabel.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-gamepass-shop-gui", title: "How to Make a Roblox Game Pass Shop GUI" },
      { slug: "how-to-design-polished-roblox-ui", title: "How to Design Polished Roblox UI (Gradients, Strokes & Depth)" },
      { slug: "how-to-make-a-roblox-shop-gui", title: "How to Make a Roblox Shop GUI" },
    ],
  },
  {
    slug: "how-to-make-a-roblox-gamepass-shop-gui",
    metaDescription:
      "How to build and script a Roblox Game Pass Shop GUI: UIGridLayout pass cards, MarketplaceService:PromptGamePassPurchase, Owned state sync and server checks.",
    title: "How to Make a Roblox Game Pass Shop GUI",
    description:
      "How to build and script a Roblox Game Pass Shop GUI: UIGridLayout pass cards, MarketplaceService:PromptGamePassPurchase, Owned state sync, and server entitlement checks.",
    category: "Shop",
    relatedTemplate: "game-pass-shop",
    intro:
      "Unlike coin shops that deduct in-game currency, a Game Pass Shop GUI connects straight to Roblox's native Robux purchase prompt via MarketplaceService. A great pass store displays clear tier cards, disables or badges passes the player already owns, and awards perks reliably both immediately on purchase and whenever the player rejoins.",
    sections: [
      {
        heading: "1. Design a 3-card or scrollable Game Pass card layout",
        paragraphs: [
          "Structure each pass card cleanly using UIListLayout or fixed fractional Scale slots: pass icon ImageLabel (512x512 square with UIAspectRatioConstraint), bold perk title, short bullet description (e.g. \"+100% Coins Forever\"), and a prominent Robux CTA TextButton.",
          "Reserve highlighted borders or gold/cyan UIGradients for your flagship VIP or 2x Multiplier pass so players immediately spot the highest-value upgrade.",
        ],
      },
      {
        heading: "2. Prompt Robux purchase safely from a LocalScript",
        paragraphs: [
          "Store your Game Pass IDs in a shared ReplicatedStorage ModuleScript so buttons and server perk scripts never drift out of sync. When a player clicks Buy, first confirm they do not already own the pass (to prevent wasted or confusing prompts), then call MarketplaceService:PromptGamePassPurchase(player, passId).",
        ],
        code: `-- LocalScript inside GamePassShop ScreenGui
local Players = game:GetService("Players")
local MarketplaceService = game:GetService("MarketplaceService")

local localPlayer = Players.LocalPlayer
local PASS_IDS = {
	VIP = 12345678,
	DoubleCoins = 23456789,
}

local function attachPassButton(button: TextButton, passId: number)
	local ok, owns = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(localPlayer.UserId, passId)
	end)
	if ok and owns then
		button.Text = "OWNED"
		button.Active = false
		return
	end

	button.Activated:Connect(function()
		MarketplaceService:PromptGamePassPurchase(localPlayer, passId)
	end)
end`,
      },
      {
        heading: "3. Refresh the Owned state immediately via PromptGamePassPurchaseFinished",
        paragraphs: [
          "Listen to MarketplaceService.PromptGamePassPurchaseFinished on both client and server. In the LocalScript, check that player == localPlayer and wasPurchased == true, then update the card's button from price/Buy to OWNED right away without making the player rejoin.",
        ],
        code: `-- Client visual sync after purchase finishes
MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, purchasedPassId, wasPurchased)
	if player ~= localPlayer or not wasPurchased then return end
	if purchasedPassId == PASS_IDS.VIP then
		vipBuyButton.Text = "OWNED"
		vipBuyButton.Active = false
	end
end)`,
        tip: "Never grant gameplay multipliers (2x damage, VIP tag, speed boosts) solely from a LocalScript! Always verify ownership and apply perks inside a Script in ServerScriptService.",
      },
      {
        heading: "4. Grant and persist Game Pass perks on the server",
        paragraphs: [
          "Inside ServerScriptService, check MarketplaceService:UserOwnsGamePassAsync(player.UserId, passId) wrapped in pcall inside Players.PlayerAdded (caching owned pass booleans in memory for the session), AND listen to MarketplaceService.PromptGamePassPurchaseFinished so players who buy mid-session receive their perks instantaneously.",
        ],
        code: `-- Script in ServerScriptService
local Players = game:GetService("Players")
local MarketplaceService = game:GetService("MarketplaceService")

local VIP_PASS_ID = 12345678

local function grantVipPerk(player: Player)
	player:SetAttribute("HasVIP", true)
	-- Apply chat tag, speed boost, or coin multiplier server-side
end

Players.PlayerAdded:Connect(function(player)
	local ok, owns = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, VIP_PASS_ID)
	end)
	if ok and owns then
		grantVipPerk(player)
	end
end)

MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, wasPurchased)
	if wasPurchased and passId == VIP_PASS_ID then
		grantVipPerk(player)
	end
end)`,
      },
    ],
    faq: [
      {
        q: "How do I test Game Pass purchases for free inside Roblox Studio?",
        a: "In Roblox Studio Playtest mode, MarketplaceService:PromptGamePassPurchase opens a simulated free test prompt (no real Robux spent) and fires PromptGamePassPurchaseFinished with wasPurchased = true so you can verify your Owned button and perk logic end-to-end.",
      },
      {
        q: "Why does UserOwnsGamePassAsync sometimes fail if I call it every second?",
        a: "UserOwnsGamePassAsync makes a web request to Roblox APIs and caches aggressively. Check once on PlayerAdded, wrap it in pcall, store a boolean Attribute like HasVIP on the Player, and update that Attribute when PromptGamePassPurchaseFinished fires.",
      },
      {
        q: "Should Game Passes use PromptGamePassPurchase or ProcessReceipt?",
        a: "Game Passes (one-time permanent perks) use PromptGamePassPurchase and PromptGamePassPurchaseFinished. Repeatable consumables like currency packs or spin tokens use Developer Products and ProcessReceipt.",
      },
      {
        q: "Where can I create matching icons for my Game Pass Shop cards?",
        a: "Use the free Roblox GUI Maker Gamepass Icon Maker at /gamepass-icon-maker to customize 512x512 circular-safe emblems, rims, and colors as PNG or SVG with matching Store and Shop GUI styling.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-roblox-gamepass-icons", title: "How to Make & Upload Roblox Gamepass Icons (512×512)" },
      { slug: "how-to-make-a-roblox-shop-gui", title: "How to Make a Roblox Shop GUI" },
      { slug: "how-to-import-rbxmx-into-roblox-studio", title: "How to Import .rbxmx GUI Files into Roblox Studio" },
    ],
  },
  {
    slug: "roblox-gui-maker-alternatives",
    title: "Best Roblox GUI Maker Alternatives Compared (2026)",
    metaTitle: "Roblox GUI Maker Alternatives Compared: Browser vs Studio",
    description:
      "Compare browser Roblox GUI makers (robloxguimaker.app, RoUI, GuiForge, Avenlo), Roblox Studio, and Figma plugins by price, no-login access, and Luau/.rbxmx.",
    category: "Comparison",
    hideTemplateCta: true,
    customCta: { href: "/editor", label: "Try Roblox GUI Maker Free (No Login)" },
    intro:
      "Choosing a Roblox GUI maker comes down to four practical questions: can you design visually without installing software, do you have to create an account or pay a subscription, does it export real editable Roblox UI (Luau or .rbxmx) instead of flat images, and do your project files stay private? This guide compares the major browser-based Roblox GUI editors alongside Roblox Studio's built-in editor and Figma workflows so you can pick the right tool for your project.",
    sections: [
      {
        heading: "1. Side-by-side comparison: browser editors vs Roblox Studio vs Figma",
        paragraphs: [
          "The table below compares the most frequently recommended Roblox UI tools across pricing model, sign-up friction, export formats, customization controls, and privacy.",
        ],
        table: {
          headers: [
            "Tool",
            "Free & Account",
            "Runs in Browser",
            "Export Formats",
            "Best For",
          ],
          rows: [
            [
              "Roblox GUI Maker (robloxguimaker.app)",
              "Free forever, no account; optional one-time Pro ($9.90/$19.90)",
              "Yes (no download or plugin required)",
              "Unlimited Client + Server Luau, JSON/ZIP, offline sync JSON; Pro .rbxmx",
              "Zero-friction browser design, AI editable ScreenGui, local privacy, no subscription",
            ],
            [
              "RoUI (roui.app)",
              "Free starter; sign-in needed for unlimited exports",
              "Yes",
              "Luau & .rbxmx",
              "Template-first browsing with basic/advanced modes",
            ],
            [
              "GuiForge",
              "Free features; registration required",
              "Yes",
              "Luau scripts & Figma import",
              "Creators wanting multi-element animations and Figma import",
            ],
            [
              "Avenlo (avenlo.me)",
              "Free/freemium web editor",
              "Yes",
              ".rbxmx, .rbxm, Rojo JSON",
              "Keyframe UI animation timelines and Rojo pipelines",
            ],
            [
              "Roblox Studio UI Editor",
              "Free; Roblox account required",
              "No (Windows / Mac desktop app)",
              "Native inside .rbxl place",
              "Final gameplay wiring, Playtest, and publishing",
            ],
            [
              "Figma + Importer Plugins (e.g. RoImport)",
              "Figma account required; plugin limits vary",
              "Browser + Studio plugin",
              "Converted Frames & uploaded image assets",
              "Custom vector illustrations and brand-heavy HUD art",
            ],
          ],
        },
      },
      {
        heading: "2. When to choose Roblox GUI Maker (robloxguimaker.app)",
        paragraphs: [
          "If your priority is opening a browser tab and shipping a clean, editable Roblox interface with zero sign-up and zero subscription, robloxguimaker.app is built specifically for that workflow. Manual visual editing, all 13 starter templates, 6 interactive 5-screen Game UI Kit previews, and Client + Server Luau, JSON, ZIP, offline Studio plugin JSON, and single 512×512 Gamepass icon exports are unlimited and free.",
          "Without paying for any subscription, you can customize 7 core Roblox UI classes (ScreenGui, Frame, ScrollingFrame, TextLabel, TextButton, TextBox, ImageLabel), responsive UDim2 Scale and Offset, AnchorPoint, ZIndex, 9 Roblox fonts, UICorner, UIStroke, UIGradient, UIListLayout, UIGridLayout, UIAspectRatioConstraint, UISizeConstraint, and 5 interactive button actions (Show, Hide, Toggle, RemoteEvent, Teleport). Free AI prompt-to-GUI generation includes 3 prompts/hour and 5 prompts/day without logging in, and optional one-time Studio Pro passes unlock native .rbxmx exports.",
        ],
        tip: "Watch out for lookalike domains (.com / .dev). The open-source browser editor with AI-generated editable ScreenGui, Client + Server Luau, offline Studio plugin sync, and public GitHub code lives at robloxguimaker.app.",
      },
      {
        heading: "3. Browser GUI builders vs Roblox Studio's built-in UI editor",
        paragraphs: [
          "Roblox Studio is still required to test gameplay logic, bind DataStores or MarketplaceService, and publish your experience. However, building every Frame, UICorner, UIGradient, and UDim2 layout from scratch inside Studio's Explorer and Properties panels is slow — especially for solo developers or beginners.",
          "Using a browser-based GUI builder first lets you scaffold layouts visually, test Desktop/Tablet/Mobile aspect ratios, and generate clean Luau or .rbxmx in minutes, then drop the result directly into StarterGui inside Roblox Studio.",
        ],
      },
      {
        heading: "4. Figma + plugins vs native Roblox ScreenGui builders",
        paragraphs: [
          "Figma excels at bespoke illustrations, custom icons, and complex vector art. Its tradeoff for Roblox UI is that exported PNG layers must be uploaded through Roblox asset moderation, can blur when stretched across aspect ratios, and lose native UIListLayout / UIGridLayout flexibility unless rebuilt as Roblox instances.",
          "Native Roblox GUI builders output real ScreenGui objects (Frames, TextButtons, UICorner, UIStroke, UIGradient, constraints) that scale crisply on every device with zero image moderation wait.",
        ],
      },
      {
        heading: "5. Safety & hidden-limit checklist before picking any online GUI tool",
        paragraphs: [
          "Before using any online Roblox GUI editor, check four things: (1) it never asks for your Roblox password or .ROBLOSECURITY cookie, (2) visual editing and exports run locally in your browser without uploading private .rbxl places, (3) free usage limits vs paid exports are disclosed upfront, and (4) exported Luau is plain readable code you can audit before pasting into Studio.",
        ],
        tip: "You can verify local processing on any web tool by opening Chrome DevTools → Network, exporting a file, and confirming zero file-upload POST requests leave your browser.",
      },
    ],
    faq: [
      {
        q: "What is the best free Roblox GUI Maker with no login and no download?",
        a: "Roblox GUI Maker (robloxguimaker.app) runs 100% in your browser with no account, no installation, unlimited free manual editing and Client/Server Luau exports, browser-local storage, and optional AI prompt generation (3/hr & 5/day free).",
      },
      {
        q: "Which free Roblox GUI maker offers the most customization without a subscription?",
        a: "For zero-account, zero-subscription browser editing with Client + Server Luau and offline Studio plugin sync, robloxguimaker.app covers 7 core UI classes, UDim2 constraints, UIListLayout/UIGridLayout, UICorner, UIStroke, UIGradient, and interactive button actions. If you specifically want Figma import or keyframe animation timelines and do not mind registering an account, GuiForge and Avenlo are strong complements.",
      },
      {
        q: "Do I still need Roblox Studio if I use an online Roblox GUI maker?",
        a: "Yes. Browser GUI makers let you design, preview, and export Luau scripts or .rbxmx models without installing anything, but you still need Roblox Studio on Windows or Mac to import the interface into StarterGui, connect server game logic, and publish your Roblox experience.",
      },
      {
        q: "Are there daily limits or subscriptions on robloxguimaker.app?",
        a: "No recurring subscription. Manual GUI design, templates, and Luau/JSON/ZIP/offline-plugin exports are unlimited and free. Free AI prompt generation is rate-limited to 3/hour and 5/day per IP, and optional Pro .rbxmx + UI Kit passes are one-time purchases ($9.90 / $19.90).",
      },
      {
        q: "How is robloxguimaker.app different from AI image generators?",
        a: "AI image tools output flat PNG mockups you have to rebuild manually in Studio. Roblox GUI Maker generates real editable ScreenGui hierarchies with UDim2 positioning, interactive button actions, and copy-paste Luau or .rbxmx files.",
      },
    ],
    relatedGuides: [
      { slug: "export-roblox-gui-to-luau-and-rbxmx", title: "How to Export Roblox GUI to Luau Script or .rbxmx" },
      { slug: "can-you-make-roblox-gui-on-mobile-ipad", title: "Can You Make a Roblox GUI on iPhone, Android, or iPad?" },
      { slug: "roblox-gui-script-generator", title: "Roblox GUI Script Generator: Clean Luau for StarterGui" },
    ],
  },
  {
    slug: "export-roblox-gui-to-luau-and-rbxmx",
    title: "How to Export Roblox GUI to Luau Script or .rbxmx",
    metaTitle: "Export Roblox GUI to Luau Script or .rbxmx | Studio Guide",
    description:
      "Learn how to export a Roblox GUI design as a clean Instance.new Luau LocalScript, offline plugin JSON, or native .rbxmx model and import it into StarterGui.",
    category: "Workflow",
    relatedTemplate: "main-menu",
    hideTemplateCta: true,
    customCta: { href: "/editor", label: "Open Editor & Export Free Luau" },
    intro:
      "Designing a Roblox UI in a browser only saves time if the export drops cleanly into Roblox Studio. There are two fundamentally different ways to export a Roblox GUI: generating an Instance.new Luau script that constructs the UI at runtime, or exporting an actual ScreenGui instance hierarchy (.rbxmx model or offline Studio plugin JSON) you can continue editing visually inside Roblox Studio Explorer. This guide walks through every export option and how to import each one cleanly.",
    sections: [
      {
        heading: "1. Compare the 4 Roblox GUI export formats",
        paragraphs: [
          "Pick the export format that matches how you want to maintain the interface inside Roblox Studio.",
        ],
        table: {
          headers: [
            "Export Format",
            "Cost",
            "Editable in Studio Explorer?",
            "Best Use Case",
          ],
          rows: [
            [
              "Client + Server Luau (.lua)",
              "Free, unlimited",
              "Built at runtime via Instance.new",
              "Fastest copy-paste import with zero plugins or file steps",
            ],
            [
              "Offline Studio Plugin JSON (RobloxGuiMakerSync.lua)",
              "Free, unlimited",
              "Yes — creates real ScreenGui instances with Ctrl+Z undo",
              "Visual editing in Studio Explorer without paying or enabling HTTP",
            ],
            [
              "Native Roblox Model (.rbxmx)",
              "One-time Pro pass",
              "Yes — native XML hierarchy via Insert from File...",
              "Zero-plugin drag-and-drop Studio models & 5-screen Game UI Kits",
            ],
            [
              "Editable JSON / ZIP Project",
              "Free, unlimited",
              "Re-importable in browser editor",
              "Local backups, team handoff, and version control",
            ],
          ],
        },
      },
      {
        heading: "2. Option A: Export & paste a clean Luau LocalScript (free, 60 seconds)",
        paragraphs: [
          "In the visual editor, finish arranging your Frames, TextButtons, and constraints, then click Export → Client Luau (.lua). Open your place in Roblox Studio, right-click StarterGui in Explorer, insert a LocalScript, and paste the generated Luau code. Press Play and your ScreenGui builds automatically with responsive UDim2 positioning and wired button clicks.",
        ],
        code: `-- LocalScript inside StarterGui (generated clean Luau pattern)
local Players = game:GetService("Players")
local playerGui = Players.LocalPlayer:WaitForChild("PlayerGui")

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "MainMenuGui"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

local panel = Instance.new("Frame")
panel.Size = UDim2.fromScale(0.36, 0.42)
panel.Position = UDim2.fromScale(0.5, 0.5)
panel.AnchorPoint = Vector2.new(0.5, 0.5)
panel.BackgroundColor3 = Color3.fromRGB(24, 27, 38)
panel.Parent = screenGui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = panel

local playBtn = Instance.new("TextButton")
playBtn.Size = UDim2.fromScale(0.7, 0.2)
playBtn.Position = UDim2.fromScale(0.5, 0.72)
playBtn.AnchorPoint = Vector2.new(0.5, 0.5)
playBtn.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
playBtn.Text = "PLAY"
playBtn.Font = Enum.Font.GothamBold
playBtn.TextScaled = true
playBtn.Parent = panel

playBtn.Activated:Connect(function()
	panel.Visible = false
end)`,
        tip: "Always set ScreenGui.ResetOnSpawn = false for persistent menus, shops, and HUDs so player respawns do not reset open panels.",
      },
      {
        heading: "3. Option B: Export a real editable ScreenGui hierarchy (Offline Plugin or .rbxmx)",
        paragraphs: [
          "If you want to click individual Frames and TextButtons inside Roblox Studio's Explorer instead of running an Instance.new script at play time, you have two clean paths in Roblox GUI Maker:",
          "Free path: install our single-file offline Studio plugin (RobloxGuiMakerSync.lua from /studio-plugin) once, copy Plugin JSON from the editor, and paste it inside Studio. It requires zero HttpService permissions and wraps every import in ChangeHistoryService so Ctrl+Z undoes cleanly. Zero-plugin path: unlock a one-time Studio Pro pass to download native .rbxmx XML files, then right-click StarterGui → Insert from File... in Roblox Studio.",
        ],
      },
      {
        heading: "4. Where Client vs Server Luau scripts belong in Roblox Studio",
        paragraphs: [
          "Visual UI creation and button click listeners (Show, Hide, Toggle) belong in a LocalScript under StarterGui because only the client renders PlayerGui. Whenever a button triggers a RemoteEvent (like buying an item or claiming a reward) or a Teleport, place the matching server handler inside a Script under ServerScriptService and validate ownership, cooldowns, and allow-listed PlaceIds on the server.",
        ],
        tip: "Never trust client-sent prices, item grants, or arbitrary PlaceIds from a GUI button — treat every RemoteEvent as an untrusted request and verify it server-side.",
      },
      {
        heading: "5. Quick troubleshooting after importing into Studio",
        paragraphs: [
          "If your GUI does not appear in Play mode, check three things first: confirm the LocalScript is inside StarterGui (not ServerScriptService or Workspace), confirm ScreenGui.Enabled = true, and check the Studio Output window for syntax errors or missing ReplicatedStorage RemoteEvent names.",
          "If panels look stretched on phones or ultrawide monitors, switch fixed pixel Offsets to UDim2 Scale with AnchorPoint (0.5, 0.5) and add a UIAspectRatioConstraint — or run your dimensions through our free UDim2 UI Sizer at /roblox-ui-sizer.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I export a Roblox GUI design as a Lua / Luau script for free?",
        a: "Yes. Roblox GUI Maker (robloxguimaker.app) lets you copy or download unlimited clean Client and Server Luau scripts for free with no account, no watermark, and no daily export cap.",
      },
      {
        q: "What is the difference between a Luau creation script and a .rbxmx model export?",
        a: "A Luau creation script builds your ScreenGui via Instance.new() when the game starts. A .rbxmx model file (or our free offline Studio plugin JSON) inserts real ScreenGui, Frame, UICorner, UIGradient, and constraint objects directly into Studio Explorer so you can inspect and edit them visually before pressing Play.",
      },
      {
        q: "Where do I paste an exported Roblox GUI script in Roblox Studio?",
        a: "Paste the Client Luau into a LocalScript inside StarterGui. If your UI includes RemoteEvent or Teleport button actions, paste the separate Server Luau into a Script inside ServerScriptService.",
      },
      {
        q: "Is exported Luau code generated locally or uploaded to a server?",
        a: "Luau, JSON, and ZIP exports are generated 100% locally inside your browser — your GUI layouts are never uploaded to our servers.",
      },
      {
        q: "How do I import a .rbxmx file into Roblox Studio?",
        a: "Open your experience in Roblox Studio, right-click StarterGui in the Explorer panel, click Insert from File..., and select your downloaded .rbxmx file.",
      },
    ],
    relatedGuides: [
      { slug: "how-to-import-rbxmx-into-roblox-studio", title: "How to Import .rbxmx GUI Files into Roblox Studio" },
      { slug: "roblox-gui-script-generator", title: "Roblox GUI Script Generator: Clean Luau for StarterGui" },
      { slug: "roblox-gui-maker-alternatives", title: "Best Roblox GUI Maker Alternatives Compared (2026)" },
    ],
  },
  {
    slug: "can-you-make-roblox-gui-on-mobile-ipad",
    title: "Can You Make a Roblox GUI on iPhone, Android, or iPad?",
    metaTitle: "Make Roblox GUI on Mobile or iPad? Browser vs Studio",
    description:
      "Find out what you can design on iPhone, Android, and iPad in a browser Roblox GUI maker, when you need a desktop, and why Roblox Studio needs Windows/Mac.",
    category: "Compatibility",
    hideTemplateCta: true,
    customCta: { href: "/templates", label: "Browse Mobile-Friendly Templates" },
    intro:
      "Yes — you can start designing and generating Roblox GUI layouts in a mobile or tablet browser without installing anything, as long as you know where mobile browsers shine and where a desktop takes over. Specifically, designing UI concepts, browsing templates, and running companion utilities work on iPhone, Android, and iPad, while full precision drag-and-drop editing works best on a wider screen (desktop, laptop, or landscape tablet at 768px+), and Roblox Studio itself officially requires Windows or Mac.",
    sections: [
      {
        heading: "1. Device compatibility matrix: phone vs tablet vs desktop",
        paragraphs: [
          "Here is an honest breakdown of what works smoothly on each device when building Roblox interfaces with robloxguimaker.app and Roblox Studio.",
        ],
        table: {
          headers: [
            "Task",
            "iPhone / Android Phone",
            "iPad / Android Tablet (Landscape ≥768px)",
            "Windows / Mac Desktop",
          ],
          rows: [
            [
              "Browse 13 templates & 6 Game UI Kits",
              "Full support",
              "Full support",
              "Full support",
            ],
            [
              "AI prompt-to-GUI generation on homepage",
              "Supported (generate & preview)",
              "Full support",
              "Full support",
            ],
            [
              "Full drag-and-drop /editor canvas",
              "Not recommended (<768px screen prompt)",
              "Supported in landscape (keyboard/mouse helps)",
              "Best experience",
            ],
            [
              "UDim2 UI Sizer & 512×512 Gamepass Icon Maker",
              "Supported",
              "Full support",
              "Full support",
            ],
            [
              "Import Luau / .rbxmx & publish in Roblox Studio",
              "Not supported by Roblox Studio",
              "Not supported by Roblox Studio",
              "Required (Windows / Mac)",
            ],
          ],
        },
      },
      {
        heading: "2. What you can do right now on an iPhone, Android phone, or iPad",
        paragraphs: [
          "Even away from your computer, a browser-based Roblox GUI maker lets you move your UI design forward: explore all 13 starter templates (shops, HUDs, inventories, main menus, leaderboards), generate an AI ScreenGui concept directly from the homepage prompt box, calculate responsive UDim2 Scale values with the UDim2 UI Sizer (/roblox-ui-sizer), and build circular-safe 512×512 PNG badges with the Gamepass Icon Maker (/gamepass-icon-maker).",
          "On an iPad or Android tablet in landscape mode (768px or wider), the visual /editor canvas opens directly in Safari or Chrome so you can adjust colors, text, corners, and layout containers on the go.",
        ],
      },
      {
        heading: "3. Why serious drag-and-drop editing and Studio import still need a computer",
        paragraphs: [
          "A precision Roblox GUI workspace has three dense panels at once: an Explorer hierarchy tree, a scaled canvas with snap guides, and a Roblox Properties inspector (UDim2 Scale/Offset, AnchorPoint, ZIndex, UIStroke, UIGradient). Squeezing all three onto a 390px phone screen causes accidental drags and unreadable inputs, which is why robloxguimaker.app intentionally reserves the full /editor canvas for screens 768px and wider.",
          "Separately, Roblox Corporation only ships Roblox Studio for Windows and macOS — there is no native iPhone, iPad, or Android Roblox Studio app. So no matter which online GUI maker you use, importing your exported Luau or .rbxmx into StarterGui and publishing your game happens on a Windows or Mac computer.",
        ],
        tip: "Designing responsive GUIs FOR mobile players is different from editing ON a phone: on desktop in /editor, switch the viewport toggle between Desktop (1920×1080), Tablet, and Mobile to verify your UI fits every player's screen.",
      },
      {
        heading: "4. Smooth phone-to-PC workflow in 3 steps",
        paragraphs: [
          "1. Brainstorm and pick a starter template or AI prompt on your phone or iPad (and export any 512×512 Gamepass PNG icons you need). 2. On your laptop or desktop browser, open /editor to fine-tune UDim2 positioning, interactive button actions, and mobile viewport previews — remember browser drafts are stored locally per device, so download a JSON/ZIP backup if switching devices. 3. Export clean Client + Server Luau (or Pro .rbxmx) and drop it into Roblox Studio on Windows or Mac.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I use Roblox GUI Maker on my iPhone or Android phone?",
        a: "You can browse all 13 templates, generate AI UI prompts from the homepage, preview Game UI Kits, and use mobile-friendly utilities like the UDim2 UI Sizer and Gamepass Icon Maker on a phone. For the full drag-and-drop /editor canvas, use a desktop, laptop, or landscape tablet (768px+).",
      },
      {
        q: "Does a browser-based Roblox GUI editor work on iPad?",
        a: "Yes. On an iPad or Android tablet in landscape orientation (768px or wider), Safari and Chrome can open the /editor canvas for layout tweaks, though pairing a keyboard and trackpad or switching to a desktop gives the fastest precision.",
      },
      {
        q: "Can I run Roblox Studio on iPhone, iPad, or Android to import my GUI?",
        a: "No. Roblox Studio officially supports only Windows and Mac computers. You can design UI concepts in a mobile or tablet browser, then move your exported Luau or .rbxmx file to a Windows or Mac PC to import into StarterGui and publish.",
      },
      {
        q: "Will a GUI I build on my phone or tablet sync automatically to my PC?",
        a: "Because robloxguimaker.app has no accounts and stores projects locally in your browser for privacy, drafts do not sync automatically across devices. Export your project as JSON, ZIP, or Luau to transfer it between devices safely.",
      },
    ],
    relatedGuides: [
      { slug: "export-roblox-gui-to-luau-and-rbxmx", title: "How to Export Roblox GUI to Luau Script or .rbxmx" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "How to Use UIListLayout in Roblox Studio" },
      { slug: "roblox-gui-maker-alternatives", title: "Best Roblox GUI Maker Alternatives Compared (2026)" },
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
