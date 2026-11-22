import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./track";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("trackEvent", () => {
  it("is a safe no-op when window is undefined (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(() => trackEvent("page_action", { locale: "en" })).not.toThrow();
  });

  it("forwards events to both window.gtag and window.pvuv", () => {
    const gtag = vi.fn();
    const pvuv = vi.fn();
    vi.stubGlobal("window", { gtag, pvuv });

    trackEvent("ai_generate_success", {
      screenType: "Shop",
      locale: "en",
      count: 2,
      cached: false,
    });

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "ai_generate_success", {
      screenType: "Shop",
      locale: "en",
      count: 2,
      cached: false,
    });
    expect(pvuv).toHaveBeenCalledTimes(1);
    expect(pvuv).toHaveBeenCalledWith("event", "ai_generate_success", {
      screenType: "Shop",
      locale: "en",
      count: 2,
      cached: false,
    });
  });

  it("strips undefined values for pvuv and passes undefined when empty", () => {
    const gtag = vi.fn();
    const pvuv = vi.fn();
    vi.stubGlobal("window", { gtag, pvuv });

    trackEvent("partial_params", { kept: "ok", dropped: undefined });
    expect(pvuv).toHaveBeenNthCalledWith(1, "event", "partial_params", {
      kept: "ok",
    });

    trackEvent("only_undefined", { a: undefined, b: undefined });
    expect(pvuv).toHaveBeenNthCalledWith(
      2,
      "event",
      "only_undefined",
      undefined
    );

    trackEvent("no_params");
    expect(pvuv).toHaveBeenNthCalledWith(3, "event", "no_params", undefined);
  });

  it("is a safe no-op when gtag and pvuv are absent", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("export_luau", { format: "luau" })).not.toThrow();
  });

  it("isolates errors so a failing provider never throws or blocks the other", () => {
    const gtagOk = vi.fn();
    const pvuvThrow = vi.fn(() => {
      throw new Error("pvuv boom");
    });
    vi.stubGlobal("window", { gtag: gtagOk, pvuv: pvuvThrow });

    expect(() =>
      trackEvent("begin_checkout", { plan: "pro_all_access" })
    ).not.toThrow();
    expect(gtagOk).toHaveBeenCalledTimes(1);
    expect(pvuvThrow).toHaveBeenCalledTimes(1);

    const gtagThrow = vi.fn(() => {
      throw new Error("gtag boom");
    });
    const pvuvOk = vi.fn();
    vi.stubGlobal("window", { gtag: gtagThrow, pvuv: pvuvOk });

    expect(() =>
      trackEvent("begin_checkout", { plan: "pro_all_access" })
    ).not.toThrow();
    expect(gtagThrow).toHaveBeenCalledTimes(1);
    expect(pvuvOk).toHaveBeenCalledTimes(1);
  });
});
