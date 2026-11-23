-- Roblox GUI Maker — Offline Studio Companion Plugin (v1)
-- Purely local & offline: zero HttpService network requests, zero external module loading.
-- Install into Roblox Studio's local Plugins folder and paste v1 JSON copied
-- from https://robloxguimaker.app/editor ("Copy Plugin JSON").

local ChangeHistoryService = game:GetService("ChangeHistoryService")
local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")
local StarterGui = game:GetService("StarterGui")

local toolbar = plugin:CreateToolbar("Roblox GUI Maker")
local toggleButton = toolbar:CreateButton(
	"Import GUI",
	"Paste Roblox GUI Maker JSON to build native ScreenGui instances in Studio",
	"rbxassetid://4458901886"
)

local widgetInfo = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Float,
	false,
	false,
	420,
	380,
	320,
	280
)

local widget = plugin:CreateDockWidgetPluginGui("RobloxGuiMakerSyncWidget", widgetInfo)
widget.Title = "Roblox GUI Maker — Offline Sync"

local rootFrame = Instance.new("Frame")
rootFrame.Size = UDim2.fromScale(1, 1)
rootFrame.BackgroundColor3 = Color3.fromRGB(17, 19, 28)
rootFrame.BorderSizePixel = 0
rootFrame.Parent = widget

local padding = Instance.new("UIPadding")
padding.PaddingTop = UDim.new(0, 12)
padding.PaddingBottom = UDim.new(0, 12)
padding.PaddingLeft = UDim.new(0, 12)
padding.PaddingRight = UDim.new(0, 12)
padding.Parent = rootFrame

local header = Instance.new("TextLabel")
header.Size = UDim2.new(1, 0, 0, 22)
header.BackgroundTransparency = 1
header.Font = Enum.Font.GothamBold
header.TextSize = 14
header.TextXAlignment = Enum.TextXAlignment.Left
header.TextColor3 = Color3.fromRGB(225, 225, 239)
header.Text = "Paste v1 JSON from robloxguimaker.app/editor"
header.Parent = rootFrame

local targetMode = "StarterGui"

local targetButton = Instance.new("TextButton")
targetButton.Position = UDim2.new(0, 0, 0, 28)
targetButton.Size = UDim2.new(1, 0, 0, 28)
targetButton.BackgroundColor3 = Color3.fromRGB(36, 40, 54)
targetButton.BorderSizePixel = 0
targetButton.Font = Enum.Font.GothamMedium
targetButton.TextSize = 12
targetButton.TextColor3 = Color3.fromRGB(153, 203, 255)
targetButton.Text = "Target: StarterGui (click to toggle Selected Instance)"
targetButton.Parent = rootFrame

local targetCorner = Instance.new("UICorner")
targetCorner.CornerRadius = UDim.new(0, 6)
targetCorner.Parent = targetButton

targetButton.MouseButton1Click:Connect(function()
	if targetMode == "StarterGui" then
		targetMode = "Selected"
		targetButton.Text = "Target: Selected Instance (click to switch to StarterGui)"
	else
		targetMode = "StarterGui"
		targetButton.Text = "Target: StarterGui (click to toggle Selected Instance)"
	end
end)

local jsonBox = Instance.new("TextBox")
jsonBox.Position = UDim2.new(0, 0, 0, 64)
jsonBox.Size = UDim2.new(1, 0, 1, -138)
jsonBox.BackgroundColor3 = Color3.fromRGB(25, 27, 36)
jsonBox.BorderSizePixel = 1
jsonBox.BorderColor3 = Color3.fromRGB(45, 49, 63)
jsonBox.Font = Enum.Font.Code
jsonBox.TextSize = 12
jsonBox.TextColor3 = Color3.fromRGB(225, 225, 239)
jsonBox.PlaceholderColor3 = Color3.fromRGB(137, 145, 157)
jsonBox.PlaceholderText = '{"format":"roblox-gui-maker","version":1,"scene":[...]}'
jsonBox.Text = ""
jsonBox.ClearTextOnFocus = false
jsonBox.MultiLine = true
jsonBox.TextWrapped = true
jsonBox.TextXAlignment = Enum.TextXAlignment.Left
jsonBox.TextYAlignment = Enum.TextYAlignment.Top
jsonBox.Parent = rootFrame

