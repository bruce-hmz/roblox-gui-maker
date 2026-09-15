import { afterEach, describe, expect, it, vi } from "vitest";
import type { SceneNode } from "./catalog";
import {
  ONBOARDING_COPY,
  ONBOARDING_SEEN_KEY,
  markOnboardingSeen,
  onboardingSeen,
  pickOnboardingNode,
} from "./onboarding";

const node = (over: Partial<SceneNode> & Pick<SceneNode, "id" | "cls">): SceneNode =>
  ({
    name: over.cls,
    pos: { x: 0, y: 0 },
    size: { x: 0.2, y: 0.08 },
    color: "#ffffff",
    transparency: 0,
    cornerRadius: 0,
    zindex: 1,
    ...over,
  }) as SceneNode;

describe("pickOnboardingNode", () => {
  it("prefers a TextLabel with text over everything else", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "panel", cls: "Frame" }),
      node({ id: "fill", cls: "Frame", name: "HealthBarFill" }),
      node({ id: "label", cls: "TextLabel", text: "HEALTH" }),
      node({ id: "btn", cls: "TextButton", text: "PLAY" }),
    ];
    expect(pickOnboardingNode(scene)?.id).toBe("label");
  });

  it("falls back to a text-bearing TextButton before bare labels and frames", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "panel", cls: "Frame" }),
      node({ id: "label", cls: "TextLabel" }), // no text
      node({ id: "btn", cls: "TextButton", text: "PLAY" }),
    ];
    expect(pickOnboardingNode(scene)?.id).toBe("btn");
  });

  it("skips structural, invisible, and zero-extent nodes", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "list", cls: "UIListLayout" }),
      node({ id: "grid", cls: "UIGridLayout" }),
      node({ id: "hidden", cls: "TextLabel", text: "X", initialVisible: false }),
      node({ id: "ghost", cls: "TextLabel", text: "X", transparency: 1 }),
      node({ id: "flat", cls: "TextLabel", text: "X", size: { x: 0.2, y: 0 } }),
      node({ id: "visible", cls: "TextLabel", text: "OK" }),
    ];
    expect(pickOnboardingNode(scene)?.id).toBe("visible");
  });

  it("falls back to a Frame when no text elements exist (HUD fills)", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "fill", cls: "Frame", name: "UltimateFill" }),
    ];
    expect(pickOnboardingNode(scene)?.id).toBe("fill");
  });

  it("breaks ties by document order within the same class", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "second", cls: "TextLabel", text: "B" }),
      node({ id: "first", cls: "TextLabel", text: "A" }),
    ];
    expect(pickOnboardingNode(scene)?.id).toBe("second");
  });

  it("returns null when nothing is safe to select", () => {
    expect(pickOnboardingNode([])).toBeNull();
    expect(
      pickOnboardingNode([
        node({ id: "root", cls: "ScreenGui" }),
        node({ id: "list", cls: "UIListLayout" }),
        node({ id: "hidden", cls: "Frame", initialVisible: false }),
      ])
    ).toBeNull();
  });
});

describe("onboarding seen flag", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is unread until marked, once per browser session", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
      },
    });
    expect(onboardingSeen()).toBe(false);
    markOnboardingSeen();
    expect(onboardingSeen()).toBe(true);
    expect(store.get(ONBOARDING_SEEN_KEY)).toBe("1");
  });

  it("treats blocked storage as already seen (never nag)", () => {
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
      },
    });
    expect(onboardingSeen()).toBe(true);
    expect(() => markOnboardingSeen()).not.toThrow();
  });
});

describe("ONBOARDING_COPY", () => {
  it("ships EN and ZH copy with the key activation message", () => {
    expect(ONBOARDING_COPY.en.title).toBe(
      "Your GUI is ready — click any element to edit it."
    );
    expect(ONBOARDING_COPY.en.hint).toBe("Try it: change the text or color.");
    expect(ONBOARDING_COPY.zh.title).toContain("点击任意元素即可开始编辑");
    expect(ONBOARDING_COPY.zh.hint).toContain("修改文字或颜色");
  });
});
