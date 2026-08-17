import { Capacitor } from "@capacitor/core";

export async function triggerHapticFeedback(enabled: boolean): Promise<void> {
  if (!enabled || !Capacitor.isNativePlatform()) return;

  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    console.warn("[SharpJob] Haptic feedback unavailable:", error);
  }
}