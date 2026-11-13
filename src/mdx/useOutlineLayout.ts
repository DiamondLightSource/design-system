import {
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";
import { useLocation } from "react-router-dom";
import { PAGE_LEAD_ATTRIBUTE, PAGE_TITLE_ATTRIBUTE } from "../app-shell/usePageTitleBar";

/** Whether `ref`'s element is narrower than `minWidth` (px), measured before it is first drawn */
export function useIsNarrow(ref: RefObject<HTMLElement | null>, minWidth: number) {
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
