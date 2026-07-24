import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Job } from "../../listings/types";
import { useApplyFlow } from "./useApplyFlow";

const selectedJob: Job = {
  id: "job-x",
  title: "Backend Developer",
  company: "Stripe",
  category: "Engineering",
  location: "Remote",
  type: "Full-time",
  salary: "R150,000 - R185,000",
  closes: "Oct 15, 2026",
  description: "Desc",
  responsibilities: ["Do work"],
  requirements: ["Know things"],
  companyBio: "Company bio"
};

afterEach(() => {
  vi.useRealTimers();
});

function Harness({ notify }: { notify: (message: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([selectedJob]);
  const flow = useApplyFlow({
    selectedJob,
    setJobs,
    triggerNotification: notify,
    applicantName: "Alex Mercer"
  });

  return (
    <div>
      <button onClick={flow.actions.handleMockUpload}>mock upload</button>
      <button onClick={flow.actions.handleRemoveResumeFromWizard}>remove resume</button>
      <button onClick={flow.actions.handleFinalSubmitApp}>submit app</button>
      <span data-testid="uploaded-resume">{flow.state.uploadedResume ?? "none"}</span>
      <span data-testid="is-submitting">{String(flow.state.isSubmittingApp)}</span>
      <span data-testid="confetti-active">{String(flow.state.confettiActive)}</span>
      <span data-testid="apply-step">{flow.state.applyStep}</span>
      <span data-testid="applied-flag">{String(Boolean(jobs[0]?.isApplied))}</span>
    </div>
  );
}

describe("useApplyFlow actions", () => {
  it("handles resume removal and final submission async lifecycle", () => {
    vi.useFakeTimers();
    const notify = vi.fn();

    render(<Harness notify={notify} />);

    fireEvent.click(screen.getByRole("button", { name: /remove resume/i }));
    expect(screen.getByTestId("uploaded-resume")).toHaveTextContent("none");
    expect(notify).toHaveBeenCalledWith("Removed resume from application drawer.");

    fireEvent.click(screen.getByRole("button", { name: /submit app/i }));
    expect(screen.getByTestId("is-submitting")).toHaveTextContent("true");

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByTestId("is-submitting")).toHaveTextContent("false");
    expect(screen.getByTestId("apply-step")).toHaveTextContent("4");
    expect(screen.getByTestId("confetti-active")).toHaveTextContent("true");
    expect(screen.getByTestId("applied-flag")).toHaveTextContent("true");

    expect(notify).toHaveBeenCalledWith(
      "Application submitted! stripe has received your resume for Backend Developer."
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId("confetti-active")).toHaveTextContent("false");
  });
});
