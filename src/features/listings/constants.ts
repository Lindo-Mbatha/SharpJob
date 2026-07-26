export const EXPERIENCE_SALARY_BANDS = {
  Entry: { min: 72, max: 180 },
  Low: { min: 120, max: 240 },
  Mid: { min: 216, max: 420 },
  Senior: { min: 360, max: Number.POSITIVE_INFINITY }
} as const;

export const LISTINGS_PER_PAGE = 20;
export const MS_IN_DAY = 24 * 60 * 60 * 1000;
export const PREVIOUS_LISTING_RETENTION_DAYS = 30;
