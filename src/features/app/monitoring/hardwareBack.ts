import { Capacitor } from "@capacitor/core";

/**
 * Registers the Android hardware back button handler. This app has no browser
 * history/router, so Capacitor's default "go back or exit" behavior can't help —
 * the caller is responsible for deciding what "back" means from its own UI state.
 * Resolves to a no-op cleanup on web/iOS where there's no hardware back button.
 */
export async function addHardwareBackButtonListener(onBack: () => void): Promise<() => void> {
  if (!Capacitor.isNativePlatform()) return () => {};

  try {
    const { App } = await import("@capacitor/app");
    const handle = await App.addListener("backButton", () => {
      onBack();
    });

    return () => {
      void handle.remove();
    };
  } catch (error) {
    console.warn("[SharpJob] Hardware back button listener unavailable:", error);
    return () => {};
  }
}

export async function exitNativeApp(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { App } = await import("@capacitor/app");
    await App.exitApp();
  } catch (error) {
    console.warn("[SharpJob] Exit app unavailable:", error);
  }
}
