import { beforeEach, describe, expect, it, vi } from "vitest";

const openAppStoreMock = vi.fn<[], Promise<void>>();
const captureErrorMock = vi.fn();
const captureRecoverableErrorMock = vi.fn();
const trackEventMock = vi.fn();

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    getPlatform: vi.fn(() => "android")
  }
}));

vi.mock("@capawesome/capacitor-app-review", () => ({
  AppReview: {
    openAppStore: () => openAppStoreMock()
  }
}));

vi.mock("./telemetry", () => ({
  captureError: (...args: unknown[]) => captureErrorMock(...args),
  captureRecoverableError: (...args: unknown[]) => captureRecoverableErrorMock(...args),
  trackEvent: (...args: unknown[]) => trackEventMock(...args)
}));

import { requestAppRating } from "./rateApp";

describe("requestAppRating fallback order", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("falls back in order: openAppStore -> web redirect", async () => {
    const flow: string[] = [];

    openAppStoreMock.mockImplementation(async () => {
      flow.push("openAppStore");
      throw new Error("openAppStore failed");
    });

    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {
      flow.push("window.open");
      return null;
    });

    const notify = vi.fn();
    await requestAppRating(notify);

    expect(flow).toEqual(["openAppStore", "window.open"]);
    expect(captureErrorMock).toHaveBeenCalledTimes(1);
    expect(captureRecoverableErrorMock).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith("Opening Google Play rating page.");
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it("does not call the web fallback when openAppStore succeeds", async () => {
    openAppStoreMock.mockResolvedValue(undefined);
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    const notify = vi.fn();
    await requestAppRating(notify);

    expect(openAppStoreMock).toHaveBeenCalledTimes(1);
    expect(openSpy).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith("Opening your app store rating page.");
  });
});
