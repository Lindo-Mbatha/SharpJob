import { Capacitor } from "@capacitor/core";

let permissionChecked = false;
let notificationsAllowed = false;

export async function notifyDevice(title: string, body: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    if (!permissionChecked) {
      const permission = await LocalNotifications.checkPermissions();
      const granted = permission.display === "granted"
        ? permission.display
        : (await LocalNotifications.requestPermissions()).display;
      permissionChecked = true;
      notificationsAllowed = granted === "granted";
    }

    if (!notificationsAllowed) return;

    await LocalNotifications.createChannel({
      id: "sharpjob-alerts",
      name: "SharpJob alerts",
      description: "New jobs and profile alerts from SharpJob.",
      importance: 4,
      visibility: 1
    });

    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now() % 2147483647,
        title,
        body,
        channelId: "sharpjob-alerts"
      }]
    });
  } catch (error) {
    console.warn("[SharpJob] Device notification unavailable:", error);
  }
}
