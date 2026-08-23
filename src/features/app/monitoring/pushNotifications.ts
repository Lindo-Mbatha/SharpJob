import { Capacitor } from "@capacitor/core";
import type { PushNotificationsPlugin } from "@capacitor/push-notifications";

let cachedPlugin: PushNotificationsPlugin | null = null;

async function getPushNotificationsPlugin(): Promise<PushNotificationsPlugin | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (cachedPlugin) return cachedPlugin;

  const { PushNotifications } = await import("@capacitor/push-notifications");
  cachedPlugin = PushNotifications;
  return cachedPlugin;
}

/**
 * Requests push permission, registers the device, and resolves with the
 * FCM/APNs token from the "registration" event — or null if permission was
 * denied or the plugin is unavailable (e.g. running in a browser).
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const PushNotifications = await getPushNotificationsPlugin();
    if (!PushNotifications) return null;

    const currentPermission = await PushNotifications.checkPermissions();
    const granted = currentPermission.receive === "granted"
      ? currentPermission.receive
      : (await PushNotifications.requestPermissions()).receive;

    if (granted !== "granted") return null;

    return await new Promise<string | null>(resolve => {
      let settled = false;

      const cleanup = () => {
        void registrationHandle.then(handle => handle.remove());
        void errorHandle.then(handle => handle.remove());
      };

      const registrationHandle = PushNotifications.addListener("registration", token => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(token.value);
      });

      const errorHandle = PushNotifications.addListener("registrationError", error => {
        if (settled) return;
        settled = true;
        console.warn("[SharpJob] Push registration error:", error.error);
        cleanup();
        resolve(null);
      });

      void PushNotifications.register();
    });
  } catch (error) {
    console.warn("[SharpJob] Push notification registration unavailable:", error);
    return null;
  }
}

export async function unregisterFromPushNotifications(): Promise<void> {
  try {
    const PushNotifications = await getPushNotificationsPlugin();
    if (!PushNotifications) return;

    await PushNotifications.removeAllListeners();
    await PushNotifications.unregister();
  } catch (error) {
    console.warn("[SharpJob] Push notification unregister unavailable:", error);
  }
}
