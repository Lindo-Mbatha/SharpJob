import { describe, expect, it } from "vitest";
import { filterExploreJobs, ExploreSelectorInput } from "./selectors";
import { Job } from "../listings/types";

const NOW_MS = new Date("2026-08-20T12:00:00Z").getTime();

const baseInput: ExploreSelectorInput = {
  exploreQuery: "",
  exploreCategory: "All",
  isAdvSearchApplied: true,
  advKeyword: "",
  advLocation: "",
  advExp: null,
  advTypes: [],
  advSalaryMin: 1000,
  advDate: "Any time",
  advSkills: [],
  nowMs: NOW_MS
};

function makeJob(overrides: Partial<Job>): Job {
  return {
    id: "1",
    title: "Software Engineer",
    company: "Acme",
    category: "Engineering",
    location: "Cape Town",
    type: "Full-time",
    salary: "R135,000 - R160,000",
    closes: "Dec 1, 2049",
    datePosted: "Jan 1, 2026",
    description: "",
    responsibilities: [],
    requirements: [],
    companyBio: "",
    ...overrides
  };
}

describe("filterExploreJobs salary matching", () => {
  it("matches full comma-formatted salaries against a minimum threshold", () => {
    const jobs = [makeJob({ salary: "R135,000 - R160,000" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 130000 })).toHaveLength(1);
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 200000 })).toHaveLength(0);
  });

  it("resolves 'k' shorthand salaries to whole Rand amounts", () => {
    const jobs = [makeJob({ salary: "R90k - R130k" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 80000 })).toHaveLength(1);
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 130000 })).toHaveLength(1);
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 140000 })).toHaveLength(0);
  });

  it("does not hide a job with non-numeric salary text while the floor is left at its default", () => {
    // The floor's default value means "no salary preference" — real listings
    // with no usable salary figure shouldn't disappear just because Advanced
    // Search was opened and searched.
    const jobs = [makeJob({ salary: "Market related" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 1000 })).toHaveLength(1);
  });

  it("excludes jobs with non-numeric salary text once the floor is raised above the default", () => {
    const jobs = [makeJob({ salary: "Market related" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 200000 })).toHaveLength(0);
  });

  it("handles en-dash range separators without producing a bogus huge number", () => {
    const jobs = [makeJob({ salary: "R135,000 – R160,000" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 130000 })).toHaveLength(1);
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 200000 })).toHaveLength(0);
  });

  it("includes a job whose range straddles the selected floor, not just jobs whose minimum clears it", () => {
    // DB range is R450,000 - R650,000: the job's own minimum (450k) sits below
    // a 500k floor, but part of its range still reaches into the 500k-750k+ band.
    const jobs = [makeJob({ salary: "R450,000 - R650,000" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 500000 })).toHaveLength(1);
  });

  it("excludes a job whose entire range sits below the selected floor", () => {
    const jobs = [makeJob({ salary: "R300,000 - R450,000" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 500000 })).toHaveLength(0);
  });

  it("treats an open-ended salary ('R800,000+') as reaching any floor at or below it", () => {
    const jobs = [makeJob({ salary: "R800,000+" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 750000 })).toHaveLength(1);
  });

  // Real listings from the live database group thousands with a space, not a
  // comma — this was silently truncating every real salary at the first space.
  it("matches space-grouped thousands as used by the real job feed ('R237 453 per annum')", () => {
    const jobs = [makeJob({ salary: "R237 453 per annum" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 200000 })).toHaveLength(1);
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 300000 })).toHaveLength(0);
  });

  it("matches a space-grouped range with trailing metadata ('R413 001 - R486 501 per annum (Level 08)')", () => {
    const jobs = [makeJob({ salary: "R413 001 - R486 501 per annum (Level 08)" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 450000 })).toHaveLength(1);
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 500000 })).toHaveLength(0);
  });

  it("ignores small standalone numbers like years of experience or level codes", () => {
    const jobs = [makeJob({ salary: "R237 453 - R279 708 per annum (Level 05)" })];
    const [result] = filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 1000 });
    expect(result).toBeDefined();
  });

  it("does not hide real jobs with a blank or descriptive salary field while the floor is at its default", () => {
    // Confirmed against the live database: ~30 active jobs have an empty
    // salary_range, and several more use text like "Confirmed during the
    // application process". None of these should vanish just because
    // Advanced Search was applied with the salary control untouched.
    const jobs = [
      makeJob({ id: "a", salary: "" }),
      makeJob({ id: "b", salary: "Confirmed during the application process" }),
      makeJob({ id: "c", salary: "Not published; confirmed during the application process" })
    ];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 1000 })).toHaveLength(3);
  });

  it("excludes jobs with a blank or descriptive salary field once the floor is raised above the default", () => {
    const jobs = [
      makeJob({ id: "a", salary: "" }),
      makeJob({ id: "b", salary: "Confirmed during the application process" })
    ];
    expect(filterExploreJobs(jobs, { ...baseInput, advSalaryMin: 200000 })).toHaveLength(0);
  });
});

// ISO date-only strings parse as UTC midnight regardless of the host's local
// timezone, keeping these day-offset comparisons deterministic in CI.
const isoDaysAgo = (days: number) => new Date(NOW_MS - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const isoHoursAgo = (hours: number) => new Date(NOW_MS - hours * 60 * 60 * 1000).toISOString();

describe("filterExploreJobs date posted matching", () => {
  it("does not filter by date when 'Any time' is selected", () => {
    const jobs = [makeJob({ datePosted: "Jan 1, 2020" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advDate: "Any time" })).toHaveLength(1);
  });

  it("includes a job posted within the last 24 hours and excludes one posted 2 days ago", () => {
    const recent = makeJob({ id: "recent", datePosted: isoHoursAgo(2) });
    const stale = makeJob({ id: "stale", datePosted: isoDaysAgo(2) });
    const result = filterExploreJobs([recent, stale], { ...baseInput, advDate: "Past 24 hours" });
    expect(result.map(j => j.id)).toEqual(["recent"]);
  });

  it("includes jobs posted within the past week and excludes older ones", () => {
    const withinWeek = makeJob({ id: "within", datePosted: isoDaysAgo(5) });
    const overAWeek = makeJob({ id: "over", datePosted: isoDaysAgo(10) });
    const result = filterExploreJobs([withinWeek, overAWeek], { ...baseInput, advDate: "Past week" });
    expect(result.map(j => j.id)).toEqual(["within"]);
  });

  it("includes jobs posted within the past month and excludes older ones", () => {
    const withinMonth = makeJob({ id: "within", datePosted: isoDaysAgo(20) });
    const overAMonth = makeJob({ id: "over", datePosted: isoDaysAgo(45) });
    const result = filterExploreJobs([withinMonth, overAMonth], { ...baseInput, advDate: "Past month" });
    expect(result.map(j => j.id)).toEqual(["within"]);
  });

  it("excludes jobs with a missing or unparseable posted date when a specific window is selected", () => {
    const jobs = [makeJob({ datePosted: "" })];
    expect(filterExploreJobs(jobs, { ...baseInput, advDate: "Past week" })).toHaveLength(0);
  });

  it("excludes a future-dated job from a specific window", () => {
    const jobs = [makeJob({ datePosted: isoHoursAgo(-24) })];
    expect(filterExploreJobs(jobs, { ...baseInput, advDate: "Past week" })).toHaveLength(0);
  });
});
