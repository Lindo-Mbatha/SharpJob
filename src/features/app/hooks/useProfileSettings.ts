import { useEffect, useRef, useState } from "react";
import { ProfileSubScreen } from "../../tabs/ProfileTabScreen";
import { FeedbackCategory, NotificationFrequency, ThemeMode } from "../types/domain";
import { useSystemColorScheme } from "./useSystemColorScheme";

const PROFILE_DETAILS_KEY = "sharpjob.profile.details.v1";
const ACCESSIBILITY_SETTINGS_KEY = "sharpjob.profile.accessibility.v1";
const NOTIFICATION_PREFERENCES_KEY = "sharpjob.profile.notifications.v1";
const APP_SETTINGS_KEY = "sharpjob.profile.app-settings.v1";

export type AccessibilityTextSize = "System" | "Small" | "Default" | "Large" | "Extra large";

type PersistedProfileDetails = {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantHeadline: string;
  applicantLocation: string;
  applicantAbout: string;
  applicantPortfolio: string;
  applicantLinkedIn: string;
  profileSkills: string[];
};

type PersistedAccessibilitySettings = {
  accessibilityTalkBackHints: boolean;
  accessibilityHighContrast: boolean;
  accessibilityReduceMotion: boolean;
  accessibilityDyslexiaFont: boolean;
  accessibilityReadableSpacing: boolean;
  accessibilityReduceTransparency: boolean;
  accessibilityFocusIndicators: boolean;
  accessibilityTextSize: AccessibilityTextSize;
};

type PersistedNotificationPreferences = {
  prefMatches: boolean;
  prefInterviews: boolean;
  prefReminders: boolean;
  prefDigest: boolean;
  prefFrequency: NotificationFrequency;
  prefQuietFrom: string;
  prefQuietTo: string;
  prefEmail: boolean;
  prefPush: boolean;
};

type PersistedAppSettings = {
  accentColor: string;
  themeMode: ThemeMode;
  resumeVersions: Array<{ name: string; date: string; size: string; active: boolean }>;
  autoAttachResume: boolean;
  settingHaptics: boolean;
  settingLanguage: string;
};

type PreferencesLike = {
  get: (options: { key: string }) => Promise<{ value: string | null }>;
  set: (options: { key: string; value: string }) => Promise<void>;
};

let cachedPreferences: PreferencesLike | null = null;

async function getPreferencesApi(): Promise<PreferencesLike | null> {
  if (cachedPreferences) return cachedPreferences;

  try {
    const moduleName = "@capacitor/preferences";
    const mod = await import(/* @vite-ignore */ moduleName);
    if (!mod?.Preferences) return null;
    cachedPreferences = mod.Preferences as PreferencesLike;
    return cachedPreferences;
  } catch {
    return null;
  }
}

export async function readStoredValue(key: string): Promise<string | null> {
  const preferences = await getPreferencesApi();
  if (preferences) {
    const result = await preferences.get({ key });
    return result.value;
  }

  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }

  return null;
}

