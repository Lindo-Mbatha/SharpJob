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

  // Deliberately not calling AppReview.requestReview() here: Google's Play Core review
  // API always resolves successfully even when it silently shows no dialog at all (quota
  // exhausted, app not installed via Play Store, etc. — this is intentional on Google's
  // part so apps can't detect/react to whether the prompt was shown). Treating that
  // resolution as "done" meant tapping this button could do visibly nothing. Going
  // straight to opening the store listing is what the button actually promises.
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
