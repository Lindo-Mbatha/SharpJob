import { Capacitor } from "@capacitor/core";

let permissionChecked = false;
let notificationsAllowed = false;

async function getLocalNotifications() {
  if (!Capacitor.isNativePlatform()) return null;

  const { LocalNotifications } = await import("@capacitor/local-notifications");
  if (!permissionChecked) {
    const permission = await LocalNotifications.checkPermissions();
    const granted = permission.display === "granted"
      ? permission.display
      : (await LocalNotifications.requestPermissions()).display;
    permissionChecked = true;
    notificationsAllowed = granted === "granted";
  }

  if (!notificationsAllowed) return null;

  await LocalNotifications.createChannel({
    id: "sharpjob-alerts",
    name: "SharpJob alerts",
    description: "New jobs and profile alerts from SharpJob.",
    importance: 4,
    visibility: 1
  });

  return LocalNotifications;
}

function reminderId(jobId: string, offset: number, reminderType: string): number {
  let hash = 0;
  for (const character of `${reminderType}:${jobId}`) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return (Math.abs(hash) % 700000000) + offset;
}

export async function notifyDevice(title: string, body: string, at?: Date): Promise<void> {
  try {
    const LocalNotifications = await getLocalNotifications();
    if (!LocalNotifications) return;

    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now() % 2147483647,
        title,
        body,
        channelId: "sharpjob-alerts",
        schedule: at && at.getTime() > Date.now() ? { at } : undefined
      }]
    });
  } catch (error) {
    console.warn("[SharpJob] Device notification unavailable:", error);
  }
}

export async function scheduleInterviewReminders(jobId: string, title: string, company: string, interviewDate?: string): Promise<void> {
  try {
    const LocalNotifications = await getLocalNotifications();
    if (!LocalNotifications) return;

    const reminderHours = [6, 3, 1] as const;
    await LocalNotifications.cancel({
      notifications: reminderHours.map(hoursBefore => ({ id: reminderId(jobId, hoursBefore, "interview") }))
    });

    if (!interviewDate) return;
    const scheduledAt = new Date(interviewDate);
    if (Number.isNaN(scheduledAt.getTime())) return;

    const notifications = reminderHours
      .map(hoursBefore => ({ hoursBefore, at: new Date(scheduledAt.getTime() - hoursBefore * 60 * 60 * 1000) }))
      .filter(reminder => reminder.at.getTime() > Date.now())
      .map(({ hoursBefore, at }) => ({
        id: reminderId(jobId, hoursBefore, "interview"),
        title: `Interview in ${hoursBefore} hour${hoursBefore === 1 ? "" : "s"}`,
        body: `${title} at ${company} is coming up. Open SharpJob to review the details.`,
        channelId: "sharpjob-alerts",
        schedule: { at }
      }));

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (error) {
    console.warn("[SharpJob] Interview reminder unavailable:", error);
  }
}

export async function scheduleClosingDateReminders(jobId: string, title: string, company: string, closingDate?: Date): Promise<void> {
  try {
    const LocalNotifications = await getLocalNotifications();
    if (!LocalNotifications) return;

    const reminderDays = [3, 2, 1] as const;
    await LocalNotifications.cancel({
      notifications: reminderDays.map(daysBefore => ({ id: reminderId(jobId, daysBefore, "closing") }))
    });

    if (!closingDate || Number.isNaN(closingDate.getTime())) return;

    const notifications = reminderDays
      .map(daysBefore => ({ daysBefore, at: new Date(closingDate.getTime() - daysBefore * 24 * 60 * 60 * 1000) }))
      .filter(reminder => reminder.at.getTime() > Date.now())
      .map(({ daysBefore, at }) => ({
        id: reminderId(jobId, daysBefore, "closing"),
        title: `Job closes in ${daysBefore} day${daysBefore === 1 ? "" : "s"}`,
        body: `${title} at ${company} is in your Saved for later list. Apply before it closes.`,
        channelId: "sharpjob-alerts",
        schedule: { at }
      }));

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (error) {
    console.warn("[SharpJob] Closing-date reminder unavailable:", error);
  }
}
