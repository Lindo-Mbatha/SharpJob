import React from "react";
import { Clock, Search, SlidersHorizontal, X } from "lucide-react";
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
  recentSearches,
  setExploreQuery,
  setExploreCategory,
  setExploreType,
  onOpenAdvancedSearch,
  onSelectJob,
  onToggleSave,
  onPreviousPage,
  onNextPage,
  onSelectPage,
  onResetFilters,
  onCommitSearch,
  onApplyRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches
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
  recentSearches: string[];
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
  onCommitSearch: (query: string) => void;
  onApplyRecentSearch: (query: string) => void;
  onRemoveRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
}) {
  const DRAG_ACTIVATION_THRESHOLD = 8;

  const dragStateRef = React.useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startScrollLeft: number;
    target: HTMLDivElement | null;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    target: null,
    moved: false
  });
  const suppressClickRef = React.useRef(false);

  const onHorizontalWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.currentTarget.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  };

  const onHorizontalPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.currentTarget;
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: target.scrollLeft,
      target,
      moved: false
    };
  };

  const onHorizontalPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || drag.target !== event.currentTarget) return;

    const deltaX = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(deltaX) < DRAG_ACTIVATION_THRESHOLD) {
      return;
    }

    if (!drag.moved) {
      drag.moved = true;
      suppressClickRef.current = true;
    }

    event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
    event.preventDefault();
  };

  const onHorizontalPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || drag.target !== event.currentTarget) return;

    dragStateRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startScrollLeft: 0,
      target: null,
      moved: false
    };
  };

  const onHorizontalClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  return (
    <div className="p-5 flex-1 flex flex-col gap-4 min-h-0">
      <div className="shrink-0">
        <h2 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Explore Jobs
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Search and discover your next adventure.
        </p>
      </div>

      <div className="space-y-2 select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={exploreQuery}
              onChange={e => setExploreQuery(e.target.value)}
              onBlur={e => onCommitSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  onCommitSearch(exploreQuery);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Search title, company, or location..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700 focus:ring-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300 focus:ring-slate-300"
              }`}
            />
            {exploreQuery && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <button
                  onClick={() => setExploreQuery("")}
                  aria-label="Clear job search"
                  className="touch-target text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onOpenAdvancedSearch}
            className={`touch-target p-2 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
              isAdvSearchApplied
                ? `${activeAccentText} bg-opacity-20 border-current shadow-sm ${darkMode ? "bg-slate-800" : "bg-slate-100"}`
                : (darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-100")
            }`}
            title="Advanced Search"
          >
            <SlidersHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>

        {recentSearches.length > 0 && (
          <div
            className="flex items-center gap-1.5 overflow-x-scroll overflow-y-hidden no-scrollbar py-0.5 cursor-grab active:cursor-grabbing"
            onWheel={onHorizontalWheel}
            onPointerDown={onHorizontalPointerDown}
            onPointerMove={onHorizontalPointerMove}
            onPointerUp={onHorizontalPointerEnd}
            onPointerCancel={onHorizontalPointerEnd}
            onClickCapture={onHorizontalClickCapture}
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x", overscrollBehaviorX: "contain" }}
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-1 shrink-0">Recent:</span>
            {recentSearches.map(term => (
              <span
                key={term}
                className={`flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 border transition-all ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <button onClick={() => onApplyRecentSearch(term)} aria-label={`Search for "${term}"`} className="flex items-center gap-1">
                  <Clock className="h-3 w-3 opacity-60 shrink-0" />
                  {term}
                </button>
                <button
                  onClick={() => onRemoveRecentSearch(term)}
                  aria-label={`Remove "${term}" from recent searches`}
                  className="touch-target opacity-50 hover:opacity-100 hover:text-red-500 shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={onClearRecentSearches}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 underline-offset-2 hover:underline shrink-0 ml-1"
            >
              Clear
            </button>
          </div>
        )}

        <div
          className="flex items-center gap-1.5 overflow-x-scroll overflow-y-hidden no-scrollbar py-1 cursor-grab active:cursor-grabbing"
          onWheel={onHorizontalWheel}
          onPointerDown={onHorizontalPointerDown}
          onPointerMove={onHorizontalPointerMove}
          onPointerUp={onHorizontalPointerEnd}
          onPointerCancel={onHorizontalPointerEnd}
          onClickCapture={onHorizontalClickCapture}
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x", overscrollBehaviorX: "contain" }}
        >
          {["All", "Accountant", "Admin", "Analyst", "Artisan", "Assistant", "Chef", "Clerk", "Construction", "Design", "Director", "Driver", "Engineering", "Finance", "Handyman", "Healthcare", "Human Resource", "Inspector", "Internship", "IT Support", "Learnership", "Logistics", "Manager", "Marketing", "Nurse", "Officer", "Sales", "Supervisor", "Surveyor", "Technician", "Teacher", "Trades"].map(cat => {
            const isSelected = exploreCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setExploreCategory(cat)}
                className={`touch-target px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 border transition-all ${
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

        <div
          className="flex items-center gap-1.5 overflow-x-scroll overflow-y-hidden no-scrollbar py-0.5 cursor-grab active:cursor-grabbing"
          onWheel={onHorizontalWheel}
          onPointerDown={onHorizontalPointerDown}
          onPointerMove={onHorizontalPointerMove}
          onPointerUp={onHorizontalPointerEnd}
          onPointerCancel={onHorizontalPointerEnd}
          onClickCapture={onHorizontalClickCapture}
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x", overscrollBehaviorX: "contain" }}
        >
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-1 shrink-0">Type:</span>
          {[
            { label: "All", value: "All" },
            { label: "Permanent", value: "Permanent" },
            { label: "Contract", value: "Contract" },
            { label: "Remote", value: "Remote" },
            { label: "Internship", value: "Internship" },
            { label: "Hybrid", value: "Hybrid" },
            { label: "Part-time", value: "Part-time" }
          ].map(({ label, value }) => {
            const isSelected = exploreType === value;
            return (
              <button
                key={value}
                onClick={() => setExploreType(value)}
                className={`touch-target px-2 py-0.5 rounded text-[10px] font-medium transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-slate-800 text-white border-b-2 border-slate-400"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
          <div className="space-y-4 pb-2">
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
          </div>
        </div>

        {filteredJobs.length > 0 && (
          <div className="pt-3 shrink-0">
            <PaginationControls
              darkMode={darkMode}
              activeAccentPrimary={activeAccentPrimary}
              currentPage={safeExplorePage}
              totalPages={exploreTotalPages}
              onPrevious={onPreviousPage}
              onNext={onNextPage}
              onPageSelect={onSelectPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
