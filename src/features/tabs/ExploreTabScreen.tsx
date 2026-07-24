import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { JobCard } from "../listings/components/JobCard";
import { PaginationControls } from "../listings/components/PaginationControls";
import { Job } from "../listings/types";

export function ExploreTabScreen({
  darkMode,
  activeAccentText,
  activeAccentPrimary,
  exploreQuery,
  exploreCategory,
  exploreType,
  isAdvSearchApplied,
  filteredJobs,
  exploreJobsPage,
  safeExplorePage,
  exploreTotalPages,
  setExploreQuery,
  setExploreCategory,
  setExploreType,
  onOpenAdvancedSearch,
  onSelectJob,
  onToggleSave,
  onPreviousPage,
  onNextPage,
  onSelectPage,
  onResetFilters
}: {
  darkMode: boolean;
  activeAccentText: string;
  activeAccentPrimary: string;
  exploreQuery: string;
  exploreCategory: string;
  exploreType: string;
  isAdvSearchApplied: boolean;
  filteredJobs: Job[];
  exploreJobsPage: Job[];
  safeExplorePage: number;
  exploreTotalPages: number;
  setExploreQuery: (value: string) => void;
  setExploreCategory: (value: string) => void;
  setExploreType: (value: string) => void;
  onOpenAdvancedSearch: () => void;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, event: React.MouseEvent) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSelectPage: (page: number) => void;
  onResetFilters: () => void;
}) {
  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Explore Jobs
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Search and discover your next adventure.
        </p>
      </div>

      <div className="space-y-2 select-none">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={exploreQuery}
              onChange={e => setExploreQuery(e.target.value)}
              placeholder="Search title, company, or location..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 focus:ring-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300 focus:ring-slate-300"
              }`}
            />
            {exploreQuery && (
              <button
                onClick={() => setExploreQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={onOpenAdvancedSearch}
            className={`p-2 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
              isAdvSearchApplied
                ? `${activeAccentText} bg-opacity-20 border-current shadow-sm ${darkMode ? "bg-slate-800" : "bg-slate-100"}`
                : (darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-100")
            }`}
            title="Advanced Search"
          >
            <SlidersHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {["All", "Design", "Engineering", "Marketing"].map(cat => {
            const isSelected = exploreCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setExploreCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-all ${
                  isSelected
                    ? `${activeAccentPrimary} border-transparent text-white`
                    : darkMode
                      ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-1">Type:</span>
          {["All", "Full-time", "Contract", "Remote", "Hybrid"].map(type => {
            const isSelected = exploreType === type;
            return (
              <button
                key={type}
                onClick={() => setExploreType(type)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  isSelected
                    ? "bg-slate-800 text-white border-b-2 border-slate-400"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {filteredJobs.length > 0 ? (
          exploreJobsPage.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              darkMode={darkMode}
              activeAccentText={activeAccentText}
              onSelect={onSelectJob}
              onToggleSave={onToggleSave}
            />
          ))
        ) : (
          <div className="py-12 text-center text-slate-400">
            <Search className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No results match filters</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your keywords or categories.</p>
            <button
              onClick={onResetFilters}
              className={`mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg border ${darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}
            >
              Reset Filters
            </button>
          </div>
        )}

        {filteredJobs.length > 0 && (
          <PaginationControls
            darkMode={darkMode}
            activeAccentPrimary={activeAccentPrimary}
            currentPage={safeExplorePage}
            totalPages={exploreTotalPages}
            onPrevious={onPreviousPage}
            onNext={onNextPage}
            onPageSelect={onSelectPage}
          />
        )}
      </div>
    </div>
  );
}
