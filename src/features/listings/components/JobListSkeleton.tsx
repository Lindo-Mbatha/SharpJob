export function JobCardSkeleton({ darkMode }: { darkMode: boolean }) {
  const shimmer = darkMode ? "bg-slate-800" : "bg-slate-200";

  return (
    <div
      className={`rounded-xl border p-4 animate-pulse ${
        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg shrink-0 ${shimmer}`} />
        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
          <div className={`h-3.5 rounded ${shimmer} w-3/5`} />
          <div className={`h-3 rounded ${shimmer} w-2/5`} />
        </div>
        <div className={`w-6 h-6 rounded-full shrink-0 ${shimmer}`} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-0.5">
        <div className={`h-3 rounded ${shimmer} w-4/5`} />
        <div className={`h-3 rounded ${shimmer} w-3/5 mx-auto`} />
        <div className={`h-3 rounded ${shimmer} w-4/5 ml-auto`} />
      </div>

      <div className={`border-t my-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />

      <div className="flex items-center justify-between gap-2">
        <div className={`h-3 rounded ${shimmer} w-1/3`} />
        <div className={`h-3 rounded ${shimmer} w-1/5`} />
      </div>
    </div>
  );
}

export function JobListSkeleton({ darkMode, count = 4 }: { darkMode: boolean; count?: number }) {
  const shimmer = darkMode ? "bg-slate-800" : "bg-slate-200";

  return (
    <div className="p-5 space-y-5 flex-1 flex flex-col">
      <p className="sr-only" aria-live="polite">Loading jobs…</p>

      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg animate-pulse shrink-0 ${shimmer}`} />
          <div className="space-y-1.5">
            <div className={`h-3 w-20 rounded animate-pulse ${shimmer}`} />
            <div className={`h-2 w-14 rounded animate-pulse ${shimmer}`} />
          </div>
        </div>

        <div className="space-y-2">
          <div className={`h-6 w-2/3 rounded animate-pulse ${shimmer}`} />
          <div className={`h-3 w-1/3 rounded animate-pulse ${shimmer}`} />
        </div>
      </div>

      <div className="space-y-4 flex-1" aria-hidden="true">
        {Array.from({ length: count }).map((_, index) => (
          <JobCardSkeleton key={index} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}
