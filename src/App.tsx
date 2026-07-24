import { useState, useEffect } from "react";
import sharpJobLogo from "./assets/sharpjobreallogo.png";
import splashBackground from "./assets/backgroundblue.jpg";
import { LISTINGS_PER_PAGE } from "./features/listings/constants";
import { INITIAL_JOBS } from "./features/listings/mockData";
import { Job, PreviousSavedListing } from "./features/listings/types";
import { getActiveJobs, getActiveSavedJobs, getPreviousSavedListings } from "./features/listings/utils";
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
import { BottomNavigationBar } from "./features/tabs/BottomNavigationBar";
import { PhoneShellFrame } from "./features/tabs/PhoneShellFrame";
import { useAlerts } from "./features/app/hooks/useAlerts";
import { useApplyFlow } from "./features/app/hooks/useApplyFlow";
import { useJobActions } from "./features/app/hooks/useJobActions";
import { useDeviceStatus } from "./features/app/hooks/useDeviceStatus";
import { useExploreFilters } from "./features/app/hooks/useExploreFilters";
import { useProfileSettings } from "./features/app/hooks/useProfileSettings";
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
    profileSubScreen,
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
    feedbackText
  } = profileState;

  const {
    setAccentColor,
    setDarkMode,
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
    setProfileSubScreen,
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

  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [showSplash, setShowSplash] = useState<boolean>(shouldShowInitialSplash);
  const [isSplashFading, setIsSplashFading] = useState<boolean>(false);

  // Dynamic lists
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [homePage, setHomePage] = useState<number>(1);
  const [savedPage, setSavedPage] = useState<number>(1);
  const [showPreviousListings, setShowPreviousListings] = useState<boolean>(false);

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
    triggerNotification
  } = alertsActions;

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
    advSkillInput
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

  const onRateApp = async () => {
    await requestAppRating(triggerNotification);
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

            {/* 3. APP SCREEN BODY (DYNAMIC BY TAB) */}
            <div className={`flex-1 overflow-y-auto no-scrollbar flex flex-col ${isMobileView ? "pb-20" : "pb-16"} relative`}>
              
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
                  uploadedResume={uploadedResume}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  resumeVersions={resumeVersions}
                  autoAttachResume={autoAttachResume}
                  prefMatches={prefMatches}
                  prefInterviews={prefInterviews}
                  prefViews={prefViews}
                  prefReminders={prefReminders}
                  prefDigest={prefDigest}
                  prefFrequency={prefFrequency}
                  prefQuietFrom={prefQuietFrom}
                  prefQuietTo={prefQuietTo}
                  prefEmail={prefEmail}
                  prefPush={prefPush}
                  settingWifiOnly={settingWifiOnly}
                  settingHaptics={settingHaptics}
                  settingSound={settingSound}
                  settingLanguage={settingLanguage}
                  cacheMB={cacheMB}
                  helpQuery={helpQuery}
                  helpOpenFaq={helpOpenFaq}
                  feedbackText={feedbackText}
                  setDarkMode={setDarkMode}
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
                  setUploadedResume={setUploadedResume}
                  setResumeVersions={setResumeVersions}
                  setAutoAttachResume={setAutoAttachResume}
                  setPrefMatches={setPrefMatches}
                  setPrefInterviews={setPrefInterviews}
                  setPrefViews={setPrefViews}
                  setPrefReminders={setPrefReminders}
                  setPrefDigest={setPrefDigest}
                  setPrefFrequency={setPrefFrequency}
                  setPrefQuietFrom={setPrefQuietFrom}
                  setPrefQuietTo={setPrefQuietTo}
                  setPrefEmail={setPrefEmail}
                  setPrefPush={setPrefPush}
                  setSettingWifiOnly={setSettingWifiOnly}
                  setSettingHaptics={setSettingHaptics}
                  setSettingSound={setSettingSound}
                  setSettingLanguage={setSettingLanguage}
                  setCacheMB={setCacheMB}
                  setHelpQuery={setHelpQuery}
                  setHelpOpenFaq={setHelpOpenFaq}
                  setFeedbackText={setFeedbackText}
                  onGoToSaved={() => switchTab("saved")}
                  onMockUpload={handleMockUpload}
                  onProfileSaved={onProfileSavedTracked}
                  onRateApp={onRateApp}
                  triggerNotification={triggerNotification}
                />
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
            />

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
