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
 * page changes, and the element must not be there yet.
 */
export function useOutlineAnchor(
  contentRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
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