export async function writeStoredValue(key: string, value: string): Promise<void> {
  const preferences = await getPreferencesApi();
  if (preferences) {
    await preferences.set({ key, value });
    return;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

export function useProfileSettings() {
  const hasHydratedRef = useRef(false);
  const hasHydratedAccessibilityRef = useRef(false);
  const [accentColor, setAccentColor] = useState<string>("blue");
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const systemPrefersDark = useSystemColorScheme();
  const darkMode = themeMode === "system" ? systemPrefersDark : themeMode === "dark";

  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantEmail, setApplicantEmail] = useState<string>("");
  const [applicantPhone, setApplicantPhone] = useState<string>("");
  const [applicantHeadline, setApplicantHeadline] = useState<string>("");
  const [applicantLocation, setApplicantLocation] = useState<string>("");
  const [applicantAbout, setApplicantAbout] = useState<string>("");
  const [applicantPortfolio, setApplicantPortfolio] = useState<string>("");
  const [applicantLinkedIn, setApplicantLinkedIn] = useState<string>("");
  const [profileSkills, setProfileSkills] = useState<string[]>([]);
  const [profileSkillDraft, setProfileSkillDraft] = useState<string>("");
  const [profileSubScreen, setProfileSubScreen] = useState<ProfileSubScreen>(null);

  const [resumeVersions, setResumeVersions] = useState<Array<{ name: string; date: string; size: string; active: boolean }>>([]);
  const [autoAttachResume, setAutoAttachResume] = useState<boolean>(false);

  const [prefMatches, setPrefMatches] = useState<boolean>(true);
  const [prefInterviews, setPrefInterviews] = useState<boolean>(true);
  const [prefReminders, setPrefReminders] = useState<boolean>(true);
  const [prefDigest, setPrefDigest] = useState<boolean>(false);
  const [prefFrequency, setPrefFrequency] = useState<NotificationFrequency>("instant");
  const [prefQuietFrom, setPrefQuietFrom] = useState<string>("22:00");
  const [prefQuietTo, setPrefQuietTo] = useState<string>("07:00");
  const [prefEmail, setPrefEmail] = useState<boolean>(false);
  const [prefPush, setPrefPush] = useState<boolean>(true);

  const [settingHaptics, setSettingHaptics] = useState<boolean>(true);
  const [settingLanguage, setSettingLanguage] = useState<string>("English");

  const [helpQuery, setHelpQuery] = useState<string>("");
  const [helpOpenFaq, setHelpOpenFaq] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>("Suggestion");
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [accessibilityTalkBackHints, setAccessibilityTalkBackHints] = useState<boolean>(false);
  const [accessibilityHighContrast, setAccessibilityHighContrast] = useState<boolean>(false);
  const [accessibilityReduceMotion, setAccessibilityReduceMotion] = useState<boolean>(false);
  const [accessibilityDyslexiaFont, setAccessibilityDyslexiaFont] = useState<boolean>(false);
  const [accessibilityReadableSpacing, setAccessibilityReadableSpacing] = useState<boolean>(false);
  const [accessibilityReduceTransparency, setAccessibilityReduceTransparency] = useState<boolean>(false);
  const [accessibilityFocusIndicators, setAccessibilityFocusIndicators] = useState<boolean>(false);
  const [accessibilityTextSize, setAccessibilityTextSize] = useState<AccessibilityTextSize>("Default");

  useEffect(() => {
    let active = true;

    const hydrateProfileDetails = async () => {
      try {
        const [storedProfile, storedAccessibility, storedNotifications, storedAppSettings] = await Promise.all([
          readStoredValue(PROFILE_DETAILS_KEY),
          readStoredValue(ACCESSIBILITY_SETTINGS_KEY),
          readStoredValue(NOTIFICATION_PREFERENCES_KEY),
          readStoredValue(APP_SETTINGS_KEY)
        ]);

        if (!active) {
          hasHydratedRef.current = true;
          hasHydratedAccessibilityRef.current = true;
          return;
        }

        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile) as Partial<PersistedProfileDetails>;

          setApplicantName(typeof parsedProfile.applicantName === "string" ? parsedProfile.applicantName : "");
          setApplicantEmail(typeof parsedProfile.applicantEmail === "string" ? parsedProfile.applicantEmail : "");
          setApplicantPhone(typeof parsedProfile.applicantPhone === "string" ? parsedProfile.applicantPhone : "");
          setApplicantHeadline(typeof parsedProfile.applicantHeadline === "string" ? parsedProfile.applicantHeadline : "");
          setApplicantLocation(typeof parsedProfile.applicantLocation === "string" ? parsedProfile.applicantLocation : "");
          setApplicantAbout(typeof parsedProfile.applicantAbout === "string" ? parsedProfile.applicantAbout : "");
          setApplicantPortfolio(typeof parsedProfile.applicantPortfolio === "string" ? parsedProfile.applicantPortfolio : "");
          setApplicantLinkedIn(typeof parsedProfile.applicantLinkedIn === "string" ? parsedProfile.applicantLinkedIn : "");
          setProfileSkills(Array.isArray(parsedProfile.profileSkills) ? parsedProfile.profileSkills.filter((skill): skill is string => typeof skill === "string") : []);
        }

        if (storedAccessibility) {
          const parsedAccessibility = JSON.parse(storedAccessibility) as Partial<PersistedAccessibilitySettings>;
          const validTextSizes: AccessibilityTextSize[] = ["System", "Small", "Default", "Large", "Extra large"];

          setAccessibilityTalkBackHints(Boolean(parsedAccessibility.accessibilityTalkBackHints));
          setAccessibilityHighContrast(Boolean(parsedAccessibility.accessibilityHighContrast));
          setAccessibilityReduceMotion(Boolean(parsedAccessibility.accessibilityReduceMotion));
          setAccessibilityDyslexiaFont(Boolean(parsedAccessibility.accessibilityDyslexiaFont));
          setAccessibilityReadableSpacing(Boolean(parsedAccessibility.accessibilityReadableSpacing));
          setAccessibilityReduceTransparency(Boolean(parsedAccessibility.accessibilityReduceTransparency));
          setAccessibilityFocusIndicators(Boolean(parsedAccessibility.accessibilityFocusIndicators));
          setAccessibilityTextSize(
            typeof parsedAccessibility.accessibilityTextSize === "string" &&
              validTextSizes.includes(parsedAccessibility.accessibilityTextSize as AccessibilityTextSize)
              ? (parsedAccessibility.accessibilityTextSize as AccessibilityTextSize)
              : "Default"
          );
        }

        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications) as Partial<PersistedNotificationPreferences>;
          const validFrequencies: NotificationFrequency[] = ["instant", "hourly", "daily"];

          setPrefMatches(Boolean(parsedNotifications.prefMatches));
          setPrefInterviews(Boolean(parsedNotifications.prefInterviews));
          setPrefReminders(Boolean(parsedNotifications.prefReminders));
          setPrefDigest(Boolean(parsedNotifications.prefDigest));
          setPrefFrequency(validFrequencies.includes(parsedNotifications.prefFrequency as NotificationFrequency) ? parsedNotifications.prefFrequency as NotificationFrequency : "instant");
          setPrefQuietFrom(typeof parsedNotifications.prefQuietFrom === "string" ? parsedNotifications.prefQuietFrom : "22:00");
          setPrefQuietTo(typeof parsedNotifications.prefQuietTo === "string" ? parsedNotifications.prefQuietTo : "07:00");
          setPrefEmail(Boolean(parsedNotifications.prefEmail));
          setPrefPush(Boolean(parsedNotifications.prefPush));
        }

        if (storedAppSettings) {
          const parsedSettings = JSON.parse(storedAppSettings) as Partial<PersistedAppSettings> & { darkMode?: boolean };
          const validThemeModes: ThemeMode[] = ["light", "dark", "system"];
          setAccentColor(typeof parsedSettings.accentColor === "string" ? parsedSettings.accentColor : "blue");
          if (typeof parsedSettings.themeMode === "string" && validThemeModes.includes(parsedSettings.themeMode as ThemeMode)) {
            setThemeMode(parsedSettings.themeMode as ThemeMode);
          } else if (typeof parsedSettings.darkMode === "boolean") {
            // Migrate settings persisted before the System theme option existed.
            setThemeMode(parsedSettings.darkMode ? "dark" : "light");
          } else {
            setThemeMode("system");
          }
          setResumeVersions(Array.isArray(parsedSettings.resumeVersions) ? parsedSettings.resumeVersions.filter((version): version is { name: string; date: string; size: string; active: boolean } =>
            typeof version?.name === "string" && typeof version.date === "string" && typeof version.size === "string" && typeof version.active === "boolean"
          ) : []);
          setAutoAttachResume(Boolean(parsedSettings.autoAttachResume));
          setSettingHaptics(typeof parsedSettings.settingHaptics === "boolean" ? parsedSettings.settingHaptics : true);
          setSettingLanguage(typeof parsedSettings.settingLanguage === "string" ? parsedSettings.settingLanguage : "English");
        }
      } catch (_error) {
        // Ignore corrupt/missing payloads and keep first-time empty defaults.
      } finally {
        if (active) {
          hasHydratedRef.current = true;
          hasHydratedAccessibilityRef.current = true;
        }
      }
    };

    void hydrateProfileDetails();

    return () => {
      active = false;
    };
  }, []);

  const saveProfileDetails = async () => {
    if (!hasHydratedRef.current) return;

    const payload: PersistedProfileDetails = {
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantHeadline,
      applicantLocation,
      applicantAbout,
      applicantPortfolio,
      applicantLinkedIn,
      profileSkills
    };

    await writeStoredValue(PROFILE_DETAILS_KEY, JSON.stringify(payload));
  };

  useEffect(() => {
    if (!hasHydratedAccessibilityRef.current) return;

    const payload: PersistedAccessibilitySettings = {
      accessibilityTalkBackHints,
      accessibilityHighContrast,
      accessibilityReduceMotion,
      accessibilityDyslexiaFont,
      accessibilityReadableSpacing,
      accessibilityReduceTransparency,
      accessibilityFocusIndicators,
      accessibilityTextSize
    };

    void writeStoredValue(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify(payload));
  }, [
    accessibilityTalkBackHints,
    accessibilityHighContrast,
    accessibilityReduceMotion,
    accessibilityDyslexiaFont,
    accessibilityReadableSpacing,
    accessibilityReduceTransparency,
    accessibilityFocusIndicators,
    accessibilityTextSize
  ]);

  useEffect(() => {
    if (!hasHydratedAccessibilityRef.current) return;

    const payload: PersistedNotificationPreferences = {
      prefMatches,
      prefInterviews,
      prefReminders,
      prefDigest,
      prefFrequency,
      prefQuietFrom,
      prefQuietTo,
      prefEmail,
      prefPush
    };

    void writeStoredValue(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(payload));
  }, [prefMatches, prefInterviews, prefReminders, prefDigest, prefFrequency, prefQuietFrom, prefQuietTo, prefEmail, prefPush]);

  useEffect(() => {
    if (!hasHydratedAccessibilityRef.current) return;

    const payload: PersistedAppSettings = {
      accentColor,
      themeMode,
      resumeVersions,
      autoAttachResume,
      settingHaptics,
      settingLanguage
    };

    void writeStoredValue(APP_SETTINGS_KEY, JSON.stringify(payload));
  }, [accentColor, themeMode, resumeVersions, autoAttachResume, settingHaptics, settingLanguage]);

  return {
    state: {
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
    },
    actions: {
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
    }
  };
}
