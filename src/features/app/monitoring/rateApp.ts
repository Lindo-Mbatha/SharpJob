import { Capacitor } from "@capacitor/core";
import { AppReview } from "@capawesome/capacitor-app-review";
import { captureError, captureRecoverableError, trackEvent } from "./telemetry";

const DEFAULT_ANDROID_APP_ID = "com.player99inc.sharpjob";

function getAndroidStoreUrl(): string {
  const appId = import.meta.env.VITE_ANDROID_APP_ID || DEFAULT_ANDROID_APP_ID;
  return `https://play.google.com/store/apps/details?id=${appId}`;
}

export async function requestAppRating(triggerNotification: (message: string) => void): Promise<void> {
  const platform = Capacitor.getPlatform();
  trackEvent("rate_app_tapped", { platform });

  try {
    await AppReview.requestReview();
    trackEvent("rate_app_in_app_review_requested", { platform });
    return;
  } catch (error) {
    captureError(error, { context: "rate_app_request_review", platform });
  }

  try {
    await AppReview.openAppStore();
    trackEvent("rate_app_store_opened", { platform, channel: "native_plugin" });
    triggerNotification("Opening your app store rating page.");
    return;
  } catch (error) {
    captureError(error, { context: "rate_app_open_store", platform });
  }

  const playStoreUrl = getAndroidStoreUrl();
  try {
    if (typeof window === "undefined") {
      throw new Error("window is not available for store redirect");
    }
    window.open(playStoreUrl, "_blank", "noopener,noreferrer");
    trackEvent("rate_app_store_opened", { platform, channel: "web_fallback", url: playStoreUrl });
    triggerNotification("Opening Google Play rating page.");
  } catch (error) {
    captureRecoverableError(
      error,
      triggerNotification,
      "rate_app_fallback_url",
      "Could not open the rating page right now."
    );
  }
}
