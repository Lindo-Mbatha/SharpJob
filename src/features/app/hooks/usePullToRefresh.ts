import { useEffect, useRef, useState } from "react";

export const PULL_TO_REFRESH_THRESHOLD = 64;
const MAX_PULL = 96;
const RESISTANCE = 0.5;

// Walks up from the touch target to find the element actually being scrolled —
// a screen (e.g. Explore) can nest its own overflow-y-auto list inside the
// outer container so a pinned header can stay put while the list scrolls.
function findScrollableAncestor(node: EventTarget | null, boundary: HTMLElement): HTMLElement {
  let current = node instanceof HTMLElement ? node : null;

  while (current && current !== boundary) {
    if (current.scrollHeight > current.clientHeight) {
      const overflowY = getComputedStyle(current).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") return current;
    }
    current = current.parentElement;
  }

  return boundary;
}

export function usePullToRefresh({
  containerRef,
  enabled,
  isRefreshing,
  onRefresh
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  isRefreshing: boolean;
  onRefresh: () => void | Promise<void>;
}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startYRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const activeScrollableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const handleTouchStart = (event: TouchEvent) => {
      const scrollable = findScrollableAncestor(event.target, el);
      activeScrollableRef.current = scrollable;
      startYRef.current = scrollable.scrollTop <= 0 ? event.touches[0].clientY : null;
      isPullingRef.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (startYRef.current === null) return;

      const scrollable = activeScrollableRef.current ?? el;
      const delta = event.touches[0].clientY - startYRef.current;
      if (delta <= 0 || scrollable.scrollTop > 0) {
        startYRef.current = null;
        isPullingRef.current = false;
        pullDistanceRef.current = 0;
        setIsPulling(false);
        setPullDistance(0);
        return;
      }

      isPullingRef.current = true;
      setIsPulling(true);
      event.preventDefault();
      const next = Math.min(delta * RESISTANCE, MAX_PULL);
      pullDistanceRef.current = next;
      setPullDistance(next);
    };

    // Reads the live distance from a ref (rather than a setState updater) so the
    // onRefresh side effect fires exactly once — React 18 StrictMode double-invokes
    // state updater functions in dev, which would otherwise double-trigger a refresh.
    const handleTouchEnd = () => {
      startYRef.current = null;
      setIsPulling(false);

      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      const finalDistance = pullDistanceRef.current;
      if (finalDistance >= PULL_TO_REFRESH_THRESHOLD) {
        setPullDistance(PULL_TO_REFRESH_THRESHOLD);
        void onRefresh();
      } else {
        setPullDistance(0);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [containerRef, enabled, onRefresh]);

  useEffect(() => {
    if (!isRefreshing) setPullDistance(0);
  }, [isRefreshing]);

  return { pullDistance, isPulling, isTriggered: pullDistance >= PULL_TO_REFRESH_THRESHOLD };
}
