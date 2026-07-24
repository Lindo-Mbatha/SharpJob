import { describe, expect, it } from "vitest";
import { deriveApplyUrl, getActiveSavedJobs, getPreviousSavedListings, getVisiblePageChips } from "./utils";
import { Job } from "./types";

const baseJob: Job = {
  id: "job-base",
  title: "Product Designer",
  company: "Airbnb",
  category: "Design",
  location: "Cape Town",
  type: "Full-time",
  salary: "R90k-R130k",
  closes: "2050-01-01",
  description: "Design product flows",
  responsibilities: ["Ship features"],
  requirements: ["Figma"],
  companyBio: "Great company",
  isSaved: true
};

describe("listings utils", () => {
  it("builds compact page chips with ellipsis", () => {
    expect(getVisiblePageChips(2, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getVisiblePageChips(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("derives known and fallback apply URLs", () => {
    expect(deriveApplyUrl(baseJob)).toBe("https://careers.airbnb.com/");

    const unknownCompanyJob: Job = {
      ...baseJob,
      company: "Unknown Corp",
      title: "Backend Developer"
    };

    const fallback = deriveApplyUrl(unknownCompanyJob);
    expect(fallback).toContain("https://www.google.com/search?q=");
    expect(decodeURIComponent(fallback)).toContain("Unknown Corp Backend Developer careers apply");
  });

  it("separates active saved jobs from previous listings window", () => {
    const nowMs = new Date("2000-01-15T12:00:00").getTime();
    const jobs: Job[] = [
      { ...baseJob, id: "active", closes: "2000-01-20" },
      { ...baseJob, id: "previous", closes: "2000-01-01" },
      { ...baseJob, id: "expired", closes: "1999-11-01" }
    ];

    const activeSaved = getActiveSavedJobs(jobs, nowMs);
    const previousSaved = getPreviousSavedListings(jobs, nowMs);

    expect(activeSaved.map((j) => j.id)).toEqual(["active"]);
    expect(previousSaved.map((entry) => entry.job.id)).toEqual(["previous"]);
    expect(previousSaved[0].daysUntilArchive).toBeGreaterThan(0);
  });
});
