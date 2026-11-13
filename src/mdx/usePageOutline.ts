import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";

/** Below this many headings there is too little to list in an outline */
export const MIN_OUTLINE_HEADINGS = 3;

export interface OutlineHeading {
  id: string;
  text: string;
  level: 2 | 3;
  /** The text above the first heading, linked to the top of the content */
  intro?: boolean;
}

const INTRO_TEXT = "Introduction";

/**
 * A first heading closer than this to the top of the content (px) is already in
 * the first part of the page, so there is no introduction to jump to
 */
const INTRO_MIN_OFFSET = 160;

/** A first heading with one of these names already serves as the introduction */
const INTRO_HEADING = /^(overview|introduction)$/i;

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

function firstHeadingOffset(root: HTMLElement, heading: HTMLElement) {
  return heading.getBoundingClientRect().top - root.getBoundingClientRect().top;
}

/** Marks a block whose headings should not be listed in the outline */
const OUTLINE_SKIP = '[data-outline="skip"]';

/**
 * Finds the h2 and h3 headings under `root`, giving each one an id to link to.
 * When there is a good deal of text above the first heading, and that heading
 * is not itself an overview, the text is listed first as an introduction,
 * linked to the top of `root`.
 */
function collectHeadings(root: HTMLElement): OutlineHeading[] {
  const taken = new Set<string>();
  // Headings inside a card group stay in the document but not the outline
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>("h2, h3"),
  ).filter((heading) => !heading.closest(OUTLINE_SKIP));

  const headings = elements.map((heading): OutlineHeading => {
    const text = heading.textContent?.trim() ?? "";
    return {
      id: ensureId(heading, text, taken),
      text,
      level: heading.tagName === "H2" ? 2 : 3,
    };
  });

  const [first] = headings;
  if (
    first &&
    !INTRO_HEADING.test(first.text) &&
    firstHeadingOffset(root, elements[0]) >= INTRO_MIN_OFFSET &&
    hasTextBefore(root, elements[0])
  ) {
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
  const page = document.documentElement;
  const scrollable = page.scrollHeight > window.innerHeight + 1;
  const remaining = page.scrollHeight - window.innerHeight - window.scrollY;
  if (scrollable && remaining <= 2) return headings[headings.length - 1]?.id;

  const lastElement = document.getElementById(
    headings[headings.length - 1]?.id ?? "",
  );
  const lastMargin = lastElement
    ? parseFloat(getComputedStyle(lastElement).scrollMarginTop) || 0
    : 0;
  // The last headings cannot scroll up to the top of the page, so over the
  // final screenful the line a heading must cross moves down to the bottom
  // of the window, and each of them takes its turn. On a page that scrolls
  // less than that, the line starts from the top, so the first heading leads
  const span = window.innerHeight - lastMargin;
  const scrollRange = page.scrollHeight - window.innerHeight;
  const creepRange = Math.min(span, scrollRange);
  const creep =
    scrollable && creepRange > 0
      ? span * Math.min(Math.max(1 - remaining / creepRange, 0), 1)
      : 0;

  let activeId = headings[0]?.id;
  for (const { id } of headings) {
    const element = document.getElementById(id);
    if (!element) continue;
    // A heading that was jumped to rests exactly at its scroll margin
    const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    if (element.getBoundingClientRect().top > margin + creep + 1) break;
    activeId = id;
  }
  return activeId;
}

/** Reads percent-encoding that may not be valid, keeping the text as it is */
function decode(text: string) {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

/** The #hash of the address */
function readHash() {
  return decode(window.location.hash.slice(1));
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

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // The introduction entry gives the content an id; take it back off
    // afterwards, as the same element holds the next tab's content
    const hadId = content.id !== "";
    setHeadings(collectHeadings(content));

    // The browser tries to scroll to a #hash before the headings have ids, and
    // loading fonts reflows the page afterwards, so scroll again once they are in
    const hash = readHash();
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
      if (!hadId) content.removeAttribute("id");
    };
  }, [contentRef, pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;
    let landFrame = 0;
    // A heading jumped to near the end of the page cannot scroll up to the
    // top, so it is the one chosen until it moves away from where the jump
    // left it. Its place in the window is watched, not the scroll position:
    // a late reflow, such as fonts loading, and the scroll that follows it
    // bring the heading back to the same place
    let chosen: string | undefined;
    let landedTop: number | undefined;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (chosen !== undefined && landedTop !== undefined) {
          const top = document
            .getElementById(chosen)
            ?.getBoundingClientRect().top;
          if (top === undefined || Math.abs(top - landedTop) > 2) {
            chosen = undefined;
          }
        }
        setActiveId(chosen ?? findActiveId(headings));
      });
    };
    const choose = (id: string) => {
      chosen = headings.some((heading) => heading.id === id) ? id : undefined;
      landedTop = undefined;
      update();
      // The browser scrolls to the heading after this, so note where it ends up
      cancelAnimationFrame(landFrame);
      landFrame = requestAnimationFrame(() => {
        landFrame = requestAnimationFrame(() => {
          landedTop =
            chosen === undefined
              ? undefined
              : document.getElementById(chosen)?.getBoundingClientRect().top;
        });
      });
    };
    const chooseFromHash = () => choose(readHash());
    // Pressing the link for the heading already in the address does not
    // change the hash, so the press itself has to choose it again
    const chooseFromLink = (event: MouseEvent) => {
      // Only a press that scrolls the page here: not one that opens another
      // tab, or that something else has taken over
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as Element).closest?.('a[href^="#"]');
      if (!link || link.getAttribute("target") === "_blank") return;
      choose(decode(link.getAttribute("href")!.slice(1)));
    };

    chooseFromHash();
    window.addEventListener("hashchange", chooseFromHash);
    document.addEventListener("click", chooseFromLink);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(landFrame);
      window.removeEventListener("hashchange", chooseFromHash);
      document.removeEventListener("click", chooseFromLink);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  return { headings, activeId };
}
