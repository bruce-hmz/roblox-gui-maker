// Use-case landing pages targeting "Roblox GUI Maker for X" long-tail queries.
// Each maps to a template where we have one, or to the blank editor otherwise.

export type UseCase = {
  slug: string;
  title: string; // H1, e.g. "Roblox GUI Maker for Shop Menus"
  noun: string; // "shop menu"
  blurb: string; // specific 2-3 sentence intro
  needs: string[]; // 3 things this GUI type usually needs
  template?: string; // related template slug
  howTo: string[]; // 3-4 step guide for building this GUI type
  tips: string[]; // 2-3 practical tips
  properties: string[]; // key Roblox properties used
  relatedGuide?: string; // slug of a related guide page
};

export const USE_CASES: UseCase[] = [
  {
    slug: "main-menus",
    title: "Roblox GUI Maker for Main Menus",
    noun: "main menu",
    blurb:
      "The main menu is the first thing players see when they join. It needs a title, a clear primary action (Play), and secondary buttons stacked neatly — and it has to look the part.",
    needs: [
      "A centered panel with a title and a stack of action buttons",
      "Buttons that open or close other panels (settings, credits)",
      "Scale-based sizing so it centers on phones and desktops alike",
    ],
    template: "main-menu",
    howTo: [
      "Drag a ScreenGui and a Frame onto the canvas. Set the Frame's AnchorPoint to 0.5, 0.5 and Position to {0.5, 0}, {0.5, 0} so it centers on every screen.",
      "Add a TextLabel for the game title at the top, then stack TextButtons below it using a UIListLayout with Padding.",
      "Wire each button to show or hide other panels — the editor generates the show/hide Luau for you.",
      "Export the Luau, paste the client script into StarterGui, and test on both desktop and mobile viewports.",
    ],
    tips: [
      "Use UDim2.fromScale for the main frame so it resizes on all devices, then use UDim2.fromOffset for fine-tuning padding.",
      "Add a UIStroke to the Frame border for a clean edge without extra images.",
      "Keep button text short — 'Play', 'Settings', 'Quit' — longer labels look cramped on mobile.",
    ],
    properties: [
      "AnchorPoint",
      "Position (UDim2)",
      "Size (UDim2)",
      "BackgroundColor3",
      "UIListLayout",
      "UICorner",
      "UIStroke",
    ],
    relatedGuide: "how-to-make-a-roblox-main-menu-gui",
  },
  {
    slug: "shop-menus",
    title: "Roblox GUI Maker for Shop Menus",
    noun: "shop menu",
    blurb:
      "A shop needs a scrollable area where items tile into a grid, each with an icon and price, plus a way for the purchase to actually reach the server.",
    needs: [
      "A ScrollingFrame whose items auto-tile with UIGridLayout",
      "Reusable item cells (icon + price + buy button)",
      "A RemoteEvent so the server verifies and grants the purchase",
    ],
    template: "shop",
    howTo: [
      "Start with a ScreenGui and a ScrollingFrame that fills most of the screen. Add a UIGridLayout inside it to auto-tile child frames.",
      "Create one item cell Frame with an ImageLabel (icon), a TextLabel (price), and a TextButton (Buy). Duplicate it for each item.",
      "Add a RemoteEvent in ReplicatedStorage. The editor generates a client LocalScript that fires the event on click and a server Script that listens.",
      "Export both scripts. Place the LocalScript under StarterGui and the Script under ServerScriptService.",
    ],
    tips: [
      "Set UIGridLayout.CellSize with scale values so items resize on mobile. A good starting point is {0, 150}, {0, 180}.",
      "Use UIAspectRatioConstraint on item icons so they stay square regardless of frame size.",
      "Always validate purchases on the server — never trust the client for economy actions.",
    ],
    properties: [
      "ScrollingFrame",
      "UIGridLayout",
      "CellSize",
      "ScrollBarThickness",
      "ImageLabel",
      "RemoteEvent",
      "UIAspectRatioConstraint",
    ],
    relatedGuide: "how-to-make-a-roblox-shop-gui",
  },
  {
    slug: "inventory-screens",
    title: "Roblox GUI Maker for Inventory Screens",
    noun: "inventory screen",
    blurb:
      "An inventory shows everything a player owns, usually as a grid of slots they can tap to equip or use. Add or remove items and the grid should reflow without manual layout.",
    needs: [
      "A fixed UIGridLayout of uniform slots",
      "Scrolling when the player owns more than fits on screen",
      "Slot cells you can populate from a script at runtime",
    ],
    template: "inventory",
    howTo: [
      "Create a ScrollingFrame with a UIGridLayout. Set CellSize to a square like {0, 100}, {0, 100} and CellPadding to {0, 8}, {0, 8}.",
      "Build one slot Frame with a BackgroundColor3, a UICorner, and space for an ImageLabel. This is your template cell.",
      "Add filter tabs at the top using a UIListLayout of TextButtons. Wire each tab to show/hide the relevant slots.",
      "Export and wire the slot population logic in your game script — loop through the player's data and clone slot templates.",
    ],
    tips: [
      "Use a consistent naming convention for slots (Slot1, Slot2…) so your game script can find them by index.",
      "Add a selected-state highlight — a UIStroke that appears when the player taps a slot.",
      "For large inventories, consider a category filter row above the grid to reduce visual clutter.",
    ],
    properties: [
      "UIGridLayout",
      "CellSize",
      "ScrollingFrame",
      "UIStroke",
      "UICorner",
      "ImageLabel",
      "Visible",
    ],
    relatedGuide: "how-to-make-a-roblox-inventory-gui",
  },
  {
    slug: "simulator-huds",
    title: "Roblox GUI Maker for Simulator HUDs",
    noun: "simulator HUD",
    blurb:
      "Simulator HUDs pack currency, stats, and action buttons into the corners of the screen and update them every frame. They stay on screen the whole game, so they have to be tight and readable.",
    needs: [
      "Corner-anchored currency and stat readouts",
      "Persistent action buttons (rebirth, pets, shop)",
      "Small footprint that never blocks gameplay",
    ],
    template: "health-bar",
    howTo: [
      "Drag a ScreenGui onto the canvas. Add corner Frames anchored to top-left and top-right using AnchorPoint and Position with scale values.",
      "Add TextLabels for currency (coins, gems) with an ImageLabel icon next to each. Use UIListLayout to stack multiple stats.",
      "Place action buttons (Rebirth, Pets, Shop) along the bottom or side rail. Set Size with offset so they stay a fixed tap-friendly size.",
      "Export and connect your game's stat-changed events to update the TextLabel.Text values in real time.",
    ],
    tips: [
      "Keep HUD elements in the safe zone — avoid the top 60px (Roblox CoreGui offset) and bottom 40px (chat bar).",
      "Use UITextSizeConstraint to prevent text from becoming unreadable on small screens.",
      "Group related stats in a semi-transparent Frame so they read as a single unit.",
    ],
    properties: [
      "AnchorPoint",
      "Position (UDim2)",
      "TextLabel",
      "ImageLabel",
      "UIListLayout",
      "UITextSizeConstraint",
      "BackgroundTransparency",
    ],
  },
  {
    slug: "settings-panels",
    title: "Roblox GUI Maker for Settings Panels",
    noun: "settings panel",
    blurb:
      "A settings panel lets players tune music, sound, and particles — usually a list of rows with a label and a toggle. It opens from the menu and closes back to it.",
    needs: [
      "Rows stacked with UIListLayout (label + toggle each)",
      "Open/close behavior wired to a button",
      "UIPadding so the contents don't touch the edges",
    ],
    template: "settings",
    howTo: [
      "Create a Frame sized to about 60% of the screen width. Add UIPadding with equal padding on all sides.",
      "Inside, add a UIListLayout with Padding set to {0, 12}. Each child is a row Frame containing a TextLabel and a toggle Frame.",
      "The toggle Frame switches between two visual states — the editor's show/hide action wires this for you.",
      "Add a close button at the top. Wire it to hide the settings panel and re-show the parent menu.",
    ],
    tips: [
      "Use a consistent row height (40–48px offset) so the list looks uniform.",
      "Store toggle state in a ModuleScript or Attributes so other scripts can read settings without querying the GUI.",
      "Add a section header TextLabel above groups of related settings (Audio, Visual, Controls).",
    ],
    properties: [
      "UIListLayout",
      "UIPadding",
      "Size (UDim2)",
      "TextLabel",
      "Visible",
      "BackgroundColor3",
      "UICorner",
    ],
    relatedGuide: "how-to-script-a-roblox-gui",
  },
  {
    slug: "loading-screens",
    title: "Roblox GUI Maker for Loading Screens",
    noun: "loading screen",
    blurb:
      "A loading screen covers the whole viewport while assets stream in — a title, a progress bar that fills, and a rotating tip. Once the game is ready, it disappears.",
    needs: [
      "A full-screen background (IgnoreGuiInset) with a gradient",
      "A progress bar you can tween from empty to full",
      "Clean teardown (destroy) when loading completes",
    ],
    template: "loading-screen",
    howTo: [
      "Add a ScreenGui with IgnoreGuiInset enabled. Inside, place a Frame that fills the entire screen (Size = {1,0},{1,0}).",
      "Add a background ImageLabel or gradient Frame, then a TextLabel for the title and a smaller one for rotating tips.",
      "Create a progress bar: a background Frame with a child Frame whose Size X scale you tween from 0 to 1.",
      "Export. In your game script, tween the bar width as content loads, then destroy the ScreenGui when ready.",
    ],
    tips: [
      "Use TweenService:Create on the progress bar's Size for a smooth fill animation.",
      "Rotate tips with a coroutine that changes TextLabel.Text every 3–5 seconds.",
      "Always destroy the loading ScreenGui when done — don't just set Visible = false, it still renders.",
    ],
    properties: [
      "IgnoreGuiInset",
      "Size (UDim2)",
      "TweenService",
      "TextLabel",
      "ImageLabel",
      "ZIndex",
      "Destroy",
    ],
    relatedGuide: "how-to-make-a-roblox-loading-screen-gui",
  },
  {
    slug: "leaderboards",
    title: "Roblox GUI Maker for Leaderboards",
    noun: "leaderboard",
    blurb:
      "A leaderboard ranks players by a stat and drives competition. Each row shows rank, name, and score, with the top entry highlighted, and it grows as more players join.",
    needs: [
      "Rows that stack with UIListLayout and scale with player count",
      "Rank, name, and score columns per row",
      "The top row highlighted to reward the leader",
    ],
    template: "leaderboard",
    howTo: [
      "Create a Frame anchored to the right side of the screen. Add a UIListLayout inside it for automatic row stacking.",
      "Build one row Frame with three TextLabels: rank, player name, and score. Set row Size to use scale width and offset height.",
      "Add a highlight style for the first row — a different BackgroundColor3 or a UIStroke.",
      "Export. In your game script, sort player stats and clone row templates to populate the list.",
    ],
    tips: [
      "Use GetChildren() count to set the scrolling frame's CanvasSize dynamically as players join.",
      "Color-code the top 3 rows (gold, silver, bronze) for visual hierarchy.",
      "Update the leaderboard on a timer (every 5–10s) rather than every frame to reduce GUI churn.",
    ],
    properties: [
      "UIListLayout",
      "AnchorPoint",
      "Position (UDim2)",
      "TextLabel",
      "BackgroundColor3",
      "UIStroke",
      "ZIndex",
    ],
    relatedGuide: "how-to-make-a-roblox-global-leaderboard-gui",
  },
  {
    slug: "admin-panels",
    title: "Roblox GUI Maker for Admin Panels",
    noun: "admin panel",
    blurb:
      "Admin panels give moderators a hidden interface to kick, ban, or teleport players. They're opened with a command or key, list players, and run privileged actions through server checks.",
    needs: [
      "A hidden panel toggled by an admin key or command",
      "A scrollable player list with action buttons per row",
      "Server-side permission checks on every action",
    ],
    howTo: [
      "Create a ScreenGui with ResetOnSpawn disabled. Add a Frame that starts with Visible = false.",
      "Inside, build a ScrollingFrame with a UIListLayout for the player list. Each row has a TextLabel (name) and TextButtons (Kick, Ban, Teleport).",
      "Add a RemoteEvent for each action. The editor generates separate server handlers with validation boundaries.",
      "Export. Wire the open/close to a keybind (UserInputService) or a chat command. The server Script checks admin rank before executing.",
    ],
    tips: [
      "Never trust client-side permission checks — always validate admin rank on the server.",
      "Use a ModuleScript for the admin list so you can update it without touching the GUI code.",
      "Add a confirmation dialog before destructive actions (kick, ban) to prevent accidental clicks.",
    ],
    properties: [
      "Visible",
      "ResetOnSpawn",
      "ScrollingFrame",
      "UIListLayout",
      "RemoteEvent",
      "UserInputService",
      "TextButton",
    ],
    relatedGuide: "how-to-open-a-gui-with-a-key-in-roblox",
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