local statusLabel = Instance.new("TextLabel")
statusLabel.Position = UDim2.new(0, 0, 1, -66)
statusLabel.Size = UDim2.new(1, 0, 0, 22)
statusLabel.BackgroundTransparency = 1
statusLabel.Font = Enum.Font.Gotham
statusLabel.TextSize = 11
statusLabel.TextXAlignment = Enum.TextXAlignment.Left
statusLabel.TextTruncate = Enum.TextTruncate.AtEnd
statusLabel.TextColor3 = Color3.fromRGB(190, 199, 212)
statusLabel.Text = "Offline ready — builds real instances with Undo support."
statusLabel.Parent = rootFrame

local buildButton = Instance.new("TextButton")
buildButton.Position = UDim2.new(0, 0, 1, -38)
buildButton.Size = UDim2.new(1, 0, 0, 36)
buildButton.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
buildButton.BorderSizePixel = 0
buildButton.Font = Enum.Font.GothamBold
buildButton.TextSize = 13
buildButton.TextColor3 = Color3.fromRGB(0, 29, 52)
buildButton.Text = "Build in Studio"
buildButton.Parent = rootFrame

local buildCorner = Instance.new("UICorner")
buildCorner.CornerRadius = UDim.new(0, 8)
buildCorner.Parent = buildButton

local VALID_CLASSES = {
	ScreenGui = true,
	Frame = true,
	TextLabel = true,
	TextButton = true,
	TextBox = true,
	ImageLabel = true,
	ScrollingFrame = true,
}

local FONT_MAP = {
	GothamBold = Enum.Font.GothamBold,
	GothamMedium = Enum.Font.GothamMedium,
	Gotham = Enum.Font.Gotham,
	FredokaOne = Enum.Font.FredokaOne,
	Code = Enum.Font.Code,
	SourceSansBold = Enum.Font.SourceSansBold,
}

local function hexToColor3(hex)
	if type(hex) ~= "string" then
		return Color3.fromRGB(255, 255, 255)
	end
	local clean = hex:gsub("#", "")
	if #clean ~= 6 then
		return Color3.fromRGB(255, 255, 255)
	end
	local r = tonumber(clean:sub(1, 2), 16) or 255
	local g = tonumber(clean:sub(3, 4), 16) or 255
	local b = tonumber(clean:sub(5, 6), 16) or 255
	return Color3.fromRGB(r, g, b)
end

local function makeUDim2(scaleTable, offsetTable)
	local sx = (type(scaleTable) == "table" and tonumber(scaleTable.x)) or 0
	local sy = (type(scaleTable) == "table" and tonumber(scaleTable.y)) or 0
	local ox = (type(offsetTable) == "table" and tonumber(offsetTable.x)) or 0
	local oy = (type(offsetTable) == "table" and tonumber(offsetTable.y)) or 0
	return UDim2.new(sx, math.round(ox), sy, math.round(oy))
end

