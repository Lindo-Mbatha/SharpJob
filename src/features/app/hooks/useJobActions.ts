import { useState } from "react";
import { Job } from "../../listings/types";
import { deriveApplyUrl } from "../../listings/utils";
import { AppTab, ApplyOutboundMode } from "../types/domain";
import { captureRecoverableError } from "../monitoring/telemetry";

export function useJobActions({
  openingBlocked,
  selectedJob,
  setJobs,
  setSelectedJob,
  triggerNotification,
  switchTab
}: {
  openingBlocked?: boolean;
  selectedJob: Job | null;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
  triggerNotification: (message: string) => void;
  switchTab: (tab: AppTab) => void;
}) {
  const [openingJobId, setOpeningJobId] = useState<string | null>(null);

  const handleApplyOutbound = (job: Job, mode: ApplyOutboundMode = "apply") => {
    const url = deriveApplyUrl(job);

    const launch = (u: string): boolean => {
      try {
        const a = document.createElement("a");
        a.href = u;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return true;
      } catch (error) {
        captureRecoverableError(
          error,
          triggerNotification,
          "job_apply_outbound_launch",
          "Could not open the application page. Please try again."
        );
        return false;
      }
    };

    const openUrl = (u: string): boolean => {
      try {
        const w = window.open(u, "_blank", "noopener,noreferrer");
        if (!w) return launch(u);
        return true;
      } catch (error) {
        captureRecoverableError(
          error,
          triggerNotification,
          "job_apply_outbound_open",
          "Could not open the application page. Please try again."
        );
        return launch(u);
      }
    };

    if (mode === "reopen") {
      const opened = openUrl(url);
      if (!opened) return;
      triggerNotification(`Re-opening ${job.company}'s application page in your browser.`);
      return;
    }

    if (openingJobId || openingBlocked) return;
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    setOpeningJobId(job.id);
    const opened = openUrl(url);
    if (!opened) {
      setOpeningJobId(null);
      return;
    }

    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, isApplied: true, isSaved: true, appliedDate: todayStr } : j));
    setSelectedJob(prev => prev && prev.id === job.id ? { ...prev, isApplied: true, isSaved: true, appliedDate: todayStr } : prev);

    triggerNotification(`Opening ${job.company}'s application page in your browser — this role is now saved so you can track it from Saved.`);

    window.setTimeout(() => {
      setOpeningJobId(null);
      switchTab("saved");
    }, 650);
  };

  const confirmAppliedOnSite = (applied: boolean) => {
    if (!selectedJob) return;
    if (applied === Boolean(selectedJob.isApplied)) {
      triggerNotification(applied
        ? "Already marked as applied — nothing to change."
        : "Already marked as not applied — the role stays in Saved.");
      return;
    }

    const id = selectedJob.id;
    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const title = selectedJob.title;
    const company = selectedJob.company;
    const patch = (j: Job): Job => ({ ...j, isApplied: applied, appliedDate: applied ? todayStr : undefined, isSaved: true });

    setJobs(prev => prev.map(j => j.id === id ? patch(j) : j));
    setSelectedJob(prev => prev && prev.id === id ? patch(prev) : prev);

    triggerNotification(applied
      ? `Confirmed — "${title}" at ${company} is marked as applied. We'll surface recruiter updates on Alerts.`
      : `Marked "${title}" at ${company} as not applied. It stays in Saved so you can finish it on their site later.`);
  };

  const handleToggleSave = (jobId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();

    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          const newState = !job.isSaved;
          triggerNotification(
            newState
              ? `Saved "${job.title}" from ${job.company} to your bookmarks.`
              : `Removed "${job.title}" from your bookmarks.`
          );
          return { ...job, isSaved: newState };
        }
        return job;
      })
    );

    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    }
  };

  const exportListingToText = (job: Job, archiveInfo?: { closedDate: Date; expiresAt: Date }) => {
    try {
      const lines = [
        "SharpJob Listing Export",
        "======================",
        `Title: ${job.title}`,
        `Company: ${job.company}`,
        `Category: ${job.category}`,
        `Location: ${job.location}`,
        `Type: ${job.type}`,
        `Salary: ${job.salary}`,
        `Closes: ${job.closes}`,
        archiveInfo ? `Closed On: ${archiveInfo.closedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "",
        archiveInfo ? `Archived After: ${archiveInfo.expiresAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "",
        "",
        "Description",
        "-----------",
        job.description,
        "",
        "Responsibilities",
        "----------------",
        ...job.responsibilities.map((item, idx) => `${idx + 1}. ${item}`),
        "",
        "Requirements",
        "------------",
        ...job.requirements.map((item, idx) => `${idx + 1}. ${item}`),
        "",
        "Company Bio",
        "-----------",
        job.companyBio
      ].filter(Boolean);

      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      const objectUrl = URL.createObjectURL(blob);
      const safeBase = `${job.company}-${job.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 64) || "sharpjob-listing";

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${safeBase}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      triggerNotification(`Exported ${job.title} to a text file.`);
    } catch (error) {
      captureRecoverableError(
        error,
        triggerNotification,
        "job_export_listing",
        "Export failed. Please try again."
      );
    }
  };

  return {
    state: {
      openingJobId
    },
    actions: {
      handleApplyOutbound,
      confirmAppliedOnSite,
      handleToggleSave,
      exportListingToText
    }
  };
}
