import React from "react";
import {
  Bell,
  BellRing,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Globe,
  LifeBuoy,
  Link2,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Phone,
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
  X,
  Zap,
  ArrowLeft
} from "lucide-react";
import { CandidateStatus, FeedbackCategory, NotificationFrequency, PresencePreference, PresenceStatus, ThemeMode } from "../app/types/domain";
import { resizeImageFileToDataUrl } from "../app/utils/image";
import { APP_VERSION } from "../../version";

type IconCmp = React.ComponentType<{ className?: string }>;
type AccessibilityTextSize = "System" | "Small" | "Default" | "Large" | "Extra large";

export type ProfileSubScreen = null | "edit" | "resume" | "alertprefs" | "settings" | "accessibility" | "help";

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

function Toggle({ on, onChange, accentBg, dark, label }: { on: boolean; onChange: () => void; accentBg: string; dark: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={on}
      aria-label={`${label}: ${on ? "on" : "off"}`}
      className={`touch-target relative inline-flex h-5 w-9 shrink-0 items-center justify-start rounded-full transition-colors duration-200 ${
        on ? accentBg : (dark ? "bg-slate-700" : "bg-slate-300")
      }`}
    >
      <span
        className={`absolute h-4 w-4 rounded-full bg-white shadow-sm transition-[left,right] duration-200 ${
          on ? "right-0.5" : "left-0.5"
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
  accentText,
  talkBackHintsEnabled = false
}: {
  icon: IconCmp;
  iconWrap: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick: () => void;
  dark: boolean;
  accentText: string;
  talkBackHintsEnabled?: boolean;
}) {
  const talkBackLabel = subtitle ? `${title}. ${subtitle}` : title;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={talkBackHintsEnabled ? talkBackLabel : undefined}
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
  themeMode,
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
  candidateStatus,
  presenceStatus,
  presencePreference,
  networkOnline,
  profilePhotoUrl,
  uploadedResume,
  isUploading,
  uploadProgress,
  resumeVersions,
  autoAttachResume,
  prefMatches,
  prefInterviews,
  prefReminders,
  prefDigest,
  prefFrequency,
  prefQuietFrom,
  prefQuietTo,
  prefEmail,
  prefPush,
  settingHaptics,
  settingLanguage,
  helpQuery,
  helpOpenFaq,
  feedbackText,
  feedbackCategory,
  feedbackRating,
  accessibilityTalkBackHints,
  accessibilityHighContrast,
  accessibilityReduceMotion,
  accessibilityDyslexiaFont,
  accessibilityReadableSpacing,
  accessibilityReduceTransparency,
  accessibilityFocusIndicators,
  accessibilityTextSize,
  setThemeMode,
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
  setCandidateStatus,
  setPresencePreference,
  setProfilePhotoUrl,
  setUploadedResume,
  setResumeVersions,
  setAutoAttachResume,
  setPrefMatches,
  setPrefInterviews,
  setPrefReminders,
  setPrefDigest,
  setPrefFrequency,
  setPrefQuietFrom,
  setPrefQuietTo,
  setPrefEmail,
  setPrefPush,
  setSettingHaptics,
  setSettingLanguage,
  setHelpQuery,
  setHelpOpenFaq,
  setFeedbackText,
  setFeedbackCategory,
  setFeedbackRating,
  setAccessibilityTalkBackHints,
  setAccessibilityHighContrast,
  setAccessibilityReduceMotion,
  setAccessibilityDyslexiaFont,
  setAccessibilityReadableSpacing,
  setAccessibilityReduceTransparency,
  setAccessibilityFocusIndicators,
  setAccessibilityTextSize,
  onGoToSaved,
  onMockUpload,
  onProfileSaved,
  onHeadlineSaved,
  onRateApp,
  onReplayOnboarding,
  triggerNotification
}: {
  darkMode: boolean;
  themeMode: ThemeMode;
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
  candidateStatus: CandidateStatus;
  presenceStatus: PresenceStatus;
  presencePreference: PresencePreference;
  networkOnline: boolean;
  profilePhotoUrl: string | null;
  uploadedResume: string | null;
  isUploading: boolean;
  uploadProgress: number;
  resumeVersions: ResumeVersion[];
  autoAttachResume: boolean;
  prefMatches: boolean;
  prefInterviews: boolean;
  prefReminders: boolean;
  prefDigest: boolean;
  prefFrequency: NotificationFrequency;
  prefQuietFrom: string;
  prefQuietTo: string;
  prefEmail: boolean;
  prefPush: boolean;
  settingHaptics: boolean;
  settingLanguage: string;
  helpQuery: string;
  helpOpenFaq: string | null;
  feedbackText: string;
  feedbackCategory: FeedbackCategory;
  feedbackRating: number;
  accessibilityTalkBackHints: boolean;
  accessibilityHighContrast: boolean;
  accessibilityReduceMotion: boolean;
  accessibilityDyslexiaFont: boolean;
  accessibilityReadableSpacing: boolean;
  accessibilityReduceTransparency: boolean;
  accessibilityFocusIndicators: boolean;
  accessibilityTextSize: AccessibilityTextSize;
  setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
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
  setCandidateStatus: React.Dispatch<React.SetStateAction<CandidateStatus>>;
  setPresencePreference: React.Dispatch<React.SetStateAction<PresencePreference>>;
  setProfilePhotoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setUploadedResume: React.Dispatch<React.SetStateAction<string | null>>;
  setResumeVersions: React.Dispatch<React.SetStateAction<ResumeVersion[]>>;
  setAutoAttachResume: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefMatches: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefInterviews: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefReminders: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefDigest: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefFrequency: React.Dispatch<React.SetStateAction<NotificationFrequency>>;
  setPrefQuietFrom: React.Dispatch<React.SetStateAction<string>>;
  setPrefQuietTo: React.Dispatch<React.SetStateAction<string>>;
  setPrefEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefPush: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingHaptics: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingLanguage: React.Dispatch<React.SetStateAction<string>>;
  setHelpQuery: React.Dispatch<React.SetStateAction<string>>;
  setHelpOpenFaq: React.Dispatch<React.SetStateAction<string | null>>;
  setFeedbackText: React.Dispatch<React.SetStateAction<string>>;
  setFeedbackCategory: React.Dispatch<React.SetStateAction<FeedbackCategory>>;
  setFeedbackRating: React.Dispatch<React.SetStateAction<number>>;
  setAccessibilityTalkBackHints: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityReduceMotion: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityDyslexiaFont: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityReadableSpacing: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityReduceTransparency: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityFocusIndicators: React.Dispatch<React.SetStateAction<boolean>>;
  setAccessibilityTextSize: React.Dispatch<React.SetStateAction<AccessibilityTextSize>>;
  onGoToSaved: () => void;
  onMockUpload: () => void;
  onProfileSaved: () => void;
  onHeadlineSaved: (headline: string) => void;
  onRateApp: () => void | Promise<void>;
  onReplayOnboarding: () => void;
  triggerNotification: (message: string) => void;
}) {
  const toggleTalkBackHints = () => {
    const next = !accessibilityTalkBackHints;
    setAccessibilityTalkBackHints(next);
    triggerNotification(next ? "TalkBack support hints enabled." : "TalkBack support hints disabled.");
  };

  const handlePickProfilePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        triggerNotification("Please choose an image file.");
        return;
      }

      try {
        const dataUrl = await resizeImageFileToDataUrl(file, 256);
        setProfilePhotoUrl(dataUrl);
        triggerNotification("Profile photo updated.");
      } catch {
        triggerNotification("Could not load that image. Please try again.");
      }
    };
    input.click();
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhotoUrl(null);
    triggerNotification("Profile photo removed.");
  };

  const previewSizeClass =
    accessibilityTextSize === "Small"
      ? "text-xs"
      : accessibilityTextSize === "Large"
        ? "text-base"
        : accessibilityTextSize === "Extra large"
          ? "text-lg"
          : "text-sm";

  return (
    <div className="relative flex-1 flex flex-col">
      <p className="sr-only" aria-live="polite">{accessibilityTalkBackHints ? "TalkBack support hints enabled." : "TalkBack support hints disabled."}</p>
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-slate-100 flex items-center justify-center ${activeAccentBorderActive}`}>
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg tracking-tight">
                  {applicantName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div
              role="status"
              aria-label={`Status: ${presenceStatus === "online" ? "Online" : presenceStatus === "busy" ? "Busy" : "Offline"}`}
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${darkMode ? "border-slate-950" : "border-white"} ${
                presenceStatus === "online" ? "bg-emerald-500" : presenceStatus === "busy" ? "bg-rose-500" : "bg-slate-400"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className={`text-base font-bold tracking-tight truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
              {applicantName || "Your name"}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {applicantHeadline || "Your headline"} - {applicantLocation || "-"}
            </p>
            <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
              candidateStatus === "inactive"
                ? "bg-rose-50 text-rose-700 border border-rose-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}>
              {candidateStatus === "inactive" ? "Non-Active Candidate" : "Active Candidate"}
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
            talkBackHintsEnabled={accessibilityTalkBackHints}
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
            talkBackHintsEnabled={accessibilityTalkBackHints}
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
            talkBackHintsEnabled={accessibilityTalkBackHints}
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
            talkBackHintsEnabled={accessibilityTalkBackHints}
            trailing={<span className="text-[10px] text-slate-400 font-semibold capitalize">{themeMode}</span>}
            onClick={() => setProfileSubScreen("settings")}
          />
          <SettingsRow
            icon={SettingsIcon}
            iconWrap="bg-violet-50 text-violet-600 border-violet-100"
            title="Accessibility"
            subtitle="Text size, contrast, motion"
            dark={darkMode}
            accentText={activeAccentText}
            talkBackHintsEnabled={accessibilityTalkBackHints}
            trailing={<span className="text-[10px] text-slate-400 font-semibold">Open</span>}
            onClick={() => setProfileSubScreen("accessibility")}
          />
          <SettingsRow
            icon={LifeBuoy}
            iconWrap="bg-emerald-50 text-emerald-600 border-emerald-100"
            title="Help &amp; Support"
            subtitle="FAQs, contact us, send feedback"
            dark={darkMode}
            accentText={activeAccentText}
            talkBackHintsEnabled={accessibilityTalkBackHints}
            trailing={<span className="text-[10px] text-slate-400 font-semibold">24/7</span>}
            onClick={() => setProfileSubScreen("help")}
          />
        </div>

        <p className="text-center text-[10px] text-slate-400 pt-1 pb-2">
          SharpJob v{APP_VERSION} - by Player99 Inc
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
              onProfileSaved();
              onHeadlineSaved(applicantHeadline);
              triggerNotification("Your profile details were saved.");
              setProfileSubScreen(null);
            }}
            dark={darkMode}
            accentText={activeAccentText}
          />
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={handlePickProfilePhoto}
                  aria-label="Change profile photo"
                  className={`w-11 h-11 rounded-full border-2 overflow-hidden flex items-center justify-center bg-slate-200 font-bold text-slate-700 text-sm ${activeAccentBorderActive}`}
                >
                  {profilePhotoUrl ? (
                    <img src={profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    applicantName.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"
                  )}
                </button>
                <div
                  className={`absolute -bottom-1 -right-1 rounded-full p-1 border pointer-events-none ${
                    darkMode ? "bg-slate-800 border-slate-950 text-slate-200" : "bg-white border-white text-slate-600"
                  }`}
                >
                  <Camera className="h-2.5 w-2.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Preview - recruiters see this</p>
                <p className={`text-[13px] font-bold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>{applicantName || "Your name"}</p>
                <p className="text-[11px] text-slate-500 truncate">{applicantHeadline || "Your headline"} - {applicantLocation || "-"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button type="button" onClick={handlePickProfilePhoto} className={`text-[10px] font-semibold underline-offset-2 hover:underline ${activeAccentText}`}>
                    {profilePhotoUrl ? "Change photo" : "Add photo"}
                  </button>
                  {profilePhotoUrl && (
                    <button type="button" onClick={handleRemoveProfilePhoto} className="text-[10px] font-semibold text-slate-400 hover:text-red-500 underline-offset-2 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Candidate status</label>
              <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <button
                  onClick={() => setCandidateStatus("active")}
                  className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    candidateStatus === "active" ? "bg-emerald-600 text-white" : "text-slate-500"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" /> Active
                </button>
                <button
                  onClick={() => setCandidateStatus("inactive")}
                  className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    candidateStatus === "inactive" ? "bg-rose-600 text-white" : "text-slate-500"
                  }`}
                >
                  <X className="h-3.5 w-3.5" /> Non-Active
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                {candidateStatus === "inactive"
                  ? "Your profile shows as not currently looking for opportunities."
                  : "Recruiters can see that you're open to opportunities."}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Online status</label>
              <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} ${!networkOnline ? "opacity-50" : ""}`}>
                <button
                  type="button"
                  disabled={!networkOnline}
                  onClick={() => setPresencePreference("online")}
                  aria-pressed={presencePreference === "online"}
                  className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all disabled:cursor-not-allowed ${
                    presencePreference === "online" ? "bg-emerald-600 text-white" : "text-slate-500"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> Online
                </button>
                <button
                  type="button"
                  disabled={!networkOnline}
                  onClick={() => setPresencePreference("busy")}
                  aria-pressed={presencePreference === "busy"}
                  className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all disabled:cursor-not-allowed ${
                    presencePreference === "busy" ? "bg-rose-600 text-white" : "text-slate-500"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" /> Busy
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                {!networkOnline
                  ? "You're offline, so your status shows as Offline. Reconnect to change it."
                  : "Shown next to your profile photo while the app is open."}
              </p>
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
                    <button onClick={() => setProfileSkills(prev => prev.filter(x => x !== s))} aria-label={`Remove skill ${s}`} className="touch-target opacity-50 hover:opacity-100 hover:text-red-500"><X className="h-3 w-3" /></button>
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
            <div className={`rounded-xl border p-3 text-[11px] leading-relaxed ${darkMode ? "bg-amber-950/30 border-amber-900/60 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
              Resume uploads and document storage are not fully available yet. This feature will be completed in a future update.
            </div>
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
                  <button onClick={() => { setUploadedResume(null); setResumeVersions(prev => prev.map(v => ({ ...v, active: false }))); triggerNotification("Active resume removed."); }} aria-label="Remove active resume" className="touch-target text-slate-400 hover:text-red-500 p-1"><Trash2 className="h-4 w-4" /></button>
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
              <Toggle label="Auto-attach resume" on={autoAttachResume} onChange={() => setAutoAttachResume(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
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
              { icon: Sparkles, wrap: "bg-indigo-50 text-indigo-600 border-indigo-100", title: "New matches", desc: "Add your preferred job title in Edit Profile > Headline to receive matching new-role alerts.", on: prefMatches, set: setPrefMatches },
              { icon: BellRing, wrap: "bg-emerald-50 text-emerald-600 border-emerald-100", title: "Interview updates", desc: "Uses the Interview Tracker in Saved Jobs and sends reminders after you enter an interview date.", on: prefInterviews, set: setPrefInterviews },
              { icon: Clock, wrap: "bg-rose-50 text-rose-600 border-rose-100", title: "Closing-date reminders", desc: "Uses Saved for later jobs to remind you 3, 2, and 1 day before they close.", on: prefReminders, set: setPrefReminders },
              { icon: Mail, wrap: "bg-sky-50 text-sky-600 border-sky-100", title: "Weekly digest", desc: "Not available yet. Weekly email summaries will arrive in a future update.", on: prefDigest, set: setPrefDigest }
            ].map(row => {
              const RowIcon = row.icon;
              return (
                <button key={row.title} onClick={() => row.set(!row.on)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800 hover:bg-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${row.wrap}`}><RowIcon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.desc}</p>
                  </div>
                  <Toggle label={row.title} on={row.on} onChange={() => row.set(!row.on)} accentBg={activeAccentPrimary} dark={darkMode} />
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
                  <Toggle label="Push notifications" on={prefPush} onChange={() => setPrefPush(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
                </button>
                <button onClick={() => setPrefEmail(v => !v)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Mail className="h-4 w-4" /></div>
                  <div className="flex-1"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Email</p><p className="text-[11px] text-slate-500">Not available yet. Email alerts will arrive in a future update.</p></div>
                  <Toggle label="Email notifications" on={prefEmail} onChange={() => setPrefEmail(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
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
              <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <button onClick={() => setThemeMode("light")} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${themeMode === "light" ? `${activeAccentPrimary} text-white` : "text-slate-500"}`}><Sun className="h-3.5 w-3.5" /> Light</button>
                <button onClick={() => setThemeMode("dark")} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${themeMode === "dark" ? `${activeAccentPrimary} text-white` : "text-slate-500"}`}><Moon className="h-3.5 w-3.5" /> Dark</button>
                <button onClick={() => setThemeMode("system")} className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${themeMode === "system" ? `${activeAccentPrimary} text-white` : "text-slate-500"}`}><Monitor className="h-3.5 w-3.5" /> System</button>
              </div>
              {themeMode === "system" && (
                <p className="text-[10px] text-slate-500 mt-1.5">Matches your device setting — currently {darkMode ? "Dark" : "Light"}.</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Accent colour</label>
              <div className="flex items-center gap-2">
                {Object.entries(accents).map(([k, v]) => (
                  <button key={k} onClick={() => setAccentColor(k)} className={`touch-target w-8 h-8 rounded-full ${v.primary} flex items-center justify-center transition-transform ${accentColor === k ? "scale-110 ring-2 ring-offset-2 " + (darkMode ? "ring-offset-slate-950" : "ring-offset-white") + " ring-current " + v.text : "opacity-60"}`} aria-label={v.name}>
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

              <button onClick={() => setSettingHaptics(v => !v)} aria-label="Toggle haptic feedback" className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Haptic feedback</p><p className="text-[11px] text-slate-500">Subtle taps on toggles & confirms.</p></div>
              <Toggle label="Haptic feedback" on={settingHaptics} onChange={() => setSettingHaptics(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </button>

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-rose-50 text-rose-600 border-rose-100 flex items-center justify-center shrink-0"><Volume2 className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Notification sound</p><p className="text-[11px] text-slate-500">Custom notification sounds are not available yet and will arrive in a future update.</p></div>
            </div>

            <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <button
              onClick={() => { setProfileSubScreen(null); onReplayOnboarding(); }}
              aria-label="Replay app walkthrough"
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Compass className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Replay walkthrough</p><p className="text-[11px] text-slate-500">Show the guided tour again.</p></div>
              <ChevronRight className={`h-4 w-4 shrink-0 ${activeAccentText}`} />
            </button>

            <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className="text-[11px] text-slate-500 font-semibold">App version</span>
              <span className="text-[11px] text-slate-400 font-bold">v{APP_VERSION}</span>
            </div>

            <button onClick={() => { if (confirm("Sign out of SharpJob on this device?")) { triggerNotification("Signed out. (Demo only - session restored on reload.)"); setProfileSubScreen(null); } }} aria-label="Sign out of SharpJob" className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[12px] font-bold hover:bg-red-100 transition-colors">
              <Lock className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      )}

      {profileSubScreen === "accessibility" && (
        <div className={`absolute inset-0 z-40 flex flex-col animate-slide-up ${darkMode ? "bg-slate-950" : "bg-white"}`}>
          <ReaderTopBar title="Accessibility" onBackLabel="Profile" onBack={() => setProfileSubScreen(null)} dark={darkMode} accentText={activeAccentText} />
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
            <p className="text-[11px] text-slate-500 leading-relaxed -mt-1">Adjust readability and navigation comfort. You can add more options here over time.</p>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><Volume2 className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>TalkBack support hints</p>
                <p className="text-[11px] text-slate-500">Adds extra guidance labels and clearer tap targets.</p>
              </div>
              <Toggle label="TalkBack support hints" on={accessibilityTalkBackHints} onChange={toggleTalkBackHints} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>

            <div className={`rounded-xl border p-3 text-[11px] leading-relaxed ${darkMode ? "bg-amber-950/30 border-amber-900/60 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
              <p>
                TalkBack support is still in testing and may not work as intended on all devices. Before using this option,
                first enable TalkBack in your phone accessibility settings.
              </p>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><FileText className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Text size</p>
                <p className="text-[11px] text-slate-500">System follows your device text settings. Custom sizes stay app-specific.</p>
              </div>
              <select
                value={accessibilityTextSize}
                onChange={e => {
                  const next = e.target.value as AccessibilityTextSize;
                  setAccessibilityTextSize(next);
                  triggerNotification(`Text size set to ${next}.`);
                }}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
              >
                <option>System</option>
                <option>Small</option>
                <option>Default</option>
                <option>Large</option>
                <option>Extra large</option>
              </select>
            </div>

            <div className={`rounded-xl border p-3 space-y-1.5 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preview</p>
              <p className={`${previewSizeClass} font-semibold leading-snug ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                Accessibility preview text in {accessibilityTextSize} mode.
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Choose System to follow your phone setting, or pick a custom size for this app.
              </p>
            </div>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-amber-50 text-amber-600 border-amber-100 flex items-center justify-center shrink-0"><Sun className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>High contrast mode</p>
                <p className="text-[11px] text-slate-500">Boost distinction between text, controls, and backgrounds.</p>
              </div>
              <Toggle label="High contrast mode" on={accessibilityHighContrast} onChange={() => setAccessibilityHighContrast(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-rose-50 text-rose-600 border-rose-100 flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Reduce motion</p>
                <p className="text-[11px] text-slate-500">Minimize transitions and animation intensity.</p>
              </div>
              <Toggle label="Reduce motion" on={accessibilityReduceMotion} onChange={() => setAccessibilityReduceMotion(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center justify-center shrink-0"><FileText className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Dyslexia-friendly font</p>
                <p className="text-[11px] text-slate-500">Use clearer letter shapes and spacing for easier reading.</p>
              </div>
              <Toggle label="Dyslexia-friendly font" on={accessibilityDyslexiaFont} onChange={() => setAccessibilityDyslexiaFont(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-sky-50 text-sky-600 border-sky-100 flex items-center justify-center shrink-0"><FileText className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Readable spacing</p>
                <p className="text-[11px] text-slate-500">Increase line and letter spacing for easier reading.</p>
              </div>
              <Toggle label="Readable spacing" on={accessibilityReadableSpacing} onChange={() => setAccessibilityReadableSpacing(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-slate-100 text-slate-600 border-slate-200 flex items-center justify-center shrink-0"><SettingsIcon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Reduce transparency</p>
                <p className="text-[11px] text-slate-500">Replace translucent and blurred surfaces with solid backgrounds.</p>
              </div>
              <Toggle label="Reduce transparency" on={accessibilityReduceTransparency} onChange={() => setAccessibilityReduceTransparency(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>

            <div className={`w-full flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="w-9 h-9 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center shrink-0"><Check className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Focus indicators</p>
                <p className="text-[11px] text-slate-500">Show a clear outline around the active control for keyboard, switch, and voice navigation.</p>
              </div>
              <Toggle label="Focus indicators" on={accessibilityFocusIndicators} onChange={() => setAccessibilityFocusIndicators(v => !v)} accentBg={activeAccentPrimary} dark={darkMode} />
            </div>
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

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <label className="text-[9px] font-semibold text-slate-400 block mb-1">Category</label>
                    <select
                      value={feedbackCategory}
                      onChange={e => setFeedbackCategory(e.target.value as FeedbackCategory)}
                      aria-label="Feedback category"
                      className={`w-full text-[11px] font-bold px-2 py-2 rounded-lg border focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                    >
                      <option value="Bug">Bug</option>
                      <option value="Suggestion">Suggestion</option>
                      <option value="Job listing issue">Job listing issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-semibold text-slate-400 block mb-1">Rating (optional)</label>
                    <div className="flex items-center h-[34px]">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFeedbackRating(feedbackRating === i ? 0 : i)}
                          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                          aria-pressed={feedbackRating === i}
                          className="p-1.5"
                        >
                          <Star className={`h-4 w-4 ${i <= feedbackRating ? "text-amber-400 fill-current" : darkMode ? "text-slate-700" : "text-slate-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

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
              <button
                disabled={!feedbackText.trim() && feedbackRating === 0}
                onClick={() => {
                  const subject = encodeURIComponent(`SharpJob Feedback: ${feedbackCategory}`);
                  const ratingLine = feedbackRating > 0 ? `Rating: ${feedbackRating}/5` : "Rating: Not rated";
                  const body = encodeURIComponent(
                    `Category: ${feedbackCategory}\n${ratingLine}\n\n${feedbackText.trim()}`
                  );
                  window.open(`mailto:Hello@sharpjob.co.za?subject=${subject}&body=${body}`, "_blank");
                  triggerNotification("Opening your email client...");
                  setFeedbackText("");
                  setFeedbackCategory("Suggestion");
                  setFeedbackRating(0);
                }}
                className={`w-full h-11 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-40 ${activeAccentPrimary}`}
              >
                <Send className="h-4 w-4" /> Send feedback
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
