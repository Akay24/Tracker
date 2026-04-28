import { addDaysToDateKey, toDateKey } from "./date";

export const REVIEW_INTERVALS_DAYS = [3, 7, 14];

export const clampConfidence = (n) => {
  const v = Number.isFinite(Number(n)) ? Number(n) : 0;
  return Math.max(0, Math.min(5, Math.round(v)));
};

export const calcNextReviewDateKey = ({
  confidence,
  mistakeCount = 0,
  fromDateKey = toDateKey(),
}) => {
  const c = clampConfidence(confidence);
  const mistakes = Math.max(0, Number(mistakeCount || 0));

  // Spec: revisit after 3 / 7 / 14 days.
  if (mistakes > 0 || c <= 1) return addDaysToDateKey(fromDateKey, 3);
  if (c <= 3) return addDaysToDateKey(fromDateKey, 7);
  return addDaysToDateKey(fromDateKey, 14);
};
