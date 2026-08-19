import { useState, useEffect, useRef } from "react";
import sharpJobLogo from "./assets/sharpjobreallogo.png";
import splashBackground from "./assets/backgroundblue.jpg";
import { WifiOff } from "lucide-react";
import { LISTINGS_PER_PAGE } from "./features/listings/constants";
import { useJobs } from "./features/listings/useJobs";
import { Job, PreviousSavedListing } from "./features/listings/types";
import { getActiveJobs, getActiveSavedJobs, getPreviousSavedListings, parseJobCloseDate } from "./features/listings/utils";
import { countAppliedJobs, countSavedVisible, paginateItems } from "./features/listings/selectors";
import { HomeTabScreen } from "./features/tabs/HomeTabScreen";
import { ExploreTabScreen } from "./features/tabs/ExploreTabScreen";
import { SavedTabScreen } from "./features/tabs/SavedTabScreen";
import { AlertsTabScreen } from "./features/tabs/AlertsTabScreen";
import { ProfileTabScreen } from "./features/tabs/ProfileTabScreen";
import { ApplyWizardSheet } from "./features/tabs/ApplyWizardSheet";
import { AdvancedSearchSheet } from "./features/tabs/AdvancedSearchSheet";
import { JobDetailsDrawer } from "./features/tabs/JobDetailsDrawer";
import { TopStatusToastOverlay } from "./features/tabs/TopStatusToastOverlay";
import { JobListSkeleton } from "./features/listings/components/JobListSkeleton";
import { PullToRefreshIndicator } from "./features/tabs/PullToRefreshIndicator";
import { OfflineBanner } from "./features/tabs/OfflineBanner";
import { usePullToRefresh } from "./features/app/hooks/usePullToRefresh";
import { BottomNavigationBar } from "./features/tabs/BottomNavigationBar";
import { PhoneShellFrame } from "./features/tabs/PhoneShellFrame";
import { useAlerts } from "./features/app/hooks/useAlerts";
import { useApplyFlow } from "./features/app/hooks/useApplyFlow";
import { useJobActions } from "./features/app/hooks/useJobActions";
import { useDeviceStatus } from "./features/app/hooks/useDeviceStatus";
import { useAppVisibility } from "./features/app/hooks/useAppVisibility";
import { useExploreFilters } from "./features/app/hooks/useExploreFilters";
import { readStoredValue, useProfileSettings, writeStoredValue } from "./features/app/hooks/useProfileSettings";
import { useOnboarding } from "./features/app/hooks/useOnboarding";
import { OnboardingWalkthrough } from "./features/app/onboarding/OnboardingWalkthrough";
import { AppTab, ApplyOutboundMode } from "./features/app/types/domain";
import { trackEvent, trackScreenView } from "./features/app/monitoring/telemetry";
import { requestAppRating } from "./features/app/monitoring/rateApp";
import {
  trackAdvancedSearchApplied,
  trackApplySubmitted,
  trackProfileSaved
} from "./features/app/monitoring/productEvents";
import { filterExploreJobs } from "./features/explore/selectors";
import { deriveProfileStrength } from "./features/profile/selectors";
import { triggerHapticFeedback } from "./features/app/monitoring/haptics";
import { notifyDevice, scheduleClosingDateReminders, scheduleInterviewReminders } from "./features/app/monitoring/deviceNotifications";
import { getNotificationDeliveryTime } from "./features/app/monitoring/notificationDelivery";

const SEEN_JOB_IDS_KEY = "sharpjob.jobs.seen.v1";
const JOB_STATE_KEY = "sharpjob.jobs.state.v1";
const RESUME_SELECTION_KEY = "sharpjob.resume.selection.v1";

// Accent options definition
interface AccentStyle {
  primary: string;
  text: string;
  textHover: string;
  bgLight: string;
  borderLight: string;
  borderHover: string;
  borderActive: string;
  ring: string;
  badge: string;
  name: string;
}

const ACCENTS: Record<string, AccentStyle> = {
  indigo: {
    primary: "bg-indigo-600",
    text: "text-indigo-600",
    textHover: "hover:text-indigo-700",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-100",
    borderHover: "hover:border-indigo-300",
    borderActive: "border-indigo-600",
    ring: "focus:ring-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    name: "Classic Indigo"
  },
  blue: {
    primary: "bg-blue-600",
    text: "text-blue-600",
    textHover: "hover:text-blue-700",
    bgLight: "bg-blue-50/80",
    borderLight: "border-blue-100",
    borderHover: "hover:border-blue-300",
    borderActive: "border-blue-600",
    ring: "focus:ring-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    name: "SharpJob Blue"
  },
  emerald: {
    primary: "bg-emerald-600",
    text: "text-emerald-600",
    textHover: "hover:text-emerald-700",
    bgLight: "bg-emerald-50/80",
    borderLight: "border-emerald-100",
    borderHover: "hover:border-emerald-300",
    borderActive: "border-emerald-600",
    ring: "focus:ring-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    name: "Mint Emerald"
  },
  rose: {
    primary: "bg-rose-600",
    text: "text-rose-600",
    textHover: "hover:text-rose-700",
    bgLight: "bg-rose-50/80",
    borderLight: "border-rose-100",
    borderHover: "hover:border-rose-300",
    borderActive: "border-rose-600",
    ring: "focus:ring-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    name: "Rose Quartz"
  },
  amber: {
    primary: "bg-amber-600",
    text: "text-amber-600",
    textHover: "hover:text-amber-700",
    bgLight: "bg-amber-50/80",
    borderLight: "border-amber-100",
    borderHover: "hover:border-amber-300",
    borderActive: "border-amber-600",
    ring: "focus:ring-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    name: "Golden Amber"
  }
};

