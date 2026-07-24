import { useEffect, useRef, useState } from "react";
import { ProfileSubScreen } from "../../tabs/ProfileTabScreen";
import { NotificationFrequency, NotificationSound } from "../types/domain";

const PROFILE_DETAILS_KEY = "sharpjob.profile.details.v1";

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

async function readStoredProfile(key: string): Promise<string | null> {
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

async function writeStoredProfile(key: string, value: string): Promise<void> {
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
  const [accentColor, setAccentColor] = useState<string>("blue");
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
  const [prefViews, setPrefViews] = useState<boolean>(true);
  const [prefReminders, setPrefReminders] = useState<boolean>(true);
  const [prefDigest, setPrefDigest] = useState<boolean>(false);
  const [prefFrequency, setPrefFrequency] = useState<NotificationFrequency>("instant");
  const [prefQuietFrom, setPrefQuietFrom] = useState<string>("22:00");
  const [prefQuietTo, setPrefQuietTo] = useState<string>("07:00");
  const [prefEmail, setPrefEmail] = useState<boolean>(true);
  const [prefPush, setPrefPush] = useState<boolean>(true);

  const [settingWifiOnly, setSettingWifiOnly] = useState<boolean>(false);
  const [settingHaptics, setSettingHaptics] = useState<boolean>(true);
  const [settingSound, setSettingSound] = useState<NotificationSound>("chime");
  const [settingLanguage, setSettingLanguage] = useState<string>("English");
  const [cacheMB, setCacheMB] = useState<number>(42);

  const [helpQuery, setHelpQuery] = useState<string>("");
  const [helpOpenFaq, setHelpOpenFaq] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");

  useEffect(() => {
    let active = true;

    const hydrateProfileDetails = async () => {
      try {
        const stored = await readStoredProfile(PROFILE_DETAILS_KEY);
        if (!active || !stored) {
          hasHydratedRef.current = true;
          return;
        }

        const parsed = JSON.parse(stored) as Partial<PersistedProfileDetails>;

        setApplicantName(typeof parsed.applicantName === "string" ? parsed.applicantName : "");
        setApplicantEmail(typeof parsed.applicantEmail === "string" ? parsed.applicantEmail : "");
        setApplicantPhone(typeof parsed.applicantPhone === "string" ? parsed.applicantPhone : "");
        setApplicantHeadline(typeof parsed.applicantHeadline === "string" ? parsed.applicantHeadline : "");
        setApplicantLocation(typeof parsed.applicantLocation === "string" ? parsed.applicantLocation : "");
        setApplicantAbout(typeof parsed.applicantAbout === "string" ? parsed.applicantAbout : "");
        setApplicantPortfolio(typeof parsed.applicantPortfolio === "string" ? parsed.applicantPortfolio : "");
        setApplicantLinkedIn(typeof parsed.applicantLinkedIn === "string" ? parsed.applicantLinkedIn : "");
        setProfileSkills(Array.isArray(parsed.profileSkills) ? parsed.profileSkills.filter((skill): skill is string => typeof skill === "string") : []);
      } catch (_error) {
        // Ignore corrupt/missing payloads and keep first-time empty defaults.
      } finally {
        if (active) {
          hasHydratedRef.current = true;
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

    await writeStoredProfile(PROFILE_DETAILS_KEY, JSON.stringify(payload));
  };

  return {
    state: {
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
    },
    actions: {
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
    }
  };
}
