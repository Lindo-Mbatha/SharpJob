import React from "react";
import { ArrowLeft, Bookmark, Calendar, Check, ExternalLink, Info, Loader2, Share2, ShieldAlert, X } from "lucide-react";
import { Job } from "../listings/types";
import { getCategoryStyles } from "../listings/utils";
import { ApplyOutboundMode } from "../app/types/domain";

const GOV_HOSTNAME_PATTERNS = [
  ".gov.za",
  "easternca pe.gov",
  "freestate.gov",
  "gauteng.gov",
  "kwazulunatal.gov",
  "kzn.gov",
  "limpopo.gov",
  "mpumalanga.gov",
  "northerncape.gov",
  "northwest.gov",
  "nw.gov",
  "westerncape.gov",
  "wcg.gov"
];

const GOV_URL_KEYWORDS = [
  "gov.za",
  "eastern-cape", "easterncape",
  "free-state", "freestate",
  "gauteng",
  "kwazulu-natal", "kwazulunatal", "kzn",
  "limpopo",
  "mpumalanga",
  "northern-cape", "northerncape",
  "north-west", "northwest",
  "western-cape", "westerncape", "wcg"
];

const isGovListing = (job: Job): boolean => {
  try {
    const url = new URL(job.applyUrl ?? "");
    const full = url.hostname + url.pathname;
    return GOV_HOSTNAME_PATTERNS.some(p => url.hostname.endsWith(p)) ||
      GOV_URL_KEYWORDS.some(k => full.toLowerCase().includes(k));
  } catch {
    return false;
  }
};

