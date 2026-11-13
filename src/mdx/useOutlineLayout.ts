import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";
import {
  PAGE_LEAD_ATTRIBUTE,
  PAGE_TITLE_ATTRIBUTE,
} from "../app-shell/usePageTitleBar";

/** How much of the length that earns an outline is enough to keep it */
const KEEP_RATIO = 0.85;

/** Marks the element the outline list is drawn into */
const OUTLINE_ANCHOR_ATTRIBUTE = "data-outline-anchor";

/** Whether `ref`'s element is narrower than `minWidth` (px), measured before it is first drawn */
export function useIsNarrow(
  ref: RefObject<HTMLElement | null>,
  minWidth: number,
) {
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setNarrow(element.clientWidth < minWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, minWidth]);

  return narrow;
}

/**
 * Whether `ref`'s element is at least `windows` times as tall as the window,
 * measured before it is first drawn. A page shorter than that is read in a
 * screen or two, and gains nothing from an outline.
 */
export function useIsLong(ref: RefObject<HTMLElement | null>, windows: number) {
  const [long, setLong] = useState(false);
  // Switching page keeps this component mounted but swaps its content
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Each page starts afresh: the length of the one before says nothing of it
    let isLong = false;
    const update = () => {
      // Not counting the outline list the page may hold, or the answer would
      // depend on the list that it decides on
      const outline = Array.from(
        element.querySelectorAll<HTMLElement>(`[${OUTLINE_ANCHOR_ATTRIBUTE}]`),
      ).reduce((height, anchor) => height + anchor.offsetHeight, 0);
      const height = element.clientHeight - outline;
      // A page that has the outline keeps it until it is clearly shorter, so
      // a window whose height drifts, as the address bar on a phone does,
      // does not make the outline come and go
      isLong = isLong
        ? height >= windows * KEEP_RATIO * window.innerHeight
        : height >= windows * window.innerHeight;
      setLong(isLong);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref, windows, pathname]);

  return long;
}

/**
 * An element placed in `contentRef` after the page's title and introduction, or
 * at the start of a page that has none, for the outline to be drawn into.
 * Must be called after `usePageOutline`: that reads the page's text when the
 * page changes, and the element must not be there yet. Both run before the
 * page is drawn, in the order they are called, so the content does not shift
 * down once the outline appears.
 */
export function useOutlineAnchor(
  contentRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!enabled || !content) return;

    const element = document.createElement("div");
    element.setAttribute(OUTLINE_ANCHOR_ATTRIBUTE, "");
    // Holds the list's margins, so its height is all the space it takes
    element.style.display = "flow-root";
    const title = content.querySelector<HTMLElement>(
      `h1[${PAGE_TITLE_ATTRIBUTE}]`,
    );
    const lead = title?.nextElementSibling?.matches(`[${PAGE_LEAD_ATTRIBUTE}]`)
      ? title.nextElementSibling
      : null;
    const after = lead ?? title;

    if (after) after.after(element);
    else content.prepend(element);
    setAnchor(element);

    return () => element.remove();
  }, [contentRef, enabled, pathname]);

  return enabled ? anchor : null;
}

/**
 * Whether `element` has scrolled up out of sight behind whatever is pinned
 * above it, which reaches `top` px down the window
 */
export function useScrolledPast(element: HTMLElement | null, top: number) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) =>
        setPast(
          !entry.isIntersecting &&
            entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0),
        ),
      { rootMargin: `-${top}px 0px 0px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, top]);

  return element !== null && past;
}
