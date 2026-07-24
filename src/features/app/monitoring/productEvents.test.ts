import { describe, expect, it, vi } from "vitest";
import {
  trackAdvancedSearchApplied,
  trackApplySubmitted,
  trackProfileSaved
} from "./productEvents";
import { trackEvent } from "./telemetry";

vi.mock("./telemetry", () => ({
  trackEvent: vi.fn()
}));

describe("product telemetry wrappers", () => {
  it("tracks apply_submitted with expected payload keys", () => {
    trackApplySubmitted({
      job_id: "job-1",
      company: "Airbnb",
      category: "Design",
      tab: "home"
    });

    expect(trackEvent).toHaveBeenCalledWith(
      "apply_submitted",
      expect.objectContaining({
        job_id: expect.any(String),
        company: expect.any(String),
        category: expect.any(String),
        tab: expect.any(String)
      })
    );
  });

  it("tracks profile_saved with expected payload keys", () => {
    trackProfileSaved({
      skills_count: 4,
      has_headline: true,
      has_location: true,
      strength: "Strong"
    });

    expect(trackEvent).toHaveBeenCalledWith(
      "profile_saved",
      expect.objectContaining({
        skills_count: expect.any(Number),
        has_headline: expect.any(Boolean),
        has_location: expect.any(Boolean),
        strength: expect.any(String)
      })
    );
  });

  it("tracks advanced_search_applied with expected payload keys", () => {
    trackAdvancedSearchApplied({
      keyword: "designer",
      location: "remote",
      experience: "mid",
      types_count: 2,
      min_salary_k: 120,
      date_posted: "Past week",
      skills_count: 3
    });

    expect(trackEvent).toHaveBeenCalledWith(
      "advanced_search_applied",
      expect.objectContaining({
        keyword: expect.any(String),
        location: expect.any(String),
        experience: expect.any(String),
        types_count: expect.any(Number),
        min_salary_k: expect.any(Number),
        date_posted: expect.any(String),
        skills_count: expect.any(Number)
      })
    );
  });
});