export function JobDetailsDrawer({
  darkMode,
  activeAccentText,
  activeAccentPrimary,
  selectedJob,
  openingJobId,
  onBack,
  onToggleSave,
  onApplyOutbound,
  onShare,
  onConfirmApplied,
  applyWizardSheet
}: {
  darkMode: boolean;
  activeAccentText: string;
  activeAccentPrimary: string;
  selectedJob: Job;
  openingJobId: string | null;
  onBack: () => void;
  onToggleSave: (jobId: string) => void;
  onApplyOutbound: (job: Job, mode: ApplyOutboundMode) => void;
  onShare: (job: Job) => void;
  onConfirmApplied: (applied: boolean) => void;
  applyWizardSheet?: React.ReactNode;
}) {
  const isGov = isGovListing(selectedJob);
  return (
    <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
    }`}>
      <div className={`h-12 px-4 flex items-center justify-between border-b shrink-0 ${
        darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
      }`}>
        <button onClick={onBack} className={`flex items-center gap-1 text-xs font-semibold ${activeAccentText}`}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
          {selectedJob.company}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(selectedJob.id)}
            className={`p-1.5 rounded-full ${selectedJob.isSaved ? "text-rose-500" : "text-slate-400"}`}
          >
            <Bookmark className="h-4 w-4 fill-current" style={{ fillOpacity: selectedJob.isSaved ? 1 : 0 }} />
          </button>
          <button
            onClick={() => onApplyOutbound(selectedJob, selectedJob.isApplied ? "reopen" : "apply")}
            className={`p-1.5 rounded-full transition-colors ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            title={selectedJob.isApplied ? "Re-open application in your browser" : "Apply on the company site"}
            aria-label={selectedJob.isApplied ? "Re-open application in your browser" : "Apply on the company site"}
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={() => onShare(selectedJob)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            aria-label="Share this role"
            title="Share this role"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-850">
          <div className={`mx-auto w-12 h-12 rounded-xl border flex items-center justify-center mb-2.5 ${
            getCategoryStyles(selectedJob.category).bg
          }`}>
            {React.createElement(getCategoryStyles(selectedJob.category).icon, { className: "h-6 w-6" })}
          </div>

          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
            darkMode ? "bg-slate-900 text-slate-300 border-slate-800" : "bg-slate-100 text-slate-700 border-slate-200"
          }`}>
            {selectedJob.category}
          </span>

          <h3 className={`text-lg font-bold mt-2 tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>{selectedJob.title}</h3>
          <p className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{selectedJob.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <span className={`block text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Location</span>
            <span className={`block text-[12px] font-bold leading-snug whitespace-normal break-words select-text ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{selectedJob.location}</span>
          </div>
          <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <span className={`block text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Salary Range</span>
            <span className={`block text-[12px] font-bold leading-snug whitespace-normal break-words select-text ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{selectedJob.salary}</span>
          </div>
          <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <span className={`block text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Employment Type</span>
            <span className={`block text-[12px] font-bold leading-snug whitespace-normal break-words select-text ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{selectedJob.type}</span>
          </div>
          <div className={`p-3 rounded-xl border flex flex-col gap-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-rose-50/60 border-rose-200"}`}>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 shrink-0" /> Deadline
            </span>
            <span className="block text-[12px] font-bold leading-snug whitespace-normal break-words select-text text-red-700 dark:text-red-400">{selectedJob.closes}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Job Overview</h4>
            <p className={`text-[13px] leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{selectedJob.description}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Key Responsibilities</h4>
            <ul className="space-y-1.5">
              {selectedJob.responsibilities.map((resp, i) => (
                <li key={i} className={`text-[13px] leading-relaxed flex items-start gap-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  <span className={`text-[14px] leading-[1.4] shrink-0 ${activeAccentText}`}>•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Requirements &amp; Qualifications</h4>
            <ul className="space-y-1.5">
              {selectedJob.requirements.map((req, i) => (
                <li key={i} className={`text-[13px] leading-relaxed flex items-start gap-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  <span className="text-red-500 dark:text-red-400 text-[14px] leading-[1.4] shrink-0">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5 pb-4">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>About {selectedJob.company}</h4>
            <p className={`text-[13px] leading-relaxed italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              &ldquo;{selectedJob.companyBio}&rdquo;
            </p>
          </div>

          {isGov && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
                Government job listings are independently aggregated from public sources. SharpJob is not a government entity.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={`p-3 border-t shrink-0 space-y-2 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"
      }`}>
        {selectedJob.isSaved && (
          <div className={`flex items-center justify-between gap-3 px-1 animate-fade-in ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            <span className="flex items-center gap-1.5 min-w-0">
              <Info className={`h-3.5 w-3.5 shrink-0 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate">Applied on their site?</span>
            </span>
            <div className={`inline-flex p-0.5 rounded-lg border shrink-0 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`} role="group" aria-label="Confirm whether you applied on the company site">
              <button
                type="button"
                onClick={() => onConfirmApplied(true)}
                aria-pressed={Boolean(selectedJob.isApplied)}
                className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-bold transition-all active:scale-95 ${
                  selectedJob.isApplied
                    ? "bg-emerald-600 text-white shadow-sm"
                    : darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                Yes
              </button>
              <button
                type="button"
                onClick={() => onConfirmApplied(false)}
                aria-pressed={!selectedJob.isApplied}
                className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-[11px] font-bold transition-all active:scale-95 ${
                  !selectedJob.isApplied
                    ? "bg-rose-500 text-white shadow-sm"
                    : darkMode ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <X className="h-3.5 w-3.5" />
                No
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleSave(selectedJob.id)}
            aria-pressed={Boolean(selectedJob.isSaved)}
            aria-label={selectedJob.isSaved ? "Remove from Saved" : "Save this role"}
            title={selectedJob.isSaved ? "Remove from Saved" : "Save this role"}
            className={`h-11 w-11 border rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              selectedJob.isSaved
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-850" : "border-slate-200 bg-white hover:bg-slate-100"
            }`}
          >
            <Bookmark className="h-5 w-5 fill-current" style={{ fillOpacity: selectedJob.isSaved ? 1 : 0 }} />
          </button>

          <button
            onClick={() => onApplyOutbound(selectedJob, selectedJob.isApplied ? "reopen" : "apply")}
            disabled={openingJobId === selectedJob.id}
            aria-busy={openingJobId === selectedJob.id}
            className={`flex-1 h-11 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              openingJobId === selectedJob.id
                ? "bg-slate-400 cursor-wait"
                : selectedJob.isApplied
                  ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
                  : `${activeAccentPrimary} active:scale-[0.99]`
            }`}
          >
            {openingJobId === selectedJob.id ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening in browser…
              </>
            ) : selectedJob.isApplied ? (
              <>
                <ExternalLink className="h-3.5 w-3.5" />
                Re-open application
              </>
            ) : isGov ? (
              <>
                <ExternalLink className="h-3.5 w-3.5" />
                View official government notice
              </>
            ) : (
              <>
                <ExternalLink className="h-3.5 w-3.5" />
                Apply on company site
              </>
            )}
          </button>
        </div>
      </div>

      {applyWizardSheet}
    </div>
  );
}
