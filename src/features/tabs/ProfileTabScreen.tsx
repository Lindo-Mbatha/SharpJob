import React from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  LifeBuoy,
  Link2,
  Lock,
  Mail,
  MapPin,
  Moon,
  Search,
  Send,
  Settings as SettingsIcon,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Upload,
  UserPen,
  Volume2,
  Wifi,
  X,
  Zap,
  ArrowLeft
} from "lucide-react";
import { NotificationFrequency, NotificationSound } from "../app/types/domain";

type IconCmp = React.ComponentType<{ className?: string }>;

export type ProfileSubScreen = null | "edit" | "resume" | "alertprefs" | "settings" | "help";

export interface AccentStyle {
  primary: string;
  text: string;
  name: string;
}

export interface ResumeVersion {
  name: string;
  date: string;
  size: string;
  active: boolean;
}

function Toggle({ on, onChange, accentBg, dark }: { on: boolean; onChange: () => void; accentBg: string; dark: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={on}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
        on ? accentBg : (dark ? "bg-slate-700" : "bg-slate-300")
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingsRow({
  icon: Icon,
  iconWrap,
  title,
  subtitle,
  trailing,
  onClick,
  dark,
  accentText
}: {
  icon: IconCmp;
  iconWrap: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick: () => void;
  dark: boolean;
  accentText: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all group active:scale-[0.99] ${
        dark
          ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          : "bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/60"
      }`}
    >
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconWrap}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-bold truncate ${dark ? "text-white" : "text-slate-800"}`}>{title}</p>
        {subtitle && <p className="text-[11px] text-slate-500 truncate mt-0.5">{subtitle}</p>}
      </div>
      {trailing !== undefined && <div className="shrink-0 text-right">{trailing}</div>}
      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${accentText}`} />
    </button>
  );
}

function ReaderTopBar({ title, onBack, onBackLabel, right, dark, accentText }: { title: string; onBack: () => void; onBackLabel: string; right?: React.ReactNode; dark: boolean; accentText: string }) {
  return (
    <div className={`h-12 px-3 flex items-center justify-between border-b shrink-0 ${dark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
      <button onClick={onBack} className={`flex items-center gap-1 text-xs font-semibold ${accentText}`}>
        <ArrowLeft className="h-4 w-4" />
        {onBackLabel}
      </button>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[55%] text-center">{title}</span>
      <div className="w-12 flex justify-end">{right}</div>
    </div>
  );
}

export function ProfileTabScreen({
  darkMode,
  activeAccentText,
  activeAccentPrimary,
  activeAccentBorderActive,
  activeAccentBadge,
  accents,
  accentColor,
  appliedJobsCount,
  savedVisibleCount,
  profileStrengthLabel,
  profileSubScreen,
  jobs,
  applicantName,
  applicantEmail,
  applicantPhone,
  applicantHeadline,
  applicantLocation,
  applicantAbout,
  applicantPortfolio,
  applicantLinkedIn,
  profileSkills,
  profileSkillDraft,
  uploadedResume,
  isUploading,
  uploadProgress,
  resumeVersions,
  autoAttachResume,
  prefMatches,
  prefInterviews,
  prefViews,
  prefReminders,
  prefDigest,
  prefFrequency,
  prefQuietFrom,
  prefQuietTo,
  prefEmail,
  prefPush,
  settingWifiOnly,
  settingHaptics,
  settingSound,
  settingLanguage,
  cacheMB,
  helpQuery,
  helpOpenFaq,
  feedbackText,
  setDarkMode,
  setAccentColor,
  setProfileSubScreen,
  setApplicantName,
  setApplicantEmail,
  setApplicantPhone,
  setApplicantHeadline,
  setApplicantLocation,
  setApplicantAbout,
  setApplicantPortfolio,
  setApplicantLinkedIn,
  setProfileSkills,
  setProfileSkillDraft,
  setUploadedResume,
  setResumeVersions,
  setAutoAttachResume,
  setPrefMatches,
  setPrefInterviews,
  setPrefViews,
  setPrefReminders,
  setPrefDigest,
  setPrefFrequency,
  setPrefQuietFrom,
  setPrefQuietTo,
  setPrefEmail,
  setPrefPush,
  setSettingWifiOnly,
  setSettingHaptics,
  setSettingSound,
  setSettingLanguage,
  setCacheMB,
  setHelpQuery,
  setHelpOpenFaq,
  setFeedbackText,
  onGoToSaved,
  onMockUpload,
  onProfileSaved,
  onRateApp,
  triggerNotification
}: {
  darkMode: boolean;
  activeAccentText: string;
  activeAccentPrimary: string;
  activeAccentBorderActive: string;
  activeAccentBadge: string;
  accents: Record<string, AccentStyle>;
  accentColor: string;
  appliedJobsCount: number;
  savedVisibleCount: number;
  profileStrengthLabel: string;
  profileSubScreen: ProfileSubScreen;
  jobs: Job[];
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantHeadline: string;
  applicantLocation: string;
  applicantAbout: string;
  applicantPortfolio: string;
  applicantLinkedIn: string;
  profileSkills: string[];
  profileSkillDraft: string;
  uploadedResume: string | null;
  isUploading: boolean;
  uploadProgress: number;
  resumeVersions: ResumeVersion[];
  autoAttachResume: boolean;
  prefMatches: boolean;
  prefInterviews: boolean;
  prefViews: boolean;
  prefReminders: boolean;
  prefDigest: boolean;
  prefFrequency: NotificationFrequency;
  prefQuietFrom: string;
  prefQuietTo: string;
  prefEmail: boolean;
  prefPush: boolean;
  settingWifiOnly: boolean;
  settingHaptics: boolean;
  settingSound: NotificationSound;
  settingLanguage: string;
  cacheMB: number;
  helpQuery: string;
  helpOpenFaq: string | null;
  feedbackText: string;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setAccentColor: React.Dispatch<React.SetStateAction<string>>;
  setProfileSubScreen: React.Dispatch<React.SetStateAction<ProfileSubScreen>>;
  setApplicantName: React.Dispatch<React.SetStateAction<string>>;
  setApplicantEmail: React.Dispatch<React.SetStateAction<string>>;
  setApplicantPhone: React.Dispatch<React.SetStateAction<string>>;
  setApplicantHeadline: React.Dispatch<React.SetStateAction<string>>;
  setApplicantLocation: React.Dispatch<React.SetStateAction<string>>;
  setApplicantAbout: React.Dispatch<React.SetStateAction<string>>;
  setApplicantPortfolio: React.Dispatch<React.SetStateAction<string>>;
  setApplicantLinkedIn: React.Dispatch<React.SetStateAction<string>>;
  setProfileSkills: React.Dispatch<React.SetStateAction<string[]>>;
  setProfileSkillDraft: React.Dispatch<React.SetStateAction<string>>;
  setUploadedResume: React.Dispatch<React.SetStateAction<string | null>>;
  setResumeVersions: React.Dispatch<React.SetStateAction<ResumeVersion[]>>;
  setAutoAttachResume: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefMatches: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefInterviews: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefViews: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefReminders: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefDigest: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefFrequency: React.Dispatch<React.SetStateAction<NotificationFrequency>>;
  setPrefQuietFrom: React.Dispatch<React.SetStateAction<string>>;
  setPrefQuietTo: React.Dispatch<React.SetStateAction<string>>;
  setPrefEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefPush: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingWifiOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingHaptics: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingSound: React.Dispatch<React.SetStateAction<NotificationSound>>;
  setSettingLanguage: React.Dispatch<React.SetStateAction<string>>;
  setCacheMB: React.Dispatch<React.SetStateAction<number>>;
  setHelpQuery: React.Dispatch<React.SetStateAction<string>>;
  setHelpOpenFaq: React.Dispatch<React.SetStateAction<string | null>>;
  setFeedbackText: React.Dispatch<React.SetStateAction<string>>;
  onGoToSaved: () => void;
  onMockUpload: () => void;
  onProfileSaved: () => void;
  onRateApp: () => void | Promise<void>;
  triggerNotification: (message: string) => void;
}) {
  return (
    <div className="relative flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-slate-100 flex items-center justify-center ${activeAccentBorderActive}`}>
              <div className="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg tracking-tight">
                {applicantName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
              <Check className="h-2.5 w-2.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className={`text-base font-bold tracking-tight truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
              {applicantName || "Your name"}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {applicantHeadline || "Your headline"} - {applicantLocation || "-"}
            </p>
            <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">
              Active Candidate
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 select-none">
          <button
            type="button"
            aria-label="View applied jobs"
            title="View applied jobs"
            onClick={onGoToSaved}
            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.97] hover:border-emerald-300 dark:hover:border-emerald-700/60"
          >
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{appliedJobsCount}</span>
            <span className="text-[9px] text-slate-400 font-semibold">Applied</span>
          </button>
          <button
            type="button"
            aria-label="View saved jobs"
            title="View saved jobs"
            onClick={onGoToSaved}
            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.97] hover:border-emerald-300 dark:hover:border-emerald-700/60"
          >
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{savedVisibleCount}</span>
            <span className="text-[9px] text-slate-400 font-semibold">Saved</span>
          </button>
          <button
            onClick={() => setProfileSubScreen("edit")}
            className={`p-2 rounded-xl text-center border transition-all active:scale-[0.97] ${
              darkMode
                ? "bg-slate-900 border-slate-800 hover:border-emerald-700/60"
                : "bg-slate-50 border-slate-100 hover:border-emerald-300"
            }`}
          >
            <span className="block text-sm font-bold text-emerald-600">{profileStrengthLabel}</span>
            <span className="text-[9px] text-slate-400 font-semibold">Strength</span>
          </button>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Account &amp; preferences
          </p>
          <SettingsRow
            icon={UserPen}
            iconWrap="bg-indigo-50 text-indigo-600 border-indigo-100"
            title="Edit Profile"
            subtitle="Name, headline, about, skills, links"
            dark={darkMode}
            accentText={activeAccentText}
            trailing={<span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{profileStrengthLabel}</span>}
            onClick={() => setProfileSubScreen("edit")}
          />
          <SettingsRow
            icon={FileText}
            iconWrap="bg-blue-50 text-blue-600 border-blue-100"
            title="Resume &amp; CV"
            subtitle={uploadedResume || "No resume on file"}
            dark={darkMode}
            accentText={activeAccentText}
            trailing={<span className="text-[10px] text-slate-400 font-semibold">{resumeVersions.length} saved</span>}
            onClick={() => setProfileSubScreen("resume")}
          />
          <SettingsRow
            icon={BellRing}
            iconWrap="bg-amber-50 text-amber-600 border-amber-100"
            title="Job Alerts"
            subtitle="Matches, interviews, digests, quiet hours"
            dark={darkMode}
            accentText={activeAccentText}
            trailing={<span className="text-[10px] text-slate-400 font-semibold capitalize">{prefFrequency}</span>}
            onClick={() => setProfileSubScreen("alertprefs")}
          />
          <SettingsRow
            icon={SettingsIcon}
            iconWrap="bg-slate-100 text-slate-600 border-slate-200"
            title="App Settings"
            subtitle="Appearance, language, data, sound"
            dark={darkMode}
            accentText={activeAccentText}
            trailing={<span className="text-[10px] text-slate-400 font-semibold">{darkMode ? "Dark" : "Light"}</span>}
            onClick={() => setProfileSubScreen("settings")}
          />
          <SettingsRow
            icon={LifeBuoy}
            iconWrap="bg-emerald-50 text-emerald-600 border-emerald-100"
            title="Help &amp; Support"
            subtitle="FAQs, contact us, send feedback"
            dark={darkMode}
            accentText={activeAccentText}
            trailing={<span className="text-[10px] text-slate-400 font-semibold">24/7</span>}
            onClick={() => setProfileSubScreen("help")}
          />
        </div>

        <p className="text-center text-[10px] text-slate-400 pt-1 pb-2">
          SharpJob v{__APP_VERSION__} - by Player99 Inc
        </p>

        <div className={`mx-1 mb-4 p-3 rounded-xl border text-[10px] leading-relaxed space-y-2 ${darkMode ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
          <p>
            <span className="font-bold text-slate-500 dark:text-slate-300">Government listings — </span>
            SharpJob is an independent job listing platform and is not affiliated with, endorsed by, or officially representing any government department or entity. Government job listings are aggregated from publicly available official sources, with direct links provided to each original listing.
          </p>
          <p>
            <span className="font-bold text-slate-500 dark:text-slate-300">Private company listings — </span>
            SharpJob is not affiliated with, endorsed by, or acting on behalf of any private company or employer featured on this platform. Job listings from private companies are aggregated from publicly available sources. SharpJob does not guarantee the accuracy, completeness, or availability of any listing and is not responsible for the hiring decisions or conduct of any employer.
          </p>
        </div>
      </div>

      {profileSubScreen === "edit" && (
        <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
          <ReaderTopBar
            title="Edit Profile"
            onBackLabel="Profile"
            onBack={() => {
              // Check if headline was updated and trigger job match notification
              if (applicantHeadline.trim()) {
                const matchingJobs = jobs.filter(job => 
                  applicantHeadline.toLowerCase().includes(job.title.toLowerCase()) ||
                  job.title.toLowerCase().includes(applicantHeadline.toLowerCase())
                );
                if (matchingJobs.length > 0) {
                  triggerNotification(`Found ${matchingJobs.length} role${matchingJobs.length !== 1 ? 's' : ''} matching your position "${applicantHeadline}"!`);
                }
              }
              onProfileSaved();
              triggerNotification("Your profile details were saved.");
              setProfileSubScreen(null);
            }}
            dark={darkMode}
            accentText={activeAccentText}
          />
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center bg-slate-200 font-bold text-slate-700 text-sm ${activeAccentBorderActive}`}>
                {applicantName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Preview - recruiters see this</p>
                <p className={`text-[13px] font-bold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>{applicantName || "Your name"}</p>
                <p className="text-[11px] text-slate-500 truncate">{applicantHeadline || "Your headline"} - {applicantLocation || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full name</label>
                <input value={applicantName} onChange={e => setApplicantName(e.target.value)} className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                <input value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input value={applicantPhone} onChange={e => setApplicantPhone(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</label>
                <input value={applicantHeadline} onChange={e => setApplicantHeadline(e.target.value)} placeholder="e.g. Product Designer" className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input value={applicantLocation} onChange={e => setApplicantLocation(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About</label>
                  <span className={`text-[10px] font-bold ${applicantAbout.length > 160 ? "text-amber-500" : "text-slate-400"}`}>{applicantAbout.length}/180</span>
                </div>
                <textarea value={applicantAbout} maxLength={180} onChange={e => setApplicantAbout(e.target.value)} rows={3} placeholder="Two or three lines on what you do and what you're after next." className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-1 resize-none leading-relaxed ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Portfolio</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input value={applicantPortfolio} onChange={e => setApplicantPortfolio(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input value={applicantLinkedIn} onChange={e => setApplicantLinkedIn(e.target.value)} className={`w-full pl-8 pr-3 text-xs py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Target skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {profileSkills.map(s => (
                  <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                    {s}
                    <button onClick={() => setProfileSkills(prev => prev.filter(x => x !== s))} className="opacity-50 hover:opacity-100 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <input
                value={profileSkillDraft}
                onChange={e => setProfileSkillDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = profileSkillDraft.trim();
                    if (v && !profileSkills.includes(v)) setProfileSkills([...profileSkills, v]);
                    setProfileSkillDraft("");
                  }
                }}
                placeholder="Add a skill - press Enter"
                className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`}
              />
            </div>
          </div>
          <div className={`p-3 border-t shrink-0 ${darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
            <button onClick={() => { onProfileSaved(); triggerNotification("Your profile details were saved."); setProfileSubScreen(null); }} className={`w-full h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 ${activeAccentPrimary}`}>
              <Check className="h-4 w-4" /> Save profile
            </button>
          </div>
        </div>
      )}

      {profileSubScreen === "resume" && (
        <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
          <ReaderTopBar title="Resume & CV" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccentText} />
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Active resume</label>
              {uploadedResume ? (
                <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className={`h-5 w-5 shrink-0 ${activeAccentText}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{uploadedResume}</p>
                      <p className="text-[10px] text-slate-400">PDF - attached to new applications</p>
                    </div>
                  </div>
                  <button onClick={() => { setUploadedResume(null); setResumeVersions(prev => prev.map(v => ({ ...v, active: false }))); triggerNotification("Active resume removed."); }} className="text-slate-400 hover:text-red-500 p-1"><Trash2 className="h-4 w-4" /></button>
                </div>
              ) : (
                <button onClick={onMockUpload} className={`w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${isUploading ? "border-slate-300 text-slate-400" : (darkMode ? "border-slate-700 text-slate-300 hover:border-slate-600" : "border-slate-300 text-slate-500 hover:border-slate-400")}`}>
                  {isUploading ? (
                    <div className="w-full max-w-[200px] space-y-1.5 px-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400"><span>Uploading</span><span>{uploadProgress}%</span></div>
                      <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${activeAccentPrimary} transition-all`} style={{ width: `${uploadProgress}%` }} /></div>
                    </div>
                  ) : (<><Upload className="h-6 w-6 opacity-60" /><span>Tap to upload a PDF</span></>)}
                </button>
              )}
            </div>

            <button onClick={() => setAutoAttachResume(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-blue-50 text-blue-600 border-blue-100 flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Auto-attach to applications</p>
                <p className="text-[11px] text-slate-500">Skip the upload step on every Apply flow.</p>
              </div>
              <Toggle on={autoAttachResume} onChange={() => setAutoAttachResume(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </button>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Version history</label>
              <div className="space-y-2">
                {resumeVersions.map(v => (
                  <div key={v.name} className={`p-3 rounded-xl border flex items-center gap-3 ${v.active ? (darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300") : (darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white/60 border-slate-200")}`}>
                    <FileText className={`h-4 w-4 shrink-0 ${v.active ? activeAccentText : "text-slate-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{v.name}</p>
                      <p className="text-[10px] text-slate-400">{v.date} - {v.size}</p>
                    </div>
                    {v.active ? (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${activeAccentBadge} border`}>Active</span>
                    ) : (
                      <button onClick={() => { setUploadedResume(v.name); setResumeVersions(prev => prev.map(x => ({ ...x, active: x.name === v.name }))); triggerNotification(`Restored ${v.name} as your active resume.`); }} className={`text-[10px] font-bold ${activeAccentText}`}>Restore</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-3 rounded-xl border flex gap-2.5 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <Lock className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-slate-500">Resumes are encrypted in transit and at rest. Only recruiters you apply to can download your file - never sold, never used to train models.</p>
            </div>
          </div>
        </div>
      )}

      {profileSubScreen === "alertprefs" && (
        <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
          <ReaderTopBar title="Job Alerts" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccentText} />
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed -mt-1">Choose what pings you and when. Changes save instantly.</p>

            {[
              { icon: Sparkles, wrap: "bg-indigo-50 text-indigo-600 border-indigo-100", title: "New matches", desc: "Roles that fit your skills & salary band.", on: prefMatches, set: setPrefMatches },
              { icon: BellRing, wrap: "bg-emerald-50 text-emerald-600 border-emerald-100", title: "Interview updates", desc: "Invites, reschedules, outcomes.", on: prefInterviews, set: setPrefInterviews },
              { icon: CheckCircle, wrap: "bg-amber-50 text-amber-600 border-amber-100", title: "Application views", desc: "When a recruiter opens your CV.", on: prefViews, set: setPrefViews },
              { icon: Clock, wrap: "bg-rose-50 text-rose-600 border-rose-100", title: "Closing-date reminders", desc: "48h and 4h before a saved role closes.", on: prefReminders, set: setPrefReminders },
              { icon: Mail, wrap: "bg-sky-50 text-sky-600 border-sky-100", title: "Weekly digest", desc: "One email, Monday 08:00, top matches.", on: prefDigest, set: setPrefDigest }
            ].map(row => {
              const RowIcon = row.icon;
              return (
                <button key={row.title} onClick={() => row.set(!row.on)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${row.wrap}`}><RowIcon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.desc}</p>
                  </div>
                  <Toggle on={row.on} onChange={() => row.set(!row.on)} accentBg={activeAccentPrimary} dark={darkMode} />
                </button>
              );
            })}

            <div className={`border-t my-1 ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Delivery frequency</label>
              <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                {(["instant", "hourly", "daily"] as const).map(f => (
                  <button key={f} onClick={() => setPrefFrequency(f)} className={`py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${prefFrequency === f ? `${activeAccentPrimary} text-white` : (darkMode ? "text-slate-400" : "text-slate-500")}`}>{f}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quiet hours</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 block mb-1 font-semibold uppercase">From</span>
                  <select value={prefQuietFrom} onChange={e => setPrefQuietFrom(e.target.value)} className={`w-full text-xs px-2.5 py-2 rounded-xl border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                    {["20:00", "21:00", "22:00", "23:00", "00:00"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block mb-1 font-semibold uppercase">Until</span>
                  <select value={prefQuietTo} onChange={e => setPrefQuietTo(e.target.value)} className={`w-full text-xs px-2.5 py-2 rounded-xl border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                    {["06:00", "07:00", "08:00", "09:00"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">Alerts queue silently and deliver in a single batch at {prefQuietTo}.</p>
            </div>

            <div className={`border-t my-1 ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Channels</label>
              <div className="space-y-2">
                <button onClick={() => setPrefPush(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><Bell className="h-4 w-4" /></div>
                  <div className="flex-1"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Push notifications</p><p className="text-[11px] text-slate-500">On this device.</p></div>
                  <Toggle on={prefPush} onChange={() => setPrefPush(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
                </button>
                <button onClick={() => setPrefEmail(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Mail className="h-4 w-4" /></div>
                  <div className="flex-1"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Email</p><p className="text-[11px] text-slate-500 truncate">{applicantEmail}</p></div>
                  <Toggle on={prefEmail} onChange={() => setPrefEmail(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {profileSubScreen === "settings" && (
        <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
          <ReaderTopBar title="App Settings" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccentText} />
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Appearance</label>
              <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <button onClick={() => setDarkMode(false)} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${!darkMode ? `${activeAccentPrimary} text-white` : "text-slate-500"}`}><Sun className="h-3.5 w-3.5" /> Light</button>
                <button onClick={() => setDarkMode(true)} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${darkMode ? `${activeAccentPrimary} text-white` : "text-slate-500"}`}><Moon className="h-3.5 w-3.5" /> Dark</button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Accent colour</label>
              <div className="flex items-center gap-2">
                {Object.entries(accents).map(([k, v]) => (
                  <button key={k} onClick={() => setAccentColor(k)} className={`w-8 h-8 rounded-full ${v.primary} flex items-center justify-center transition-transform ${accentColor === k ? "scale-110 ring-2 ring-offset-2 " + (darkMode ? "ring-offset-slate-950" : "ring-offset-white") + " ring-current " + v.text : "opacity-60"}`} aria-label={v.name}>
                    {accentColor === k && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center shrink-0"><Globe className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Language</p><p className="text-[11px] text-slate-500">Interface & email copy.</p></div>
              <select value={settingLanguage} onChange={e => { setSettingLanguage(e.target.value); triggerNotification(`Language set to ${e.target.value}.`); }} className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                <option>English</option><option>Afrikaans</option><option>isiZulu</option><option>isiXhosa</option><option>Sesotho</option>
              </select>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-amber-50 text-amber-600 border-amber-100 flex items-center justify-center shrink-0 font-black text-[11px]">R</div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Currency</p><p className="text-[11px] text-slate-500">South African Rand (ZAR) - locked to your region.</p></div>
            </div>

            <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <button onClick={() => setSettingWifiOnly(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Wifi className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Wi-Fi only</p><p className="text-[11px] text-slate-500">Pause media & large syncs on mobile data.</p></div>
              <Toggle on={settingWifiOnly} onChange={() => setSettingWifiOnly(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </button>
            <button onClick={() => setSettingHaptics(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Haptic feedback</p><p className="text-[11px] text-slate-500">Subtle taps on toggles & confirms.</p></div>
              <Toggle on={settingHaptics} onChange={() => setSettingHaptics(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </button>

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-rose-50 text-rose-600 border-rose-100 flex items-center justify-center shrink-0"><Volume2 className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Notification sound</p></div>
              <select value={settingSound} onChange={e => setSettingSound(e.target.value as NotificationSound)} className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none capitalize ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                <option value="chime">Chime</option><option value="ping">Ping</option><option value="none">None</option>
              </select>
            </div>

            <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-slate-100 text-slate-600 border-slate-200 flex items-center justify-center shrink-0"><FileText className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Cached data</p><p className="text-[11px] text-slate-500">{cacheMB} MB - listings, avatars, icons.</p></div>
              <button onClick={() => { setCacheMB(0); triggerNotification("Cache cleared. Listings will refresh on next open."); }} className="text-[10px] font-bold text-red-500 px-2 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100">Clear</button>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className="text-[11px] text-slate-500 font-semibold">App version</span>
              <span className="text-[11px] text-slate-400 font-bold">1.2.0 (build 248)</span>
            </div>

            <button onClick={() => { if (confirm("Sign out of SharpJob on this device?")) { triggerNotification("Signed out. (Demo only - session restored on reload.)"); setProfileSubScreen(null); } }} className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[12px] font-bold hover:bg-red-100 transition-colors">
              <Lock className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      )}

      {profileSubScreen === "help" && (() => {
        const faqs = [
          { id: "f1", q: "How do I apply to a job?", a: "When you tap Apply, SharpJob takes you to the job's website where you can apply directly. In-app applications are not available yet." },
          { id: "f2", q: "Can recruiters see when I update my profile?", a: "Not yet. Recruiter visibility for live profile updates is a planned feature down the line. CV uploads will also start working once employers register with us." },
          { id: "f3", q: "Why did my application status change?", a: "The app assumes you applied after you click the Apply button. You can change the status any time from the job details or saved listings." },
          { id: "f4", q: "How is Profile Strength calculated?", a: "It scores completed fields (name, headline, about, skills), a verified email, an uploaded resume and at least one external link. Hitting 100% lifts your rank in recruiter search by roughly 2.3x." },
          { id: "f5", q: "Is my data safe?", a: "Yes. Resumes and personal details are encrypted in transit and at rest. We never sell data or use it to train external models. You can delete your account any time from Help -> Contact us." },
          { id: "f6", q: "Why are there ads in the app?", a: "We know ads can be annoying, but they help us pay the bills and keep SharpJob free for everyone to use. We are continuously improving how ads are placed so they feel seamless and do not disturb your user experience." }
        ];
        const q = helpQuery.trim().toLowerCase();
        const visibleFaqs = q ? faqs.filter(f => (f.q + " " + f.a).toLowerCase().includes(q)) : faqs;
        return (
          <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
            <ReaderTopBar title="Help & Support" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccentText} />
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input value={helpQuery} onChange={e => setHelpQuery(e.target.value)} placeholder="Search help articles..." className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Frequently asked</p>
                <div className="space-y-2">
                  {visibleFaqs.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-4 text-center">No articles match "{helpQuery}". Try a shorter phrase or contact us below.</p>
                  ) : visibleFaqs.map(f => {
                    const open = helpOpenFaq === f.id;
                    return (
                      <div key={f.id} className={`rounded-xl border overflow-hidden ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                        <button onClick={() => setHelpOpenFaq(open ? null : f.id)} className="w-full flex items-center justify-between gap-2 p-3 text-left">
                          <span className={`text-[12px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{f.q}</span>
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${activeAccentText}`} />
                        </button>
                        {open && (
                          <div className={`px-3 pb-3 -mt-0.5 text-[11px] leading-relaxed animate-fade-in ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{f.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Talk to a human</p>
                <div className="space-y-2">
                  {[
                    { icon: Mail, wrap: "bg-sky-50 text-sky-600 border-sky-100", title: "Email us", meta: "Hello@sharpjob.co.za" }
                  ].map(c => {
                    const CIcon = c.icon;
                    const handleContactClick = () => {
                      if (c.title === "Email us") {
                        window.open("mailto:Hello@sharpjob.co.za", "_blank");
                      } else {
                        triggerNotification(`Opening ${c.title.toLowerCase()}...`);
                      }
                    };
                    return (
                      <button key={c.title} onClick={handleContactClick} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${c.wrap}`}><CIcon className="h-4 w-4" /></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{c.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{c.meta}</p>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${activeAccentText}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

              <button onClick={() => window.open("https://play.google.com/store/apps/details?id=com.player99.sharpjob", "_blank")} className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg border bg-amber-50 text-amber-600 border-amber-100 flex items-center justify-center shrink-0"><Star className="h-4 w-4 fill-current" /></div>
                  <div><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Rate SharpJob</p><p className="text-[11px] text-slate-500">Takes 10 seconds. Helps a lot.</p></div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-current" />)}
                </div>
              </button>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Send feedback</label>
                <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} rows={3} placeholder="Tell us what's working, what's not, or what you wish existed..." className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-1 resize-none leading-relaxed ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"}`} />
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                {["Terms", "Privacy", "POPIA"].map(l => (
                  <button key={l} onClick={() => {
                    if (l === "Terms") {
                      window.open("https://sharp-job-cp7p.vercel.app/terms-of-service.html", "_blank");
                    } else if (l === "Privacy") {
                      window.open("https://sharp-job-cp7p.vercel.app/privacy-policy.html", "_blank");
                    } else if (l === "POPIA") {
                      window.open("https://popia.co.za/", "_blank");
                    } else {
                      triggerNotification(`Opening ${l} policy...`);
                    }
                  }} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline-offset-2 hover:underline">{l}</button>
                ))}
              </div>
            </div>
            <div className={`p-3 border-t shrink-0 ${darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
              <button onClick={() => {
                const subject = encodeURIComponent("SharpJob App Feedback");
                const body = encodeURIComponent(feedbackText.trim());
                window.open(`mailto:Hello@sharpjob.co.za?subject=${subject}&body=${body}`, "_blank");
                triggerNotification("Opening your email client...");
                setFeedbackText("");
              }} className={`w-full h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 ${activeAccentPrimary}`}>
                <Send className="h-4 w-4" /> Send feedback
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
