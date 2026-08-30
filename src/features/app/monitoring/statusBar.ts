import { Capacitor } from "@capacitor/core";

type StatusBarModule = typeof import("@capacitor/status-bar");

let cachedModule: StatusBarModule | null = null;

async function getStatusBarModule(): Promise<StatusBarModule | null> {
  if (!Capacitor.isNativePlatform()) return null;
  if (cachedModule) return cachedModule;

  cachedModule = await import("@capacitor/status-bar");
  return cachedModule;
}

/**
 * Matches the status bar icon color to the app's theme. This project targets
 * Android 16 (API 36), where edge-to-edge is enforced unconditionally — the
 * plugin's `overlaysWebView`/`backgroundColor` controls are no-ops there, so
 * `style` (icon color only) is the only thing left to set, and deliberately
 * the only thing this calls.
 */
export async function syncStatusBarStyle(darkMode: boolean): Promise<void> {
  try {
    const statusBarModule = await getStatusBarModule();
    if (!statusBarModule) return;

    const { StatusBar, Style } = statusBarModule;
    // Style.Dark -> light icons, for a dark app background. Style.Light -> dark
    // icons, for a light app background. (Named after the status bar's own
    // "style", not the icon color it produces.)
    await StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light });
  } catch (error) {
    console.warn("[SharpJob] Status bar style sync unavailable:", error);
  }
}