local function buildSceneFromJson(rawJson)
	local ok, decoded = pcall(function()
		return HttpService:JSONDecode(rawJson)
	end)
	if not ok or type(decoded) ~= "table" then
		return false, "Invalid JSON syntax."
	end

	local scene = decoded.scene
	if type(scene) ~= "table" and type(decoded[1]) == "table" then
		scene = decoded
	end
	if type(scene) ~= "table" or #scene == 0 then
		return false, "Expected a non-empty v1 scene array."
	end

	local parentTarget = StarterGui
	if targetMode == "Selected" then
		local selected = Selection:Get()
		if selected[1] then
			parentTarget = selected[1]
		else
			return false, "No instance selected in Explorer."
		end
	end

	local recordingId = nil
	if ChangeHistoryService.TryBeginRecording then
		local beginOk, id = pcall(function()
			return ChangeHistoryService:TryBeginRecording("RobloxGuiMakerImport", "Import Roblox GUI Maker Scene")
		end)
		if beginOk then
			recordingId = id
		end
	end

	local createdById = {}
	local orderedNodes = {}

	for _, rawNode in ipairs(scene) do
		if type(rawNode) == "table" and VALID_CLASSES[rawNode.cls] and type(rawNode.id) == "string" then
			local inst = Instance.new(rawNode.cls)
			inst.Name = type(rawNode.name) == "string" and rawNode.name ~= "" and rawNode.name or rawNode.cls

			if inst:IsA("ScreenGui") then
				inst.ResetOnSpawn = false
				inst.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
				if rawNode.initialVisible == false then
					inst.Enabled = false
				end
			elseif inst:IsA("GuiObject") then
				inst.Position = makeUDim2(rawNode.pos, rawNode.posOffset)
				inst.Size = makeUDim2(rawNode.size, rawNode.sizeOffset)
				if type(rawNode.anchor) == "table" then
					inst.AnchorPoint = Vector2.new(tonumber(rawNode.anchor.x) or 0, tonumber(rawNode.anchor.y) or 0)
				end
				inst.BackgroundColor3 = hexToColor3(rawNode.color)
				inst.BackgroundTransparency = tonumber(rawNode.transparency) or 0
				inst.BorderSizePixel = 0
				inst.ZIndex = math.round(tonumber(rawNode.zindex) or 1)
				if rawNode.rotation then
					inst.Rotation = tonumber(rawNode.rotation) or 0
				end
				if rawNode.layoutOrder then
					inst.LayoutOrder = math.round(tonumber(rawNode.layoutOrder) or 0)
				end
				if rawNode.initialVisible == false then
					inst.Visible = false
				end
				if inst:IsA("TextLabel") or inst:IsA("TextButton") or inst:IsA("TextBox") then
					inst.Text = type(rawNode.text) == "string" and rawNode.text or ""
					inst.TextColor3 = hexToColor3(rawNode.textColor or "#ffffff")
					inst.TextSize = math.round(tonumber(rawNode.textSize) or 16)
					inst.Font = FONT_MAP[rawNode.font] or Enum.Font.GothamMedium
					inst.TextScaled = rawNode.textScaled == true
					inst.TextWrapped = rawNode.textWrapped == true
				end
				if inst:IsA("ImageLabel") then
					if type(rawNode.image) == "string" then
						inst.Image = rawNode.image
					end
					if type(rawNode.imageColor) == "string" then
						inst.ImageColor3 = hexToColor3(rawNode.imageColor)
					end
				end
			end

			if type(rawNode.cornerRadius) == "number" and rawNode.cornerRadius > 0 and not inst:IsA("ScreenGui") then
				local corner = Instance.new("UICorner")
				corner.CornerRadius = UDim.new(0, math.round(rawNode.cornerRadius))
				corner.Parent = inst
			end

			if type(rawNode.stroke) == "table" and not inst:IsA("ScreenGui") then
				local stroke = Instance.new("UIStroke")
				stroke.Color = hexToColor3(rawNode.stroke.color or "#ffffff")
				stroke.Thickness = tonumber(rawNode.stroke.thickness) or 1
				stroke.Transparency = tonumber(rawNode.stroke.transparency) or 0
				stroke.Parent = inst
			end

			if type(rawNode.gradient) == "table" and type(rawNode.gradient.stops) == "table" and #rawNode.gradient.stops >= 2 and not inst:IsA("ScreenGui") then
				local keypoints = {}
				for _, stop in ipairs(rawNode.gradient.stops) do
					if type(stop) == "table" then
						local t = math.clamp(tonumber(stop.at) or 0, 0, 1)
						table.insert(keypoints, ColorSequenceKeypoint.new(t, hexToColor3(stop.color)))
					end
				end
				if #keypoints >= 2 then
					local grad = Instance.new("UIGradient")
					grad.Color = ColorSequence.new(keypoints)
					grad.Rotation = tonumber(rawNode.gradient.rotation) or 0
					grad.Parent = inst
				end
			end

			if rawNode.layout == "list" then
				local listLayout = Instance.new("UIListLayout")
				listLayout.SortOrder = Enum.SortOrder.LayoutOrder
				listLayout.Padding = UDim.new(0, 8)
				listLayout.Parent = inst
			elseif rawNode.layout == "grid" then
				local gridLayout = Instance.new("UIGridLayout")
				gridLayout.SortOrder = Enum.SortOrder.LayoutOrder
				-- gridLayout is computed by the web editor so cells land where the
				-- canvas draws them; older JSON without it keeps Roblox defaults.
				local computed = rawNode.gridLayout
				if type(computed) == "table" and type(computed.cellSize) == "table" and type(computed.cellPadding) == "table" then
					gridLayout.CellSize = makeUDim2(computed.cellSize.scale, computed.cellSize.offset)
					gridLayout.CellPadding = makeUDim2(computed.cellPadding.scale, computed.cellPadding.offset)
					local maxCells = tonumber(computed.maxCells)
					if maxCells and maxCells > 0 then
						gridLayout.FillDirectionMaxCells = math.floor(maxCells)
					end
				end
				gridLayout.Parent = inst
			end

			if type(rawNode.padding) == "number" and rawNode.padding > 0 then
				local pad = Instance.new("UIPadding")
				local u = UDim.new(0, math.round(rawNode.padding))
				pad.PaddingTop = u
				pad.PaddingBottom = u
				pad.PaddingLeft = u
				pad.PaddingRight = u
				pad.Parent = inst
			end

			if type(rawNode.aspectRatio) == "number" and rawNode.aspectRatio > 0 and not inst:IsA("ScreenGui") then
				local ratio = Instance.new("UIAspectRatioConstraint")
				ratio.AspectRatio = rawNode.aspectRatio
				ratio.Parent = inst
			end

			if (type(rawNode.minSize) == "table" or type(rawNode.maxSize) == "table") and not inst:IsA("ScreenGui") then
				local limit = Instance.new("UISizeConstraint")
				if type(rawNode.minSize) == "table" then
					limit.MinSize = Vector2.new(tonumber(rawNode.minSize.x) or 0, tonumber(rawNode.minSize.y) or 0)
				end
				if type(rawNode.maxSize) == "table" then
					limit.MaxSize = Vector2.new(tonumber(rawNode.maxSize.x) or math.huge, tonumber(rawNode.maxSize.y) or math.huge)
				end
				limit.Parent = inst
			end

			createdById[rawNode.id] = inst
			table.insert(orderedNodes, { raw = rawNode, inst = inst })
		end
	end

	local roots = {}
	for _, entry in ipairs(orderedNodes) do
		local parentId = entry.raw.parentId
		local resolvedParent = (type(parentId) == "string" and createdById[parentId]) or nil
		if resolvedParent then
			entry.inst.Parent = resolvedParent
		else
			entry.inst.Parent = parentTarget
			table.insert(roots, entry.inst)
		end
	end

	if #roots > 0 then
		Selection:Set(roots)
	end

	if recordingId and ChangeHistoryService.FinishRecording then
		pcall(function()
			ChangeHistoryService:FinishRecording(recordingId, Enum.FinishRecordingOperation.Commit)
		end)
	else
		pcall(function()
			ChangeHistoryService:SetWaypoint("RobloxGuiMakerImport")
		end)
	end

	return true, string.format("Built %d GUI instance(s) in %s.", #orderedNodes, parentTarget.Name)
end

buildButton.MouseButton1Click:Connect(function()
	local success, message = buildSceneFromJson(jsonBox.Text)
	if success then
		statusLabel.TextColor3 = Color3.fromRGB(76, 221, 177)
	else
		statusLabel.TextColor3 = Color3.fromRGB(248, 113, 113)
	end
	statusLabel.Text = message
end)

toggleButton.Click:Connect(function()
	widget.Enabled = not widget.Enabled
end)
