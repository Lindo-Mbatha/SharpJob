import { beforeEach, describe, expect, it, vi } from "vitest";

const requestReviewMock = vi.fn<[], Promise<void>>();
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
    requestReview: () => requestReviewMock(),
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

  it("falls back in order: requestReview -> openAppStore -> web redirect", async () => {
    const flow: string[] = [];

    requestReviewMock.mockImplementation(async () => {
      flow.push("requestReview");
      throw new Error("requestReview failed");
    });

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

    expect(flow).toEqual(["requestReview", "openAppStore", "window.open"]);
    expect(captureErrorMock).toHaveBeenCalledTimes(2);
    expect(captureRecoverableErrorMock).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith("Opening Google Play rating page.");
    expect(openSpy).toHaveBeenCalledTimes(1);
  });
});
