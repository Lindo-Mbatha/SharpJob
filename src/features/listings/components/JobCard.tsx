import React from "react";
import { Banknote, Bookmark, Briefcase, Calendar, CheckCircle, ChevronRight, MapPin, Trash2 } from "lucide-react";
import { Job } from "../types";
import { displayOrFallback, getCategoryStyles } from "../utils";

type JobCardVariant = "default" | "saved";

// Extract just the salary range, removing metadata like "per annum", "level", etc
function extractSalaryPreview(salary: string): string {
  if (!salary) return "";
  const keywords = [" per ", " annum", " level", ", level"];
  let result = salary;
  
  for (const keyword of keywords) {
    const idx = result.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      result = result.substring(0, idx).trim();
      break;
    }
  }
  
  return result;
}

// Normalize noisy employment descriptions into a compact preview label.
function validateEmploymentType(type: string): string {
  if (!type) return "Unspecified";

  const normalized = type.toLowerCase().trim();
  const contains = (keywords: string[]) => keywords.some(keyword => normalized.includes(keyword));

  if (contains(["internship", "intern ", "intern-"])) return "Internship";
  if (contains(["part-time", "part time"])) return "Part-time";
  if (contains(["remote", "work from home", "wfh"])) return "Remote";
  if (contains(["hybrid"])) return "Hybrid";
  if (contains(["contract", "fixed-term", "fixed term", "temporary"])) return "Contract";
  if (contains(["permanent", "full-time", "full time"])) return "Permanent";

  return "Unspecified";
}

export function JobCard({
  job,
  darkMode,
  activeAccentText,
  variant = "default",
  onSelect,
  onToggleSave
}: {
  job: Job;
  darkMode: boolean;
  activeAccentText: string;
  variant?: JobCardVariant;
  onSelect: (job: Job) => void;
  onToggleSave: (jobId: string, event: React.MouseEvent) => void;
}) {
  const catStyle = getCategoryStyles(job.category);
  const CatIcon = catStyle.icon;

  return (
    <div
      onClick={() => onSelect(job)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(job);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View job: ${job.title} at ${job.company}`}
      className={`rounded-xl border p-4 transition-all duration-200 group cursor-pointer ${
        variant === "saved" ? "relative" : ""
      } ${
        darkMode
          ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          : "bg-white border-slate-200/60 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden ${catStyle.bg}`}>
          {job.companyLogoUrl ? (
            <img
              src={job.companyLogoUrl}
              alt={job.company}
              className="w-full h-full object-contain p-1"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; (e.currentTarget.nextSibling as HTMLElement | null)?.removeAttribute("hidden"); }}
            />
          ) : null}
          <span hidden={Boolean(job.companyLogoUrl)}><CatIcon className="h-5 w-5" /></span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
            {job.title}
          </h4>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {job.company}
          </p>
        </div>

              {variant === "saved" ? (
                <button
                  onClick={(e) => onToggleSave(job.id, e)}
                  aria-label={`Remove ${job.title} from saved jobs`}
                  className="touch-target p-1.5 rounded-full transition-colors shrink-0 text-red-500 bg-red-50/50 hover:bg-red-100/50"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              ) : (
                <button
                  onClick={(e) => onToggleSave(job.id, e)}
                  aria-label={job.isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
                  className={`touch-target p-1.5 rounded-full transition-colors shrink-0 ${
                    job.isSaved
                      ? `${activeAccentText} bg-rose-50/50`
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Bookmark className="h-4.5 w-4.5 fill-current" style={{ fillOpacity: job.isSaved ? 1 : 0 }} />
                </button>
              )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-0.5 text-[11px] text-slate-500 select-none">
        <div className="flex items-start gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span className="line-clamp-2 leading-snug">{displayOrFallback(job.location.split("(")[0].trim())}</span>
        </div>
        <div className="flex items-start gap-1 justify-center">
          <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span className="line-clamp-2 leading-snug text-center">{validateEmploymentType(job.type)}</span>
        </div>
        <div className="flex items-start gap-1 justify-end font-medium text-slate-600 dark:text-slate-400">
          <Banknote className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span className="line-clamp-2 leading-snug text-right">{displayOrFallback(extractSalaryPreview(job.salary))}</span>
        </div>
      </div>

      <div className={`border-t my-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />

      <div className="flex items-center justify-between gap-2">
        {job.isApplied ? (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-fade-in">
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="truncate">Applied{job.appliedDate ? ` · ${job.appliedDate}` : ""}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500 text-[10px] font-medium uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" />
            <span>{job.closes ? `Closes ${job.closes.split(",")[0]}` : "Closing date not provided"}</span>
          </div>
        )}
        <span className={`text-[11px] font-semibold flex items-center gap-0.5 shrink-0 ${activeAccentText}`}>
          Details
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
