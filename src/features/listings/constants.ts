export const EXPERIENCE_SALARY_BANDS = {
  Entry: { min: 65, max: 145 },
  Mid: { min: 146, max: 325 },
  Senior: { min: 326, max: 465 },
  Executive: { min: 466, max: Number.POSITIVE_INFINITY }
} as const;

export const LISTINGS_PER_PAGE = 20;
export const MS_IN_DAY = 24 * 60 * 60 * 1000;
export const PREVIOUS_LISTING_RETENTION_DAYS = 30;
