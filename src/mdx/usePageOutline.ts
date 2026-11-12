import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";
import { APP_BAR_HEIGHT, PINNED_TABS_HEIGHT } from "../app-shell/dimensions";

/** Distance from the top of the window to the first visible line of content */
export const OUTLINE_TOP = APP_BAR_HEIGHT + PINNED_TABS_HEIGHT;

/** Space left above a heading that is scrolled to, clear of the pinned bars */
export const HEADING_SCROLL_MARGIN = OUTLINE_TOP + 16;

/** Below this many headings a page is short enough to scroll without an outline */
export const MIN_OUTLINE_HEADINGS = 3;

export interface OutlineHeading {
  id: string;
  text: string;
  level: 2 | 3;
  /** The text above the first heading, linked to the top of the content */
  intro?: boolean;
}

const INTRO_TEXT = "Introduction";

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** Gives `element` an id made from `text`, unless it has one, and returns it */
function ensureId(element: HTMLElement, text: string, taken: Set<string>) {
  if (!element.id) {
    const base = slugify(text);
    let id = base;
    for (
      let suffix = 2;
      taken.has(id) || document.getElementById(id);
      suffix++
    ) {
      id = `${base}-${suffix}`;
    }
    element.id = id;
  }

  taken.add(element.id);
  return element.id;
}

function hasTextBefore(root: HTMLElement, element: HTMLElement) {
  const range = document.createRange();
  range.setStart(root, 0);
  range.setEndBefore(element);
  return range.toString().trim().length > 0;
}

/**
 * Finds the h2 and h3 headings under `root`, giving each one an id to link to.
 * When there is text above the first heading, it is listed first as an
 * introduction, linked to the top of `root`.
 */
function collectHeadings(root: HTMLElement): OutlineHeading[] {
  const taken = new Set<string>();
  const elements = Array.from(root.querySelectorAll<HTMLElement>("h2, h3"));

  const headings = elements.map((heading): OutlineHeading => {
    const text = heading.textContent?.trim() ?? "";
    return {
      id: ensureId(heading, text, taken),
      text,
      level: heading.tagName === "H2" ? 2 : 3,
    };
  });

  if (elements.length > 0 && hasTextBefore(root, elements[0])) {
    headings.unshift({
      id: ensureId(root, INTRO_TEXT, taken),
      text: INTRO_TEXT,
      level: 2,
      intro: true,
    });
  }

  return headings;
}

function findActiveId(headings: OutlineHeading[]) {
  const atBottom =
    window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
  if (atBottom) return headings[headings.length - 1]?.id;

  let activeId = headings[0]?.id;
  for (const { id } of headings) {
    const element = document.getElementById(id);
    if (!element) continue;
    // A heading that was jumped to rests exactly at the scroll margin
    if (element.getBoundingClientRect().top > HEADING_SCROLL_MARGIN + 1) break;
    activeId = id;
  }
  return activeId;
}

/**
 * The h2 and h3 headings inside `contentRef`, and which one the reader has
 * scrolled to. Headings are given ids as they are found, so they can be linked.
 */
export function usePageOutline(contentRef: RefObject<HTMLElement | null>) {
  const [headings, setHeadings] = useState<OutlineHeading[]>([]);
  const [activeId, setActiveId] = useState<string>();
  // Switching tab keeps this component mounted but swaps its content
  const { pathname } = useLocation();

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    setHeadings(collectHeadings(content));

    // The browser tries to scroll to a #hash before the headings have ids, and
    // loading fonts reflows the page afterwards, so scroll again once they are in
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const scrollToHash = () => document.getElementById(hash)?.scrollIntoView();
    let cancelled = false;
    if (hash) {
      scrollToHash();
      void document.fonts?.ready.then(() => {
        if (!cancelled) scrollToHash();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [contentRef, pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActiveId(findActiveId(headings)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  return { headings, activeId };
}
