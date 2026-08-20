export const EXPERIENCE_SALARY_BANDS = {
  Entry: { min: 72000, max: 180000 },
  Low: { min: 120000, max: 240000 },
  Mid: { min: 216000, max: 420000 },
  Senior: { min: 360000, max: Number.POSITIVE_INFINITY }
} as const;

export const LISTINGS_PER_PAGE = 20;
export const MS_IN_DAY = 24 * 60 * 60 * 1000;
export const PREVIOUS_LISTING_RETENTION_DAYS = 30;

// The Advanced Search salary slider's floor. Left at this value it means
// "no salary preference" — jobs with no salary listed in the database still
// show up. Only once raised above this do salary-unknown jobs get excluded.
export const SALARY_FILTER_MIN = 1000;
export const SALARY_FILTER_MAX = 750000;
