import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Job } from "../listings/types";
import { JobDetailsDrawer } from "./JobDetailsDrawer";

function buildJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "job-1",
    title: "Frontend Engineer",
    company: "Acme",
    category: "Engineering",
    location: "Cape Town",
    type: "Full-time",
    salary: "R80k - R100k",
    closes: "In 7 days",
    datePosted: "Jul 25, 2026",
    description: "Build modern UI systems",
    responsibilities: ["Ship components"],
    requirements: ["5+ years React"],
    companyBio: "Acme builds tools.",
    isSaved: true,
    isApplied: false,
    ...overrides
  };
}

describe("JobDetailsDrawer", () => {
  it("fires save, apply, share, and applied confirmation actions", () => {
    const onBack = vi.fn();
    const onToggleSave = vi.fn();
    const onApplyOutbound = vi.fn();
    const onShare = vi.fn();
    const onConfirmApplied = vi.fn();
    const selectedJob = buildJob();

    render(
      <JobDetailsDrawer
        darkMode={false}
        activeAccentText="text-blue-600"
        activeAccentPrimary="bg-blue-600"
        selectedJob={selectedJob}
        openingJobId={null}
        onBack={onBack}
        onToggleSave={onToggleSave}
        onApplyOutbound={onApplyOutbound}
        onShare={onShare}
        onConfirmApplied={onConfirmApplied}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /remove from saved/i }));
    expect(onToggleSave).toHaveBeenCalledWith("job-1");

    fireEvent.click(screen.getByRole("button", { name: /apply on company site/i }));
    expect(onApplyOutbound).toHaveBeenCalledWith(selectedJob, "apply");

    fireEvent.click(screen.getByRole("button", { name: /share this role/i }));
    expect(onShare).toHaveBeenCalledWith(selectedJob);

    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onConfirmApplied).toHaveBeenNthCalledWith(1, true);
    expect(onConfirmApplied).toHaveBeenNthCalledWith(2, false);
  });
});
