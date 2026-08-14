import { useEffect, useState } from "react";
import { AlertNotification } from "../../alerts/types";
import { AlertCategory } from "../../alerts/types";
import { countUnreadAlerts } from "../../alerts/selectors";
import { AlertsFilter } from "../types/domain";

const INITIAL_NOTIFICATIONS: AlertNotification[] = [
  { id: "1", title: "Welcome to SharpJob! 🎉", kind: "system", category: "general", desc: "Your account is live. Start with the Home feed for a curated shortlist, or jump into Explore to dial things in with Advanced Search. Pro tip: tap the bookmark on any card to build a save-list you can apply to later in a single tap.", time: "Just now", read: false },
  { id: "2", title: "Profile Setup Is Optional ℹ️", kind: "system", category: "general", desc: "You can edit your details any time in Edit Profile under the Profile tab. Pro tip: Add your target job position in your Headline to get instant notifications when matching roles become available. This is optional for now, and some profile-based recruiter features will roll out in future updates.", time: "Just now", read: false }
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

  const triggerNotification = (message: string, category: AlertCategory = "system") => {
    setNotifications(prev => {
      const newId = (prev.length + 1).toString();
      const newNotif: AlertNotification = {
        id: newId,
        title: "SharpJob Alert 🔔",
        desc: message,
        time: "Just now",
        read: false,
        category
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
