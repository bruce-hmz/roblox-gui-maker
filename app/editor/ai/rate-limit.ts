// Abuse guards for /api/generate-gui: per-IP hourly/daily sliding windows and
// a per-instance daily generation budget (cost circuit breaker). State is
// in-memory — on serverless each instance guards itself, which is the
// documented MVP tradeoff (a shared store arrives with the P1 gallery work).

export type GuardConfig = {
  hourLimit: number;
  dayLimit: number;
  dailyBudget: number; // 0 = unlimited
};

export type GuardState = {
  perIp: Map<string, { hourWindowStart: number; hourCount: number; dayWindowStart: number; dayCount: number }>;
  budgetDate: string;
  budgetCount: number;
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function createGuardState(): GuardState {
  return { perIp: new Map(), budgetDate: todayKey(new Date()), budgetCount: 0 };
}

function todayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export type GuardVerdict =
  | { ok: true }
  | { ok: false; reason: "rate_limited" | "budget_exhausted"; retryAfterSeconds: number };

// Check + record in one step so a pass always consumes quota atomically.
export function checkAndRecord(
  state: GuardState,
  ip: string,
  config: GuardConfig,
  now: Date = new Date()
): GuardVerdict {
  const nowMs = now.getTime();

  // Daily budget resets on the UTC date rollover.
  if (state.budgetDate !== todayKey(now)) {
    state.budgetDate = todayKey(now);
    state.budgetCount = 0;
  }
  if (config.dailyBudget > 0 && state.budgetCount >= config.dailyBudget) {
    const tomorrow = new Date(nowMs + DAY_MS);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return {
      ok: false,
      reason: "budget_exhausted",
      retryAfterSeconds: Math.max(60, Math.ceil((tomorrow.getTime() - nowMs) / 1000)),
    };
  }

  const entry = state.perIp.get(ip) ?? {
    hourWindowStart: nowMs,
    hourCount: 0,
    dayWindowStart: nowMs,
    dayCount: 0,
  };
  if (nowMs - entry.hourWindowStart >= HOUR_MS) {
    entry.hourWindowStart = nowMs;
    entry.hourCount = 0;
  }
  if (nowMs - entry.dayWindowStart >= DAY_MS) {
    entry.dayWindowStart = nowMs;
    entry.dayCount = 0;
  }

  if (entry.hourCount >= config.hourLimit || entry.dayCount >= config.dayLimit) {
    state.perIp.set(ip, entry); // record nothing new, but keep windows fresh
    const retryHour = Math.ceil((entry.hourWindowStart + HOUR_MS - nowMs) / 1000);
    const retryDay = Math.ceil((entry.dayWindowStart + DAY_MS - nowMs) / 1000);
    return {
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: Math.max(60, Math.min(retryHour, retryDay)),
    };
  }

  entry.hourCount += 1;
  entry.dayCount += 1;
  state.budgetCount += 1;
  state.perIp.set(ip, entry);

  // Opportunistic cleanup: drop entries whose day window expired.
  if (state.perIp.size > 5000) {
    for (const [key, value] of state.perIp) {
      if (nowMs - value.dayWindowStart >= DAY_MS) state.perIp.delete(key);
    }
  }
  return { ok: true };
}

export function guardConfigFromEnv(
  env: Record<string, string | undefined>
): GuardConfig {
  const parse = (value: string | undefined, fallback: number) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  return {
    hourLimit: parse(env.AI_RATE_HOUR, 8),
    dayLimit: parse(env.AI_RATE_DAY, 25),
    dailyBudget: parse(env.AI_DAILY_BUDGET, 1500),
  };
}
