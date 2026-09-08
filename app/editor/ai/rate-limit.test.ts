import { describe, expect, it } from "vitest";
import {
  checkAndRecord,
  createGuardState,
  guardConfigFromEnv,
} from "./rate-limit";

const config = { hourLimit: 2, dayLimit: 3, dailyBudget: 5 };

describe("checkAndRecord", () => {
  it("allows requests under both windows and budget", () => {
    const state = createGuardState();
    const t0 = new Date("2026-09-08T12:00:00Z");
    expect(checkAndRecord(state, "1.1.1.1", config, t0).ok).toBe(true);
    expect(checkAndRecord(state, "1.1.1.1", config, t0).ok).toBe(true);
    // Separate IP has its own windows.
    expect(checkAndRecord(state, "2.2.2.2", config, t0).ok).toBe(true);
  });

  it("blocks when the hourly limit is hit, then frees after the window", () => {
    const state = createGuardState();
    const t0 = new Date("2026-09-08T12:00:00Z");
    expect(checkAndRecord(state, "ip", config, t0).ok).toBe(true);
    expect(checkAndRecord(state, "ip", config, t0).ok).toBe(true);
    const blocked = checkAndRecord(state, "ip", config, t0);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.reason).toBe("rate_limited");
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
    const later = checkAndRecord(state, "ip", config, new Date(t0.getTime() + 61 * 60 * 1000));
    expect(later.ok).toBe(true);
  });

  it("enforces the daily per-IP cap across hour windows", () => {
    const state = createGuardState();
    const t0 = new Date("2026-09-08T12:00:00Z");
    checkAndRecord(state, "ip", config, t0);
    checkAndRecord(state, "ip", config, t0);
    checkAndRecord(state, "ip", config, new Date(t0.getTime() + 2 * 60 * 60 * 1000));
    const blocked = checkAndRecord(state, "ip", config, new Date(t0.getTime() + 3 * 60 * 60 * 1000));
    expect(blocked.ok).toBe(false);
  });

  it("trips the global budget and resets on UTC date rollover", () => {
    const state = createGuardState();
    const t0 = new Date("2026-09-08T12:00:00Z");
    for (let i = 0; i < 5; i++) {
      checkAndRecord(state, `ip-${i}`, config, t0);
    }
    const exhausted = checkAndRecord(state, "fresh-ip", config, t0);
    expect(exhausted.ok).toBe(false);
    if (!exhausted.ok) expect(exhausted.reason).toBe("budget_exhausted");
    const nextDay = checkAndRecord(state, "fresh-ip", config, new Date("2026-09-09T01:00:00Z"));
    expect(nextDay.ok).toBe(true);
  });

  it("treats dailyBudget 0 as unlimited", () => {
    const state = createGuardState();
    const unlimited = { hourLimit: 1000, dayLimit: 1000, dailyBudget: 0 };
    const t0 = new Date("2026-09-08T12:00:00Z");
    for (let i = 0; i < 50; i++) {
      expect(checkAndRecord(state, `ip-${i}`, unlimited, t0).ok).toBe(true);
    }
  });
});

describe("guardConfigFromEnv", () => {
  it("reads env with sane defaults", () => {
    expect(guardConfigFromEnv({})).toEqual({
      hourLimit: 8,
      dayLimit: 25,
      dailyBudget: 1500,
    });
    expect(
      guardConfigFromEnv({ AI_RATE_HOUR: "3", AI_RATE_DAY: "10", AI_DAILY_BUDGET: "40" })
    ).toEqual({ hourLimit: 3, dayLimit: 10, dailyBudget: 40 });
    expect(guardConfigFromEnv({ AI_RATE_HOUR: "abc" }).hourLimit).toBe(8);
  });
});
