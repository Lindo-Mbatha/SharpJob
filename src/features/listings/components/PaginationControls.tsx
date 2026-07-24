import { getVisiblePageChips } from "../utils";

export function PaginationControls({
  darkMode,
  activeAccentPrimary,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageSelect
}: {
  darkMode: boolean;
  activeAccentPrimary: string;
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageSelect: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={`pt-1 flex items-center justify-between gap-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
          currentPage === 1
            ? (darkMode ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-300")
            : (darkMode ? "border-slate-700 hover:bg-slate-900" : "border-slate-300 hover:bg-slate-50")
        }`}
      >
        Previous
      </button>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1">
        {getVisiblePageChips(currentPage, totalPages).map((chip, idx) => (
          chip === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-[11px] text-slate-400">...</span>
          ) : (
            <button
              key={`page-${chip}`}
              onClick={() => onPageSelect(chip)}
              className={`min-w-7 h-7 px-2 rounded-md text-[11px] font-semibold border transition-colors ${
                chip === currentPage
                  ? `${activeAccentPrimary} text-white border-transparent`
                  : (darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-900" : "border-slate-300 text-slate-600 hover:bg-slate-50")
              }`}
            >
              {chip}
            </button>
          )
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
          currentPage === totalPages
            ? (darkMode ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-300")
            : (darkMode ? "border-slate-700 hover:bg-slate-900" : "border-slate-300 hover:bg-slate-50")
        }`}
      >
        Next
      </button>
    </div>
  );
}
