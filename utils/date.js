const pad2 = (n) => String(n).padStart(2, "0");

export const toDateKey = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export const parseDateKey = (dateKey) => {
  const [y, m, d] = String(dateKey).split("-").map((x) => Number(x));
  // Local midnight
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
};

export const addDaysToDateKey = (dateKey, days) => {
  const base = parseDateKey(dateKey);
  base.setDate(base.getDate() + Number(days || 0));
  return toDateKey(base);
};

export const compareDateKeys = (a, b) => {
  if (a === b) return 0;
  return a < b ? -1 : 1;
};

export const isDue = (nextReviewDateKey, todayKey = toDateKey()) => {
  if (!nextReviewDateKey) return false;
  return compareDateKeys(nextReviewDateKey, todayKey) <= 0;
};

export const daysBetween = (aDateKey, bDateKey) => {
  const a = parseDateKey(aDateKey);
  const b = parseDateKey(bDateKey);
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};
