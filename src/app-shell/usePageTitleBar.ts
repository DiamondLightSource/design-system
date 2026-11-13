import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";
import { APP_BAR_HEIGHT, TITLE_BAR_HEIGHT } from "./dimensions";

/** Marks the heading that titles a page, set on the `h1` of an MDX page */
export const PAGE_TITLE_ATTRIBUTE = "data-page-title";

/** Marks the introduction under the page title, set on a page's `Lead` */
export const PAGE_LEAD_ATTRIBUTE = "data-page-lead";

const TITLE_SELECTOR = `h1[${PAGE_TITLE_ATTRIBUTE}]`;

/**
 * State for a title bar, which pins the page's title under the app bar once the
 * title and the introduction under it have scrolled out of sight. That is
 * shortly before the tabs, where there are any, pin.
 *
 * Looks for the title heading inside `scopeRef`. Pass the result to
 * `<PageTitleBar state={...}>`, which wraps the page. `top` and `clearance`
 * say how far down the window the bar reaches, for what sits under it.
 */
export function usePageTitleBar(scopeRef: RefObject<HTMLElement | null>) {
  // The same component serves the next page, so look again on every page change
  const { pathname } = useLocation();
  const [heading, setHeading] = useState<HTMLElement | null>(null);
  const [scrolledAway, setScrolledAway] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setHeading(scopeRef.current?.querySelector<HTMLElement>(TITLE_SELECTOR) ?? null);
  }, [scopeRef, pathname]);

  useEffect(() => {
    if (!heading) return;

    // The bar covers the strip under the app bar, so it takes over once the
    // bottom of the introduction (or of the heading, without one) has
    // scrolled under it
    const next = heading.nextElementSibling;
    const end = next?.matches(`[${PAGE_LEAD_ATTRIBUTE}]`) ? next : heading;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setScrolledAway(
          !entry.isIntersecting &&
            entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0),
        ),
      { rootMargin: `-${APP_BAR_HEIGHT + TITLE_BAR_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [heading]);

  const title = heading?.textContent?.trim() || undefined;
  const shown = heading !== null && scrolledAway;

  return {
    /** Without a title there is no bar */
    title,
    shown,
    /** The right-hand end of the bar, once drawn; for a control the page adds there */
    slot,
    setSlot,
    /** How far down the window the bars pinned right now reach */
    top: APP_BAR_HEIGHT + (shown ? TITLE_BAR_HEIGHT : 0),
    /** How far down they reach once the bar is showing, if the page has one */
    clearance: APP_BAR_HEIGHT + (title ? TITLE_BAR_HEIGHT : 0),
  };
}

export type PageTitleBarState = ReturnType<typeof usePageTitleBar>;
