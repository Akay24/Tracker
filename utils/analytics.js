import { addDaysToDateKey, compareDateKeys, toDateKey } from "./date";

export const MISTAKE_TYPES = [
  "wrong pattern",
  "edge case miss",
  "off by one",
  "optimization failure",
  "communication issue",
];

export const computeMistakeDistribution = (problemsById) => {
  const counts = Object.fromEntries(MISTAKE_TYPES.map((t) => [t, 0]));

  for (const p of Object.values(problemsById || {})) {
    for (const m of p.mistakes || []) {
      if (counts[m.type] !== undefined) counts[m.type] += 1;
    }
  }

  return counts;
};

export const computeWeakPatterns = (problemsById, { limit = 6, minProblems = 3 } = {}) => {
  const buckets = new Map();

  for (const p of Object.values(problemsById || {})) {
    const hasSignal =
      !!p.lastAttempted || Number(p.confidence || 0) > 0 || (Array.isArray(p.mistakes) && p.mistakes.length > 0);
    if (!hasSignal) continue;

    const key = p.pattern || "Unknown";
    if (!buckets.has(key)) buckets.set(key, { pattern: key, count: 0, confSum: 0, mistakes: 0 });
    const b = buckets.get(key);
    b.count += 1;
    b.confSum += Number(p.confidence || 0);
    b.mistakes += (p.mistakes || []).length;
  }

  return Array.from(buckets.values())
    .filter((b) => b.count >= minProblems)
    .map((b) => ({
      pattern: b.pattern,
      problemCount: b.count,
      avgConfidence: b.count ? b.confSum / b.count : 0,
      mistakes: b.mistakes,
      score: (b.count ? b.confSum / b.count : 0) + Math.min(2, b.mistakes / Math.max(1, b.count)),
    }))
    // Lower confidence + higher mistakes should bubble up
    .sort((a, b) => a.avgConfidence - b.avgConfidence || b.mistakes - a.mistakes)
    .slice(0, limit);
};

export const computeStreak = (activityByDate, todayKey = toDateKey()) => {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const k = addDaysToDateKey(todayKey, -i);
    const day = activityByDate?.[k];
    const hasWork = (day?.attempts || 0) + (day?.mocks || 0) + (day?.behavioral || 0) > 0;
    if (!hasWork) break;
    streak += 1;
  }
  return streak;
};

export const buildHeatmapDays = ({
  activityByDate,
  days = 84,
  endDateKey = toDateKey(),
  metric = "attempts",
} = {}) => {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const dateKey = addDaysToDateKey(endDateKey, -i);
    const v = activityByDate?.[dateKey]?.[metric] || 0;
    out.push({ dateKey, value: v });
  }
  return out;
};

export const computeReadiness = (problemsById) => {
  const ps = Object.values(problemsById || {});
  const total = ps.length;
  const sum = ps.reduce((s, p) => s + Number(p.confidence || 0), 0);
  const avg = total ? sum / total : 0;
  return { total, avgConfidence: avg, readinessPct: total ? Math.round((avg / 5) * 100) : 0 };
};

export const computeDueReviews = (problemsById, todayKey = toDateKey()) => {
  const due = [];
  for (const p of Object.values(problemsById || {})) {
    const next = p.revisitSchedule?.nextReviewDate;
    if (next && compareDateKeys(next, todayKey) <= 0) due.push(p.id);
  }
  // Oldest first
  return due.sort((a, b) => {
    const da = problemsById[a]?.revisitSchedule?.nextReviewDate || "9999-99-99";
    const db = problemsById[b]?.revisitSchedule?.nextReviewDate || "9999-99-99";
    return compareDateKeys(da, db);
  });
};
