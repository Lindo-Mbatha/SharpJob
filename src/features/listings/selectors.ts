import { Job, PreviousSavedListing } from "./types";

export function paginateItems<T>(items: T[], page: number, perPage: number): {
  pageItems: T[];
  totalPages: number;
  safePage: number;
} {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    pageItems: items.slice(start, start + perPage),
    totalPages,
    safePage
  };
}

export function countAppliedJobs(jobs: Job[]): number {
  return jobs.filter(job => job.isApplied).length;
}

export function countSavedVisible(activeSavedJobs: Job[], previousSavedListings: PreviousSavedListing[]): number {
  return activeSavedJobs.length + previousSavedListings.length;
}

// Estimated on-device storage (in bytes) used by the cached Previous Listings snapshots.
export function getPreviousListingsStorageBytes(previousSavedListings: PreviousSavedListing[]): number {
  if (previousSavedListings.length === 0) return 0;
  try {
    return new TextEncoder().encode(JSON.stringify(previousSavedListings.map(entry => entry.job))).length;
  } catch {
    return 0;
  }
}
