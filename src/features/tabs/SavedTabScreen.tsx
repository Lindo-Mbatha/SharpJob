import React from "react";
import { Bookmark, ChevronDown } from "lucide-react";
import { PREVIOUS_LISTING_RETENTION_DAYS } from "../listings/constants";
import { JobCard } from "../listings/components/JobCard";
import { PaginationControls } from "../listings/components/PaginationControls";
import { Job, PreviousSavedListing } from "../listings/types";

export function SavedTabScreen({
  darkMode,
  activeAccentText,
  activeAccentPrimary,
  activeSavedJobs,
  savedJobsPage,
  safeSavedPage,
  savedTotalPages,
  previousSavedListings,
  showPreviousListings,
  onToggleShowPreviousListings,
  onSelectJob,
  onToggleSave,
  onPreviousPage,
  onNextPage,
  onSelectPage,
  onExploreListings,
  onExportListing
}: {
  darkMode: boolean;
  activeAccentText: string;
  activeAccentPrimary: string;
  activeSavedJobs: Job[];
  savedJobsPage: Job[];
  safeSavedPage: number;
  savedTotalPages: number;
  previousSavedListings: PreviousSavedListing[];
  showPreviousListings: boolean;
  onToggleShowPreviousListings: () => void;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, event: React.MouseEvent) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSelectPage: (page: number) => void;
  onExploreListings: () => void;
  onExportListing: (job: Job, archiveInfo: { closedDate: Date; expiresAt: Date }) => void;
}) {
  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Saved Jobs
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Keep track of roles you're interested in.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {activeSavedJobs.length > 0 ? (
          savedJobsPage.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              darkMode={darkMode}
              activeAccentText={activeAccentText}
              variant="saved"
              onSelect={onSelectJob}
              onToggleSave={onToggleSave}
            />
          ))
        ) : (
          <div className="py-16 text-center text-slate-400">
            <Bookmark className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No active saved jobs right now</p>
            <p className="text-xs text-slate-500 mt-1">
              {previousSavedListings.length > 0
                ? "Any closed roles are available below in Previous Listings for up to 30 days."
                : "Tap the bookmark icon on any job card to save roles you love."}
            </p>
            <button
              onClick={onExploreListings}
              className={`mt-4 text-xs font-semibold px-4 py-2 rounded-lg text-white ${activeAccentPrimary}`}
            >
              Explore Listings
            </button>
          </div>
        )}

        {activeSavedJobs.length > 0 && (
          <PaginationControls
            darkMode={darkMode}
            activeAccentPrimary={activeAccentPrimary}
            currentPage={safeSavedPage}
            totalPages={savedTotalPages}
            onPrevious={onPreviousPage}
            onNext={onNextPage}
            onPageSelect={onSelectPage}
          />
        )}

        <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}>
          <button
            type="button"
            onClick={onToggleShowPreviousListings}
            className={`w-full px-3 py-2.5 flex items-center justify-between text-left ${darkMode ? "hover:bg-slate-900" : "hover:bg-white"}`}
          >
            <div>
              <p className={`text-[12px] font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                Previous Listings
              </p>
              <p className="text-[10px] text-slate-500">
                Closed saved listings are kept here for {PREVIOUS_LISTING_RETENTION_DAYS} days.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${previousSavedListings.length > 0 ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-500"}`}>
                {previousSavedListings.length}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showPreviousListings ? "rotate-180" : ""} ${activeAccentText}`} />
            </div>
          </button>

          {showPreviousListings && (
            <div className={`px-3 pb-3 space-y-2 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              <div className={`mt-2 rounded-lg border px-2.5 py-2 text-[10px] font-semibold leading-relaxed ${darkMode ? "border-rose-900/60 bg-rose-950/40 text-rose-300" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                Warning: Closed listings are automatically removed from this section 30 days after the close date. Export any listing you may still need before it expires.
              </div>

              {previousSavedListings.length === 0 ? (
                <p className="text-[11px] text-slate-500 py-2">No closed listings in the 30-day retention window.</p>
              ) : previousSavedListings.map(({ job, closedDate, expiresAt, daysSinceClosed, daysUntilArchive }) => (
                <div
                  key={`previous-${job.id}`}
                  onClick={() => onSelectJob(job)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectJob(job);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View previous listing: ${job.title} at ${job.company}`}
                  className={`rounded-lg border p-2.5 cursor-pointer transition-colors ${darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12px] font-bold truncate ${darkMode ? "text-slate-100" : "text-slate-800"}`}>{job.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{job.company} • Closed {daysSinceClosed} day{daysSinceClosed === 1 ? "" : "s"} ago</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Closed on {closedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • expires in {daysUntilArchive} day{daysUntilArchive === 1 ? "" : "s"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportListing(job, { closedDate, expiresAt });
                      }}
                      aria-label={`Export ${job.title} as a text file`}
                      className={`shrink-0 px-2 py-1 rounded-md border text-[10px] font-bold transition-colors ${darkMode ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}
                    >
                      Export TXT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
