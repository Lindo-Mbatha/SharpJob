import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginationControls } from "./PaginationControls";

describe("PaginationControls", () => {
  it("renders quick chips and fires navigation callbacks", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onPageSelect = vi.fn();

    render(
      <PaginationControls
        darkMode={false}
        activeAccentPrimary="bg-blue-600"
        currentPage={5}
        totalPages={10}
        onPrevious={onPrevious}
        onNext={onNext}
        onPageSelect={onPageSelect}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "6" }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPageSelect).toHaveBeenCalledWith(6);
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  it("returns no controls for a single page", () => {
    const { container } = render(
      <PaginationControls
        darkMode={false}
        activeAccentPrimary="bg-blue-600"
        currentPage={1}
        totalPages={1}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        onPageSelect={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
