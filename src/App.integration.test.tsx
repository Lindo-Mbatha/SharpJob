import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("App integration journeys", () => {
  it("save job -> open drawer -> apply outbound -> lands in saved state", () => {
    vi.useFakeTimers();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => ({ closed: false } as Window));

    render(<App />);

    fireEvent.click(screen.getByText("Product Designer"));
    expect(screen.getByRole("button", { name: /apply on company site/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save this role/i }));
    expect(screen.getByRole("button", { name: /remove from saved/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /apply on company site/i }));

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/saved jobs/i)).toBeInTheDocument();
    expect(screen.getByText("Product Designer")).toBeInTheDocument();
  });

  it("tab switching side effects close an open drawer and route to selected tab", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Product Designer"));
    expect(screen.getByRole("button", { name: /apply on company site/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /explore/i }));

    expect(screen.queryByRole("button", { name: /apply on company site/i })).not.toBeInTheDocument();
    expect(screen.getByText(/explore jobs/i)).toBeInTheDocument();
  });

  it("alerts -> related opening -> details drawer path", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /alerts/i }));
    fireEvent.click(screen.getByRole("button", { name: /new job match/i }));

    expect(screen.getByText("Message")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /related opening/i }));

    expect(screen.getByRole("button", { name: /apply on company site/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save this role/i })).toBeInTheDocument();
  });
});
