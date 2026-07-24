import React from "react";
import { Check, ChevronRight, FileText, Info, Send, ShieldCheck, Sparkles, Trash2, Upload, X } from "lucide-react";
import { Job } from "../listings/types";
import { AppTab } from "../app/types/domain";

export function ApplyWizardSheet({
  darkMode,
  activeAccentText,
  activeAccentPrimary,
  selectedJob,
  applyStep,
  setApplyStep,
  setIsApplying,
  setSelectedJob,
  onSwitchTab,
  applicantName,
  applicantEmail,
  setApplicantName,
  setApplicantEmail,
  uploadedResume,
  setUploadedResume,
  isUploading,
  uploadProgress,
  coverLetterText,
  setCoverLetterText,
  isSubmittingApp,
  confettiActive,
  onMockUpload,
  onGenerateCoverLetter,
  onFinalSubmit,
  onResumeRemoved
}: {
  darkMode: boolean;
  activeAccentText: string;
  activeAccentPrimary: string;
  selectedJob: Job;
  applyStep: number;
  setApplyStep: React.Dispatch<React.SetStateAction<number>>;
  setIsApplying: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
  onSwitchTab: (tab: AppTab) => void;
  applicantName: string;
  applicantEmail: string;
  setApplicantName: React.Dispatch<React.SetStateAction<string>>;
  setApplicantEmail: React.Dispatch<React.SetStateAction<string>>;
  uploadedResume: string | null;
  setUploadedResume: React.Dispatch<React.SetStateAction<string | null>>;
  isUploading: boolean;
  uploadProgress: number;
  coverLetterText: string;
  setCoverLetterText: React.Dispatch<React.SetStateAction<string>>;
  isSubmittingApp: boolean;
  confettiActive: boolean;
  onMockUpload: () => void;
  onGenerateCoverLetter: (job: Job) => void;
  onFinalSubmit: () => void;
  onResumeRemoved: () => void;
}) {
  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
    }`}>
      <div className={`h-12 px-4 flex items-center justify-between border-b shrink-0 ${
        darkMode ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-100"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`p-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold ${activeAccentText}`}>
            Step {applyStep === 4 ? 4 : applyStep}/3
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Apply to {selectedJob.company}
          </span>
        </div>
        <button
          onClick={() => {
            if (applyStep === 4 || confirm("Discard current job application?")) {
              setIsApplying(false);
              setApplyStep(1);
            }
          }}
          className="p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {applyStep === 1 && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Verify Personal Info</h4>
              <p className="text-xs text-slate-500 mt-0.5">Please confirm your current application profile details.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                    darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={e => setApplicantEmail(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                    darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-[11px] leading-relaxed flex gap-2">
                <Info className="h-4.5 w-4.5 shrink-0" />
                <span>Your details will be synchronized instantly into the profile database dashboard!</span>
              </div>
            </div>
          </div>
        )}

        {applyStep === 2 && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Attach Your Resume</h4>
              <p className="text-xs text-slate-500 mt-0.5">Recruiters prioritize applications with complete PDFs.</p>
            </div>

            <div className="space-y-3">
              {uploadedResume ? (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className={`h-6 w-6 shrink-0 ${activeAccentText}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                        {uploadedResume}
                      </p>
                      <p className="text-[9px] text-slate-400">PDF - 1.2 MB - Ready for delivery</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedResume(null);
                      onResumeRemoved();
                    }}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={onMockUpload}
                    className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-slate-400 transition-colors"
                  >
                    {isUploading ? (
                      <div className="space-y-2 w-full max-w-[200px]">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${activeAccentPrimary} transition-all duration-300`} style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400 mb-1.5" />
                        <p className="text-xs font-bold text-slate-500">Attach Alex_CV_2026.pdf</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click to simulate fast document upload</p>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed flex gap-2">
                <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
                <span className="text-slate-500">SharpJob encrypts resume uploads with bank-level transmission protocols.</span>
              </div>
            </div>
          </div>
        )}

        {applyStep === 3 && (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Draft Cover Letter</h4>
              <p className="text-xs text-slate-500 mt-0.5">Introduce yourself and summarize your value.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cover Letter (Optional)</span>
                <button
                  type="button"
                  onClick={() => onGenerateCoverLetter(selectedJob)}
                  className={`text-[10px] font-bold flex items-center gap-1 cursor-pointer ${activeAccentText}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate matching copy
                </button>
              </div>

              <textarea
                value={coverLetterText}
                onChange={e => setCoverLetterText(e.target.value)}
                placeholder={`Explain why you are the perfect candidate for the ${selectedJob.title} opening...`}
                rows={7}
                className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none leading-relaxed ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>
        )}

        {applyStep === 4 && (
          <div className="py-8 text-center space-y-5 animate-scale-up select-none">
            {confettiActive && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                {[...Array(24)].map((_, i) => {
                  const left = Math.random() * 100;
                  const delay = Math.random() * 2;
                  const size = Math.random() * 8 + 4;
                  const colors = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];
                  const color = colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <div
                      key={i}
                      className="absolute rounded-full animate-confetti-fall"
                      style={{
                        left: `${left}%`,
                        top: "-20px",
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                        animationDelay: `${delay}s`,
                        animationDuration: `${Math.random() * 2 + 1.5}s`
                      }}
                    />
                  );
                })}
              </div>
            )}

            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-850"}`}>
                Application Submitted!
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                Your profile, resume, and letter were successfully dispatched to the recruitment desk at <strong>{selectedJob.company}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-1 max-w-[300px] mx-auto select-none">
              <span className="block text-[10px] uppercase text-slate-400 font-bold">What happens next?</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                The team at {selectedJob.company} will review your resume within 5 business days. Any movement - views, interview invites, decisions - will ping you on the <strong>Alerts tab</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"
      }`}>
        {applyStep < 4 ? (
          <>
            <button
              onClick={() => {
                if (applyStep > 1) {
                  setApplyStep(prev => prev - 1);
                } else {
                  setIsApplying(false);
                }
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800"
            >
              Back
            </button>

            <button
              onClick={() => {
                if (applyStep === 1) {
                  if (!applicantName || !applicantEmail) {
                    alert("Please verify your name and email.");
                    return;
                  }
                  setApplyStep(2);
                } else if (applyStep === 2) {
                  if (!uploadedResume) {
                    alert("Please attach your resume PDF.");
                    return;
                  }
                  setApplyStep(3);
                } else if (applyStep === 3) {
                  onFinalSubmit();
                }
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1 ${activeAccentPrimary}`}
            >
              {isSubmittingApp ? (
                <span>Submitting...</span>
              ) : applyStep === 3 ? (
                <>
                  Submit Application
                  <Send className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsApplying(false);
              setSelectedJob(null);
              setApplyStep(1);
              onSwitchTab("home");
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all text-center ${activeAccentPrimary}`}
          >
            Back to Browse
          </button>
        )}
      </div>
    </div>
  );
}
