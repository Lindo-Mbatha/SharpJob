import React from "react";
import { Briefcase } from "lucide-react";
import { JobCard } from "../listings/components/JobCard";
import { PaginationControls } from "../listings/components/PaginationControls";
import { Job } from "../listings/types";

export function HomeTabScreen({
  darkMode,
  logoSrc,
  activeAccentText,
  activeAccentPrimary,
  activeJobsCount,
  homeJobsPage,
  safeHomePage,
  homeTotalPages,
  onSelectJob,
  onToggleSave,
  onPreviousPage,
  onNextPage,
  onSelectPage,
  onRefresh
}: {
  darkMode: boolean;
  logoSrc: string;
  activeAccentText: string;
  activeAccentPrimary: string;
  activeJobsCount: number;
  homeJobsPage: Job[];
  safeHomePage: number;
  homeTotalPages: number;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, event: React.MouseEvent) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSelectPage: (page: number) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="p-5 space-y-5 flex-1 flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="SharpJob logo"
              className="h-8 w-8 rounded-lg shrink-0 object-cover"
            />
            <div className="leading-none">
              <span className={`block font-semibold text-[15px] tracking-tight ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                SharpJob
              </span>
              <span className="mt-1 block text-[8px] font-medium tracking-wide text-slate-400">
                by Player99 Inc
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Find your dream job
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {activeJobsCount} jobs available for you.
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {homeJobsPage.length > 0 ? (
          <>
            {homeJobsPage.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                darkMode={darkMode}
                activeAccentText={activeAccentText}
                onSelect={onSelectJob}
                onToggleSave={onToggleSave}
              />
            ))}

            <PaginationControls
              darkMode={darkMode}
              activeAccentPrimary={activeAccentPrimary}
              currentPage={safeHomePage}
              totalPages={homeTotalPages}
              onPrevious={onPreviousPage}
              onNext={onNextPage}
              onPageSelect={onSelectPage}
            />
          </>
        ) : (
          <div className="py-16 text-center text-slate-400">
            <Briefcase className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No active listings right now</p>
            <p className="text-xs text-slate-500 mt-1">New roles are posted regularly — check back soon.</p>
            <button
              onClick={onRefresh}
              className={`mt-4 text-xs font-semibold px-4 py-2 rounded-lg text-white ${activeAccentPrimary}`}
            >
              Refresh listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