export default function App() {
  const shouldShowInitialSplash = import.meta.env.MODE !== "test";
  const { state: profileState, actions: profileActions } = useProfileSettings();

  const {
    accentColor,
    themeMode,
    darkMode,
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
    presencePreference,
    profilePhotoUrl,
    profileSubScreen,
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
    accessibilityTextSize
  } = profileState;

  const {
    setAccentColor,
    setThemeMode,
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
    setProfileSubScreen,
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
    saveProfileDetails
  } = profileActions;

  const { profileMissingCount, profileStrengthLabel } = deriveProfileStrength({
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantHeadline,
    applicantLocation,
    applicantAbout,
    applicantPortfolio,
    applicantLinkedIn,
    profileSkills
  });

  const { state: deviceState } = useDeviceStatus();
  const {
    phoneTime,
    batteryLevel,
    batteryCharging,
    networkLabel,
    networkOnline,
    isMobileView
  } = deviceState;

  const isAppVisible = useAppVisibility();
  const presenceStatus = !networkOnline || !isAppVisible ? "offline" : presencePreference;

  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [showSplash, setShowSplash] = useState<boolean>(shouldShowInitialSplash);
  const [isSplashFading, setIsSplashFading] = useState<boolean>(false);

  const { isOnboardingActive, completeOnboarding, startOnboarding } = useOnboarding();
  const tabButtonRefsRef = useRef<Partial<Record<AppTab, HTMLButtonElement | null>>>({});
  const registerTabRef = (tab: AppTab, el: HTMLButtonElement | null) => {
    tabButtonRefsRef.current[tab] = el;
  };
  const getTabRef = (tab: AppTab) => tabButtonRefsRef.current[tab] ?? null;

  // Dynamic lists — loaded from Supabase
  const { jobs, setJobs, loadState: jobsLoadState, error: jobsError, isRefreshing: jobsRefreshing, refetch: refetchJobs, retry: retryJobsLoad } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const processedJobsSnapshotRef = useRef<string | null>(null);
  const interviewReminderTimersRef = useRef<number[]>([]);
  const closingReminderTimersRef = useRef<number[]>([]);
  const hasHydratedDurableStateRef = useRef(false);

  const [homePage, setHomePage] = useState<number>(1);
  const [savedPage, setSavedPage] = useState<number>(1);
  const [showPreviousListings, setShowPreviousListings] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePullToRefresh = async () => {
    void triggerHapticFeedback(settingHaptics);
    await refetchJobs();
  };

  const pullToRefresh = usePullToRefresh({
    containerRef: scrollContainerRef,
    enabled: jobsLoadState === "success" && (activeTab === "home" || activeTab === "explore"),
    isRefreshing: jobsRefreshing,
    onRefresh: handlePullToRefresh
  });

  // Set selected accent styles
  const activeAccent = ACCENTS[accentColor] || ACCENTS.blue;

  const { state: alertsState, actions: alertsActions } = useAlerts({
    profileStrengthLabel,
    profileMissingCount
  });

  const {
    toastMessage,
    notifications,
    selectedNotificationId,
    alertsFilter,
    unreadAlertsCount
  } = alertsState;

  const {
    dismissToast,
    setNotifications,
    setSelectedNotificationId,
    setAlertsFilter,
    triggerNotification: createAlert
  } = alertsActions;

  const triggerNotification = (message: string, category: "general" | "system" | "headline" = "system") => {
    const deliveryTime = getNotificationDeliveryTime(prefFrequency, prefQuietFrom, prefQuietTo);
    const delay = deliveryTime.getTime() - Date.now();
    const hasDeferredDeviceNotification = prefPush && delay > 0;
    const deliver = () => {
      createAlert(message, category);
      void triggerHapticFeedback(settingHaptics);
      if (prefPush && !hasDeferredDeviceNotification) void notifyDevice("SharpJob", message);
    };

    if (delay <= 0) {
      deliver();
      return;
    }

    window.setTimeout(deliver, delay);
    if (hasDeferredDeviceNotification) void notifyDevice("SharpJob", message, deliveryTime);
  };

  useEffect(() => {
    if (jobsLoadState !== "success" || jobs.length === 0) return;

    const jobIds = jobs.map(job => job.id).sort();
    const snapshot = JSON.stringify(jobIds);
    if (processedJobsSnapshotRef.current === snapshot) return;
    processedJobsSnapshotRef.current = snapshot;

    try {
      const storedJobIds = window.localStorage.getItem(SEEN_JOB_IDS_KEY);
      window.localStorage.setItem(SEEN_JOB_IDS_KEY, snapshot);
      if (!storedJobIds) return;

      const knownJobIds = new Set<string>(JSON.parse(storedJobIds) as string[]);
      const normalizedHeadline = applicantHeadline.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!prefMatches || !normalizedHeadline) return;

      const newMatches = jobs.filter(job => {
        if (knownJobIds.has(job.id)) return false;
        const normalizedTitle = job.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        return normalizedTitle.includes(normalizedHeadline) || normalizedHeadline.includes(normalizedTitle);
      });
      if (newMatches.length === 0) return;

      setNotifications(previous => {
        const newAlerts = newMatches
          .filter(job => !previous.some(notification =>
            notification.kind === "match" &&
            notification.jobId === job.id &&
            notification.desc.startsWith(`New headline match for "${applicantHeadline.trim()}".`)
          ))
          .map((job, index) => ({
            id: `new-match-${Date.now()}-${index}`,
            title: `New match: ${job.title}`,
            desc: `New headline match for "${applicantHeadline.trim()}". ${job.company} has just added this role. Open the job card to view the listing.`,
            time: "Just now",
            read: false,
            jobId: job.id,
            kind: "match" as const,
            category: "headline" as const
          }));

        return newAlerts.length > 0 ? [...newAlerts, ...previous] : previous;
      });

      const message = `${newMatches.length} new job match${newMatches.length === 1 ? "" : "es"} for your headline "${applicantHeadline.trim()}". Check Headline Alerts to view them.`;
      void notifyDevice("New SharpJob matches", message);
    } catch {
      // Ignore unavailable or corrupt local storage and keep the job feed usable.
    }
  }, [applicantHeadline, jobs, jobsLoadState, prefMatches, setNotifications]);

  useEffect(() => {
    interviewReminderTimersRef.current.forEach(timer => window.clearTimeout(timer));
    interviewReminderTimersRef.current = [];

    const reminderHours = [6, 3, 1] as const;
    for (const job of jobs) {
      if (!job.isSaved || !job.isApplied) continue;
      const shouldSchedule = prefInterviews && job.interviewTrackerStatus === "scheduled";
      void scheduleInterviewReminders(job.id, job.title, job.company, shouldSchedule ? job.interviewDate : undefined);
      if (!shouldSchedule || !job.interviewDate) continue;
      const interviewTime = new Date(job.interviewDate).getTime();
      if (Number.isNaN(interviewTime)) continue;

      for (const hoursBefore of reminderHours) {
        const delay = interviewTime - Date.now() - hoursBefore * 60 * 60 * 1000;
        if (delay <= 0) continue;
        const timer = window.setTimeout(() => {
          setNotifications(previous => {
            const title = `Interview in ${hoursBefore} hour${hoursBefore === 1 ? "" : "s"}: ${job.title}`;
            if (previous.some(notification => notification.title === title && notification.jobId === job.id)) return previous;
            return [{
              id: `interview-${job.id}-${hoursBefore}-${Date.now()}`,
              title,
              desc: `Your interview with ${job.company} is coming up. Review the job details and prepare your application notes.`,
              time: "Just now",
              read: false,
              jobId: job.id,
              kind: "interview",
              category: "system"
            }, ...previous];
          });
        }, delay);
        interviewReminderTimersRef.current.push(timer);
      }
    }

    return () => {
      interviewReminderTimersRef.current.forEach(timer => window.clearTimeout(timer));
      interviewReminderTimersRef.current = [];
    };
  }, [jobs, prefInterviews, setNotifications]);

  useEffect(() => {
    closingReminderTimersRef.current.forEach(timer => window.clearTimeout(timer));
    closingReminderTimersRef.current = [];

    const reminderDays = [3, 2, 1] as const;
    for (const job of jobs) {
      const closingDate = parseJobCloseDate(job.closes);
      const shouldSchedule = prefReminders && job.isSaved && !job.isApplied && Boolean(closingDate);
      void scheduleClosingDateReminders(job.id, job.title, job.company, shouldSchedule ? closingDate ?? undefined : undefined);
      if (!shouldSchedule || !closingDate) continue;

      for (const daysBefore of reminderDays) {
        const delay = closingDate.getTime() - Date.now() - daysBefore * 24 * 60 * 60 * 1000;
        if (delay <= 0) continue;
        const timer = window.setTimeout(() => {
          setNotifications(previous => {
            const title = `Job closes in ${daysBefore} day${daysBefore === 1 ? "" : "s"}: ${job.title}`;
            if (previous.some(notification => notification.title === title && notification.jobId === job.id)) return previous;
            return [{
              id: `closing-${job.id}-${daysBefore}-${Date.now()}`,
              title,
              desc: `${job.title} at ${job.company} is still in your Saved for later list. Apply before the closing date.`,
              time: "Just now",
              read: false,
              jobId: job.id,
              kind: "reminder",
              category: "system"
            }, ...previous];
          });
        }, delay);
        closingReminderTimersRef.current.push(timer);
      }
    }

    return () => {
      closingReminderTimersRef.current.forEach(timer => window.clearTimeout(timer));
      closingReminderTimersRef.current = [];
    };
  }, [jobs, prefReminders, setNotifications]);

  const switchTab = (tab: AppTab) => {
    trackEvent("tab_switch", { from: activeTab, to: tab });
    setActiveTab(tab);
    setSelectedJob(null);
    setIsApplying(false);
    if (tab === "alerts") {
      setSelectedNotificationId(null);
    }
  };

  const { state: applyState, actions: applyActions } = useApplyFlow({
    selectedJob,
    setJobs,
    triggerNotification,
    applicantName
  });

  const {
    isApplying,
    applyStep,
    uploadedResume,
    isUploading,
    uploadProgress,
    coverLetterText,
    isSubmittingApp,
    confettiActive
  } = applyState;

  const {
    setIsApplying,
    setApplyStep,
    setUploadedResume,
    setCoverLetterText,
    generateMockCoverLetter,
    handleMockUpload,
    handleRemoveResumeFromWizard,
    handleFinalSubmitApp
  } = applyActions;

  useEffect(() => {
    if (jobsLoadState !== "success" || hasHydratedDurableStateRef.current) return;
    let active = true;

    const hydrateDurableState = async () => {
      try {
        const [storedJobState, storedResumeSelection] = await Promise.all([
          readStoredValue(JOB_STATE_KEY),
          readStoredValue(RESUME_SELECTION_KEY)
        ]);
        if (!active) return;

        if (storedJobState) {
          const persistedJobs = JSON.parse(storedJobState) as Array<Partial<Job> & { id?: string }>;
          const persistedById = new Map(persistedJobs.filter((job): job is Partial<Job> & { id: string } => typeof job.id === "string").map(job => [job.id, job]));

          setJobs(previous => previous.map(job => {
            const persisted = persistedById.get(job.id);
            if (!persisted) return job;
            return {
              ...job,
              isSaved: Boolean(persisted.isSaved),
              isApplied: Boolean(persisted.isApplied),
              appliedStatus: persisted.appliedStatus,
              appliedDate: persisted.appliedDate,
              interviewTrackerStatus: persisted.interviewTrackerStatus,
              interviewDate: persisted.interviewDate
            };
          }));
        }

        if (storedResumeSelection) {
          const parsedResume = JSON.parse(storedResumeSelection) as { uploadedResume?: unknown };
          setUploadedResume(typeof parsedResume.uploadedResume === "string" ? parsedResume.uploadedResume : null);
        }
      } catch {
        // Keep current session data if persisted state is unavailable or corrupt.
      } finally {
        if (active) hasHydratedDurableStateRef.current = true;
      }
    };

    void hydrateDurableState();
    return () => {
      active = false;
    };
  }, [jobsLoadState, setJobs, setUploadedResume]);

  useEffect(() => {
    if (!hasHydratedDurableStateRef.current) return;

    const persistedJobs = jobs.map(job => ({
      id: job.id,
      isSaved: Boolean(job.isSaved),
      isApplied: Boolean(job.isApplied),
      appliedStatus: job.appliedStatus,
      appliedDate: job.appliedDate,
      interviewTrackerStatus: job.interviewTrackerStatus,
      interviewDate: job.interviewDate
    }));

    void writeStoredValue(JOB_STATE_KEY, JSON.stringify(persistedJobs));
  }, [jobs]);

  useEffect(() => {
    if (!hasHydratedDurableStateRef.current) return;
    void writeStoredValue(RESUME_SELECTION_KEY, JSON.stringify({ uploadedResume }));
  }, [uploadedResume]);

  const { state: jobActionState, actions: jobActionActions } = useJobActions({
    selectedJob,
    setJobs,
    setSelectedJob,
    triggerNotification,
    switchTab
  });

  const { openingJobId } = jobActionState;
  const {
    handleApplyOutbound,
    confirmAppliedOnSite,
    handleToggleSave,
    exportListingToText
  } = jobActionActions;

  const nowMs = Date.now();
  const activeJobs = getActiveJobs(jobs, nowMs);

  const { state: exploreState, actions: exploreActions } = useExploreFilters();

  const {
    exploreQuery,
    exploreCategory,
    exploreType,
    explorePage,
    isAdvSearchOpen,
    isAdvSearchApplied,
    advKeyword,
    advLocation,
    advExp,
    advTypes,
    advSalaryMin,
    advDate,
    advSkills,
    advSkillInput,
    recentSearches
  } = exploreState;

  const {
    setExploreQuery,
    setExploreCategory,
    setExploreType,
    setExplorePage,
    setAdvKeyword,
    setAdvLocation,
    setAdvExp,
    setAdvTypes,
    setAdvSalaryMin,
    setAdvDate,
    setAdvSkills,
    setAdvSkillInput,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    openAdvancedSearch,
    closeAdvancedSearch,
    applyAdvancedSearch,
    clearAdvancedSearch,
    resetFilters
  } = exploreActions;

  const filteredJobs = filterExploreJobs(activeJobs, {
    exploreQuery,
    exploreCategory,
    exploreType,
    isAdvSearchApplied,
    advKeyword,
    advLocation,
    advExp,
    advTypes,
    advSalaryMin,
    advSkills
  });

  const savedJobs = jobs.filter(job => job.isSaved);
  const previousSavedListings: PreviousSavedListing[] = getPreviousSavedListings(savedJobs, nowMs);
  const activeSavedJobs = getActiveSavedJobs(savedJobs, nowMs);

  const homePagination = paginateItems(activeJobs, homePage, LISTINGS_PER_PAGE);
  const explorePagination = paginateItems(filteredJobs, explorePage, LISTINGS_PER_PAGE);
  const savedPagination = paginateItems(activeSavedJobs, savedPage, LISTINGS_PER_PAGE);

  const savedVisibleCount = countSavedVisible(activeSavedJobs, previousSavedListings);
  const appliedJobsCount = countAppliedJobs(jobs);

  useEffect(() => {
    setHomePage(prev => Math.min(prev, homePagination.totalPages));
  }, [homePagination.totalPages]);

  useEffect(() => { scrollToTop(); }, [homePage]);
  useEffect(() => { scrollToTop(); }, [explorePage]);
  useEffect(() => { scrollToTop(); }, [savedPage]);
  useEffect(() => { scrollToTop(); }, [activeTab]);

  useEffect(() => {
    setExplorePage(prev => Math.min(prev, explorePagination.totalPages));
  }, [explorePagination.totalPages, setExplorePage]);

  useEffect(() => {
    setSavedPage(prev => Math.min(prev, savedPagination.totalPages));
  }, [savedPagination.totalPages]);

  useEffect(() => {
    if (showSplash) return;
    trackScreenView(`tab_${activeTab}`);
  }, [activeTab, showSplash]);

  useEffect(() => {
    if (!selectedJob) return;
    trackEvent("job_opened", {
      job_id: selectedJob.id,
      category: selectedJob.category,
      company: selectedJob.company
    });
  }, [selectedJob]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const scaleByTextSize: Record<string, number> = {
      "Small": 0.94,
      "Default": 1,
      "Large": 1.08,
      "Extra large": 1.16
    };

    const root = document.documentElement;
    const applyTextScale = () => {
      if (accessibilityTextSize === "System") {
        // Let OS/browser dynamic type manage sizing when available.
        root.style.fontSize = "";
        root.style.setProperty("-webkit-text-size-adjust", "auto");
        root.style.setProperty("text-size-adjust", "auto");
        return;
      }

      const scale = scaleByTextSize[accessibilityTextSize] ?? 1;
      root.style.fontSize = `${(16 * scale).toFixed(2)}px`;
      root.style.setProperty("-webkit-text-size-adjust", "100%");
      root.style.setProperty("text-size-adjust", "100%");
    };

    applyTextScale();

    if (accessibilityTextSize !== "System") return;

    // Re-apply when app regains focus or viewport changes so System mode stays in sync.
    const handleSystemResync = () => applyTextScale();
    window.addEventListener("focus", handleSystemResync);
    window.addEventListener("resize", handleSystemResync);
    document.addEventListener("visibilitychange", handleSystemResync);

    return () => {
      window.removeEventListener("focus", handleSystemResync);
      window.removeEventListener("resize", handleSystemResync);
      document.removeEventListener("visibilitychange", handleSystemResync);
    };
  }, [accessibilityTextSize]);

  const onToggleSaveTracked = (jobId: string) => {
    const target = jobs.find(job => job.id === jobId);
    trackEvent("job_save_toggle", {
      job_id: jobId,
      next_saved_state: target?.isSaved ? "unsave" : "save"
    });
    handleToggleSave(jobId);
  };

  const onApplyOutboundTracked = (job: Job, mode: ApplyOutboundMode) => {
    trackEvent("job_apply_outbound", {
      job_id: job.id,
      mode,
      company: job.company
    });
    handleApplyOutbound(job, mode);
  };

  const onFinalSubmitTracked = () => {
    if (selectedJob) {
      trackApplySubmitted({
        job_id: selectedJob.id,
        company: selectedJob.company,
        category: selectedJob.category,
        tab: activeTab
      });
    }
    handleFinalSubmitApp();
  };

  const onApplyAdvancedSearchTracked = () => {
    trackAdvancedSearchApplied({
      keyword: advKeyword.trim() || "none",
      location: advLocation.trim() || "none",
      experience: advExp ?? "any",
      types_count: advTypes.length,
      min_salary_k: advSalaryMin,
      date_posted: advDate,
      skills_count: advSkills.length
    });
    applyAdvancedSearch();
  };

  const onProfileSavedTracked = () => {
    void saveProfileDetails();
    trackProfileSaved({
      skills_count: profileSkills.length,
      has_headline: Boolean(applicantHeadline.trim()),
      has_location: Boolean(applicantLocation.trim()),
      strength: profileStrengthLabel
    });
  };

  const onHeadlineSaved = (headline: string) => {
    const normalizedHeadline = headline.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!normalizedHeadline) return;

    const matchingJobs = jobs.filter(job => {
      const normalizedTitle = job.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      return normalizedTitle.includes(normalizedHeadline) || normalizedHeadline.includes(normalizedTitle);
    });

    if (matchingJobs.length === 0) {
      triggerNotification(`No published roles matched "${headline.trim()}" yet.`, "headline");
      return;
    }

    setNotifications(previous => {
      const newAlerts = matchingJobs
        .filter(job => !previous.some(notification =>
          notification.kind === "match" &&
          notification.jobId === job.id &&
          notification.desc.startsWith(`Headline match for "${headline.trim()}".`)
        ))
        .map((job, index) => ({
          id: `headline-${Date.now()}-${index}`,
          title: `Headline match: ${job.title}`,
          desc: `Headline match for "${headline.trim()}". ${job.company} is hiring for this role. Open the job card to view the full listing.`,
          time: "Just now",
          read: false,
          jobId: job.id,
          kind: "match" as const,
          category: "headline" as const
        }));

      return newAlerts.length > 0 ? [...newAlerts, ...previous] : previous;
    });

    triggerNotification(`Found ${matchingJobs.length} role${matchingJobs.length !== 1 ? "s" : ""} matching "${headline.trim()}". Open Headline Alerts to view them.`, "headline");
  };

  const onRateApp = async () => {
    await requestAppRating(triggerNotification);
  };

  const onUpdateInterviewTracker = (
    jobId: string,
    interviewTrackerStatus: NonNullable<Job["interviewTrackerStatus"]>,
    interviewDate?: string
  ) => {
    const patch = (job: Job): Job => job.id === jobId
      ? {
          ...job,
          interviewTrackerStatus,
          interviewDate: interviewTrackerStatus === "scheduled" ? interviewDate : undefined
        }
      : job;

    setJobs(previous => previous.map(patch));
    setSelectedJob(previous => previous ? patch(previous) : null);

    const target = jobs.find(job => job.id === jobId);
    if (target) {
      const message = interviewTrackerStatus === "scheduled"
        ? `Interview date saved for ${target.title} at ${target.company}.`
        : `Interview tracker updated for ${target.title} at ${target.company}.`;
      triggerNotification(message);
    }

    void scheduleInterviewReminders(
      jobId,
      target?.title ?? "Your SharpJob interview",
      target?.company ?? "",
      prefInterviews && interviewTrackerStatus === "scheduled" ? interviewDate : undefined
    );
  };

  useEffect(() => {
    if (!showSplash) return;

    const fadeTimer = setTimeout(() => {
      setIsSplashFading(true);
    }, 1600);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      setIsSplashFading(false);
      setActiveTab("home");
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showSplash]);

  return (
    <PhoneShellFrame
      isMobileView={isMobileView}
      darkMode={darkMode}
      accentColor={accentColor}
      highContrast={accessibilityHighContrast}
      reduceMotion={accessibilityReduceMotion}
      dyslexiaFont={accessibilityDyslexiaFont}
      readableSpacing={accessibilityReadableSpacing}
      reduceTransparency={accessibilityReduceTransparency}
      focusIndicators={accessibilityFocusIndicators}
    >
            
            <TopStatusToastOverlay
              isMobileView={isMobileView}
              darkMode={darkMode}
              phoneTime={phoneTime}
              networkOnline={networkOnline}
              networkLabel={networkLabel}
              batteryCharging={batteryCharging}
              batteryLevel={batteryLevel}
              toastMessage={toastMessage}
              logoSrc={sharpJobLogo}
              onDismissToast={dismissToast}
            />

            <OfflineBanner darkMode={darkMode} visible={!networkOnline} />

            <PullToRefreshIndicator
              isMobileView={isMobileView}
              darkMode={darkMode}
              activeAccentPrimary={activeAccent.primary}
              pullDistance={pullToRefresh.pullDistance}
              isPulling={pullToRefresh.isPulling}
              isRefreshing={jobsRefreshing}
            />

            {/* 3. APP SCREEN BODY (DYNAMIC BY TAB) */}
            <div
              ref={scrollContainerRef}
              className={`flex-1 overflow-y-auto no-scrollbar flex flex-col ${isMobileView ? "pb-20" : "pb-16"} relative`}
              style={{
                transform: pullToRefresh.pullDistance > 0 ? `translateY(${pullToRefresh.pullDistance}px)` : undefined,
                transition: pullToRefresh.isPulling ? "none" : "transform 0.25s ease"
              }}
            >

              {/* JOBS LOADING / ERROR STATE */}
              {jobsLoadState === "loading" && (
                <JobListSkeleton darkMode={darkMode} count={4} />
              )}

              {jobsLoadState === "error" && (
                <div className="flex-1 flex items-center justify-center py-24">
                  <div className="text-center space-y-2 px-8">
                    <WifiOff className="h-10 w-10 text-slate-500 mx-auto mb-1 opacity-40" />
                    <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Could not load jobs</p>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Check your connection and try again.</p>
                    {import.meta.env.DEV && jobsError && (
                      <p className="text-[10px] text-red-400 mt-1 break-words max-w-xs mx-auto font-mono">{jobsError}</p>
                    )}
                    <button
                      onClick={() => void retryJobsLoad()}
                      className={`mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg border ${darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {jobsLoadState === "success" && (
              <>

              {/* HOME TAB SCREEN */}
              {activeTab === "home" && (
                <HomeTabScreen
                  darkMode={darkMode}
                  logoSrc={sharpJobLogo}
                  activeAccentText={activeAccent.text}
                  activeAccentPrimary={activeAccent.primary}
                  activeJobsCount={activeJobs.length}
                  homeJobsPage={homePagination.pageItems}
                  safeHomePage={homePagination.safePage}
                  homeTotalPages={homePagination.totalPages}
                  onSelectJob={setSelectedJob}
                  onToggleSave={onToggleSaveTracked}
                  onPreviousPage={() => setHomePage(prev => Math.max(1, prev - 1))}
                  onNextPage={() => setHomePage(prev => Math.min(homePagination.totalPages, prev + 1))}
                  onSelectPage={setHomePage}
                  onRefresh={() => void handlePullToRefresh()}
                />
              )}


              {/* EXPLORE TAB SCREEN */}
              {activeTab === "explore" && (
                <ExploreTabScreen
                  darkMode={darkMode}
                  activeAccentText={activeAccent.text}
                  activeAccentPrimary={activeAccent.primary}
                  exploreQuery={exploreQuery}
                  exploreCategory={exploreCategory}
                  exploreType={exploreType}
                  isAdvSearchApplied={isAdvSearchApplied}
                  filteredJobs={filteredJobs}
                  exploreJobsPage={explorePagination.pageItems}
                  safeExplorePage={explorePagination.safePage}
                  exploreTotalPages={explorePagination.totalPages}
                  recentSearches={recentSearches}
                  setExploreQuery={setExploreQuery}
                  setExploreCategory={setExploreCategory}
                  setExploreType={setExploreType}
                  onOpenAdvancedSearch={openAdvancedSearch}
                  onSelectJob={setSelectedJob}
                  onToggleSave={onToggleSaveTracked}
                  onPreviousPage={() => setExplorePage(prev => Math.max(1, prev - 1))}
                  onNextPage={() => setExplorePage(prev => Math.min(explorePagination.totalPages, prev + 1))}
                  onSelectPage={setExplorePage}
                  onResetFilters={resetFilters}
                  onCommitSearch={addRecentSearch}
                  onApplyRecentSearch={term => { setExploreQuery(term); addRecentSearch(term); }}
                  onRemoveRecentSearch={removeRecentSearch}
                  onClearRecentSearches={clearRecentSearches}
                />
              )}


              {/* SAVED TAB SCREEN */}
              {activeTab === "saved" && (
                <SavedTabScreen
                  darkMode={darkMode}
                  activeAccentText={activeAccent.text}
                  activeAccentPrimary={activeAccent.primary}
                  activeSavedJobs={activeSavedJobs}
                  savedJobsPage={savedPagination.pageItems}
                  safeSavedPage={savedPagination.safePage}
                  savedTotalPages={savedPagination.totalPages}
                  previousSavedListings={previousSavedListings}
                  showPreviousListings={showPreviousListings}
                  onToggleShowPreviousListings={() => setShowPreviousListings(prev => !prev)}
                  onSelectJob={setSelectedJob}
                  onToggleSave={onToggleSaveTracked}
                  onPreviousPage={() => setSavedPage(prev => Math.max(1, prev - 1))}
                  onNextPage={() => setSavedPage(prev => Math.min(savedPagination.totalPages, prev + 1))}
                  onSelectPage={setSavedPage}
                  onExploreListings={() => switchTab("explore")}
                  onExportListing={exportListingToText}
                  onUpdateInterviewTracker={onUpdateInterviewTracker}
                />
              )}


              {/* ALERTS TAB SCREEN (replaces the old Applied tracker) */}
              {activeTab === "alerts" && (
                <AlertsTabScreen
                  darkMode={darkMode}
                  activeAccentText={activeAccent.text}
                  activeAccentPrimary={activeAccent.primary}
                  notifications={notifications}
                  selectedNotificationId={selectedNotificationId}
                  alertsFilter={alertsFilter}
                  jobs={jobs}
                  setSelectedNotificationId={setSelectedNotificationId}
                  setAlertsFilter={setAlertsFilter}
                  setNotifications={setNotifications}
                  setSelectedJob={setSelectedJob}
                  triggerNotification={triggerNotification}
                />
              )}


              {/* PROFILE TAB SCREEN */}
              {activeTab === "profile" && (
                <ProfileTabScreen
                  darkMode={darkMode}
                  themeMode={themeMode}
                  activeAccentText={activeAccent.text}
                  activeAccentPrimary={activeAccent.primary}
                  activeAccentBorderActive={activeAccent.borderActive}
                  activeAccentBadge={activeAccent.badge}
                  accents={ACCENTS}
                  accentColor={accentColor}
                  appliedJobsCount={appliedJobsCount}
                  savedVisibleCount={savedVisibleCount}
                  profileStrengthLabel={profileStrengthLabel}
                  profileSubScreen={profileSubScreen}
                  applicantName={applicantName}
                  applicantEmail={applicantEmail}
                  applicantPhone={applicantPhone}
                  applicantHeadline={applicantHeadline}
                  applicantLocation={applicantLocation}
                  applicantAbout={applicantAbout}
                  applicantPortfolio={applicantPortfolio}
                  applicantLinkedIn={applicantLinkedIn}
                  profileSkills={profileSkills}
                  profileSkillDraft={profileSkillDraft}
                  candidateStatus={candidateStatus}
                  presenceStatus={presenceStatus}
                  presencePreference={presencePreference}
                  networkOnline={networkOnline}
                  profilePhotoUrl={profilePhotoUrl}
                  uploadedResume={uploadedResume}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  resumeVersions={resumeVersions}
                  autoAttachResume={autoAttachResume}
                  prefMatches={prefMatches}
                  prefInterviews={prefInterviews}
                  prefReminders={prefReminders}
                  prefDigest={prefDigest}
                  prefFrequency={prefFrequency}
                  prefQuietFrom={prefQuietFrom}
                  prefQuietTo={prefQuietTo}
                  prefEmail={prefEmail}
                  prefPush={prefPush}
                  settingHaptics={settingHaptics}
                  settingLanguage={settingLanguage}
                  helpQuery={helpQuery}
                  helpOpenFaq={helpOpenFaq}
                  feedbackText={feedbackText}
                  feedbackCategory={feedbackCategory}
                  feedbackRating={feedbackRating}
                  accessibilityTalkBackHints={accessibilityTalkBackHints}
                  accessibilityHighContrast={accessibilityHighContrast}
                  accessibilityReduceMotion={accessibilityReduceMotion}
                  accessibilityDyslexiaFont={accessibilityDyslexiaFont}
                  accessibilityReadableSpacing={accessibilityReadableSpacing}
                  accessibilityReduceTransparency={accessibilityReduceTransparency}
                  accessibilityFocusIndicators={accessibilityFocusIndicators}
                  accessibilityTextSize={accessibilityTextSize}
                  setThemeMode={setThemeMode}
                  setAccentColor={setAccentColor}
                  setProfileSubScreen={setProfileSubScreen}
                  setApplicantName={setApplicantName}
                  setApplicantEmail={setApplicantEmail}
                  setApplicantPhone={setApplicantPhone}
                  setApplicantHeadline={setApplicantHeadline}
                  setApplicantLocation={setApplicantLocation}
                  setApplicantAbout={setApplicantAbout}
                  setApplicantPortfolio={setApplicantPortfolio}
                  setApplicantLinkedIn={setApplicantLinkedIn}
                  setProfileSkills={setProfileSkills}
                  setProfileSkillDraft={setProfileSkillDraft}
                  setCandidateStatus={setCandidateStatus}
                  setPresencePreference={setPresencePreference}
                  setProfilePhotoUrl={setProfilePhotoUrl}
                  setUploadedResume={setUploadedResume}
                  setResumeVersions={setResumeVersions}
                  setAutoAttachResume={setAutoAttachResume}
                  setPrefMatches={setPrefMatches}
                  setPrefInterviews={setPrefInterviews}
                  setPrefReminders={setPrefReminders}
                  setPrefDigest={setPrefDigest}
                  setPrefFrequency={setPrefFrequency}
                  setPrefQuietFrom={setPrefQuietFrom}
                  setPrefQuietTo={setPrefQuietTo}
                  setPrefEmail={setPrefEmail}
                  setPrefPush={setPrefPush}
                  setSettingHaptics={setSettingHaptics}
                  setSettingLanguage={setSettingLanguage}
                  setHelpQuery={setHelpQuery}
                  setHelpOpenFaq={setHelpOpenFaq}
                  setFeedbackText={setFeedbackText}
                  setFeedbackCategory={setFeedbackCategory}
                  setFeedbackRating={setFeedbackRating}
                  setAccessibilityTalkBackHints={setAccessibilityTalkBackHints}
                  setAccessibilityHighContrast={setAccessibilityHighContrast}
                  setAccessibilityReduceMotion={setAccessibilityReduceMotion}
                  setAccessibilityDyslexiaFont={setAccessibilityDyslexiaFont}
                  setAccessibilityReadableSpacing={setAccessibilityReadableSpacing}
                  setAccessibilityReduceTransparency={setAccessibilityReduceTransparency}
                  setAccessibilityFocusIndicators={setAccessibilityFocusIndicators}
                  setAccessibilityTextSize={setAccessibilityTextSize}
                  onGoToSaved={() => switchTab("saved")}
                  onMockUpload={handleMockUpload}
                  onProfileSaved={onProfileSavedTracked}
                  onHeadlineSaved={onHeadlineSaved}
                  onRateApp={onRateApp}
                  onReplayOnboarding={startOnboarding}
                  triggerNotification={triggerNotification}
                />
              )}

              </> /* end jobsLoadState === "success" */
              )}

            </div>


            {/* SLIDABLE DETAILED JOB OVERLAY / DRAWER (INSIDE PHONE CONTAINER) */}
            {selectedJob && (
              <JobDetailsDrawer
                darkMode={darkMode}
                activeAccentText={activeAccent.text}
                activeAccentPrimary={activeAccent.primary}
                selectedJob={selectedJob}
                openingJobId={openingJobId}
                onBack={() => {
                  setSelectedJob(null);
                  setIsApplying(false);
                  setApplyStep(1);
                }}
                onToggleSave={onToggleSaveTracked}
                onApplyOutbound={onApplyOutboundTracked}
                onShare={(job) => triggerNotification(`Shared "${job.title}" with your clipboard!`)}
                onConfirmApplied={confirmAppliedOnSite}
                applyWizardSheet={
                  isApplying && selectedJob ? (
                    <ApplyWizardSheet
                      darkMode={darkMode}
                      activeAccentText={activeAccent.text}
                      activeAccentPrimary={activeAccent.primary}
                      selectedJob={selectedJob}
                      applyStep={applyStep}
                      setApplyStep={setApplyStep}
                      setIsApplying={setIsApplying}
                      setSelectedJob={setSelectedJob}
                      onSwitchTab={switchTab}
                      applicantName={applicantName}
                      applicantEmail={applicantEmail}
                      setApplicantName={setApplicantName}
                      setApplicantEmail={setApplicantEmail}
                      uploadedResume={uploadedResume}
                      setUploadedResume={setUploadedResume}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                      coverLetterText={coverLetterText}
                      setCoverLetterText={setCoverLetterText}
                      isSubmittingApp={isSubmittingApp}
                      confettiActive={confettiActive}
                      onMockUpload={handleMockUpload}
                      onGenerateCoverLetter={generateMockCoverLetter}
                      onFinalSubmit={onFinalSubmitTracked}
                      onResumeRemoved={handleRemoveResumeFromWizard}
                    />
                  ) : null
                }
              />
            )}


            {/* FULL SCREEN ADVANCED SEARCH MODAL (BOTTOM SHEET) */}
            {isAdvSearchOpen && (
              <AdvancedSearchSheet
                darkMode={darkMode}
                activeAccentPrimary={activeAccent.primary}
                activeAccentText={activeAccent.text}
                isAdvSearchApplied={isAdvSearchApplied}
                advKeyword={advKeyword}
                advLocation={advLocation}
                advExp={advExp}
                advTypes={advTypes}
                advSalaryMin={advSalaryMin}
                advDate={advDate}
                advSkills={advSkills}
                advSkillInput={advSkillInput}
                setAdvKeyword={setAdvKeyword}
                setAdvLocation={setAdvLocation}
                setAdvExp={setAdvExp}
                setAdvTypes={setAdvTypes}
                setAdvSalaryMin={setAdvSalaryMin}
                setAdvDate={setAdvDate}
                setAdvSkills={setAdvSkills}
                setAdvSkillInput={setAdvSkillInput}
                onClose={closeAdvancedSearch}
                onSearch={onApplyAdvancedSearchTracked}
                onClear={clearAdvancedSearch}
              />
            )}

            {/* 4. APP BOTTOM NAVIGATION BAR (FLUSH WITH BEZEL) */}
            <BottomNavigationBar
              isMobileView={isMobileView}
              darkMode={darkMode}
              activeTab={activeTab}
              activeAccentText={activeAccent.text}
              activeAccentPrimary={activeAccent.primary}
              savedVisibleCount={savedVisibleCount}
              unreadAlertsCount={unreadAlertsCount}
              onSelectTab={switchTab}
              registerTabRef={registerTabRef}
            />

            {!showSplash && jobsLoadState === "success" && (
              <OnboardingWalkthrough
                active={isOnboardingActive}
                darkMode={darkMode}
                isMobileView={isMobileView}
                activeAccentPrimary={activeAccent.primary}
                hapticsEnabled={settingHaptics}
                activeTab={activeTab}
                onSelectTab={switchTab}
                getTabRef={getTabRef}
                onFinish={completeOnboarding}
              />
            )}

            {showSplash && (
              <div
                className={`absolute inset-0 z-[120] flex items-center justify-center transition-opacity duration-500 ${
                  isSplashFading ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  backgroundImage: `url(${splashBackground})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="text-center px-6">
                  <img
                    src={sharpJobLogo}
                    alt="SharpJob"
                    className="w-44 max-w-[65vw] mx-auto drop-shadow-2xl"
                  />
                  <p className="mt-3 text-white/90 text-sm font-semibold tracking-wide">
                    By Player99 Inc.
                  </p>
                </div>
              </div>
            )}

    </PhoneShellFrame>
  );
}
