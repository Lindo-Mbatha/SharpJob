import { useEffect, useState } from "react";
import { AlertNotification } from "../../alerts/types";
import { countUnreadAlerts } from "../../alerts/selectors";
import { AlertsFilter } from "../types/domain";

const INITIAL_NOTIFICATIONS: AlertNotification[] = [
  { id: "1", title: "Welcome to SharpJob! 🎉", kind: "system", desc: "Your account is live. Start with the Home feed for a curated shortlist, or jump into Explore to dial things in with Advanced Search. Pro tip: tap the bookmark on any card to build a save-list you can apply to later in a single tap.", time: "Just now", read: false },
  { id: "2", title: "Profile Setup Is Optional ℹ️", kind: "system", desc: "You can edit your details any time in Edit Profile under the Profile tab. Pro tip: Add your target job position in your Headline to get instant notifications when matching roles become available. This is optional for now, and some profile-based recruiter features will roll out in future updates.", time: "Just now", read: false },
  { id: "3", title: "New Job Match ✨", kind: "match", jobId: "job-1", desc: "Airbnb just published a Product Designer role that lines up with four of your saved skills — Figma, Design Systems, Prototyping and User Testing. The salary range sits inside your preferred band and applications close on Oct 28, so applying in the next 48 hours meaningfully improves your odds of a first-round review.", time: "2h ago", read: false },
  { id: "4", title: "Interview Request 📅", kind: "interview", jobId: "job-2", desc: "Great news — the API Foundations team at Stripe has reviewed your Backend Developer application and wants to schedule a 45-minute code walkthrough next week. We've emailed three calendar slots to your primary address; reply from there or confirm inside the role details to lock one in. Please have a recent project ready to walk through.", time: "1d ago", read: true },
  { id: "5", title: "Application Viewed 👀", kind: "viewed", jobId: "job-4", desc: "A recruiter at Snowflake opened your Senior Cloud Engineer application 12 minutes ago. First-response emails typically land within 48 hours of a view, so keep an eye on your inbox — and make sure your phone's notification permissions are on so we can ping you the moment something moves.", time: "3h ago", read: false },
  { id: "6", title: "Saved Role Closing Soon ⏰", kind: "reminder", jobId: "job-5", desc: "Heads up — the Brand Strategist opening at Duolingo that you bookmarked closes in under 48 hours. If it's still on your shortlist, now's the moment: open the save-list, tap Details, and use the one-tap cover-letter generator to ship a polished application in about ninety seconds.", time: "5h ago", read: false },
  { id: "7", title: "Profile Strength: 98% 💪", kind: "profile", desc: "You're one step away from a perfect profile. Adding a single portfolio link or a short 'About me' blurb unlocks the 100% badge, which — according to our internal data — increases recruiter first-response rates by roughly 2.3x. Head to the Profile tab to finish it off.", time: "Yesterday", read: true }
];

export function useAlerts({
  profileStrengthLabel,
  profileMissingCount
}: {
  profileStrengthLabel: string;
  profileMissingCount: number;
}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AlertNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [alertsFilter, setAlertsFilter] = useState<AlertsFilter>("all");

  useEffect(() => {
    const profileTitle = `Profile Strength: ${profileStrengthLabel} 💪`;
    const profileDesc = profileMissingCount === 0
      ? "Your profile is fully complete. You're maximising recruiter visibility and ready to apply quickly."
      : `You are ${profileMissingCount} field${profileMissingCount === 1 ? "" : "s"} away from a complete profile. Fill out missing details in Edit Profile to improve recruiter visibility.`;

    setNotifications(prev => {
      let changed = false;
      const next = prev.map(n => {
        if (n.kind !== "profile") return n;
        if (n.title === profileTitle && n.desc === profileDesc) return n;
        changed = true;
        return { ...n, title: profileTitle, desc: profileDesc };
      });
      return changed ? next : prev;
    });
  }, [profileStrengthLabel, profileMissingCount]);

  const triggerNotification = (message: string) => {
    setNotifications(prev => {
      const newId = (prev.length + 1).toString();
      const newNotif: AlertNotification = {
        id: newId,
        title: "SharpJob Alert 🔔",
        desc: message,
        time: "Just now",
        read: false
      };
      return [newNotif, ...prev];
    });

    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const unreadAlertsCount = countUnreadAlerts(notifications);
  const dismissToast = () => setToastMessage(null);

  return {
    state: {
      toastMessage,
      notifications,
      selectedNotificationId,
      alertsFilter,
      unreadAlertsCount
    },
    actions: {
      dismissToast,
      setNotifications,
      setSelectedNotificationId,
      setAlertsFilter,
      triggerNotification
    }
  };
}
