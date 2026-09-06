import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

// On the actual installed/emulated native app, we're always in "mobile view" —
// there's no ambiguity to resolve from viewport dimensions, which can briefly (or
// permanently, e.g. in Android Studio's device-mirroring surface) report desktop-sized
// values before/without a resize event ever correcting them. The viewport-width guess
// is only meaningful for the web/dev-server preview, where there's no native platform.
function computeIsMobileView(): boolean {
  return Capacitor.isNativePlatform() || Math.min(window.innerWidth, window.innerHeight) < 640;
}

export function useDeviceStatus() {
  const [phoneTime, setPhoneTime] = useState<string>("09:41");
  const [batteryLevel, setBatteryLevel] = useState<number>(0.85);
  const [batteryCharging, setBatteryCharging] = useState<boolean>(false);
  const [networkLabel, setNetworkLabel] = useState<string>("Wi-Fi");
  const [networkOnline, setNetworkOnline] = useState<boolean>(true);
  const [isMobileView, setIsMobileView] = useState<boolean>(computeIsMobileView);

  useEffect(() => {
    // Re-checked post-mount (rather than trusting only the lazy useState initializer)
    // in case the native bridge injects window.Capacitor slightly after our first render.
    if (Capacitor.isNativePlatform()) {
      setIsMobileView(true);
      return;
    }

    const handleResize = () => setIsMobileView(computeIsMobileView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let batteryManager: any = null;
    const handleBatteryLevelChange = () => updateBattery(batteryManager);
    const handleBatteryChargingChange = () => updateBattery(batteryManager);

    function updateBattery(manager: any) {
      setBatteryLevel(typeof manager?.level === "number" ? manager.level : 0.85);
      setBatteryCharging(Boolean(manager?.charging));
    }

    const updateNetwork = () => {
      const nav = navigator as Navigator & { connection?: any };
      const connection = nav.connection;

      setNetworkOnline(navigator.onLine);
      if (!navigator.onLine) {
        setNetworkLabel("OFF");
        return;
      }

      const effectiveTypeMap: Record<string, string> = {
        "slow-2g": "2G",
        "2g": "2G",
        "3g": "3G",
        "4g": "4G"
      };

      setNetworkLabel(effectiveTypeMap[connection?.effectiveType] || (connection?.type === "wifi" ? "Wi-Fi" : "Online"));
    };

    updateNetwork();

    const nav = navigator as Navigator & { getBattery?: () => Promise<any>; connection?: any };
    if (nav.getBattery) {
      nav.getBattery().then((manager) => {
        batteryManager = manager;
        updateBattery(manager);
        manager.addEventListener("levelchange", handleBatteryLevelChange);
        manager.addEventListener("chargingchange", handleBatteryChargingChange);
      }).catch(() => {
        batteryManager = null;
      });
    }

    const updateNetworkBound = () => updateNetwork();
    window.addEventListener("online", updateNetworkBound);
    window.addEventListener("offline", updateNetworkBound);
    nav.connection?.addEventListener?.("change", updateNetworkBound);

    return () => {
      window.removeEventListener("online", updateNetworkBound);
      window.removeEventListener("offline", updateNetworkBound);
      nav.connection?.removeEventListener?.("change", updateNetworkBound);
      if (batteryManager) {
        batteryManager.removeEventListener?.("levelchange", handleBatteryLevelChange);
        batteryManager.removeEventListener?.("chargingchange", handleBatteryChargingChange);
      }
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setPhoneTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return {
    state: {
      phoneTime,
      batteryLevel,
      batteryCharging,
      networkLabel,
      networkOnline,
      isMobileView
    },
    actions: {}
  };
}
