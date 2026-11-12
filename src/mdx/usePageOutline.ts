import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";

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

/**
 * A first heading closer than this to the top of the content (px) is already in
 * the first part of the page, so there is no introduction to jump to
 */
const INTRO_MIN_OFFSET = 320;

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

/**
 * Finds the h2 and h3 headings under `root`, giving each one an id to link to.
 * When there is a good deal of text above the first heading, and that heading
 * is not itself an overview, the text is listed first as an introduction,
 * linked to the top of `root`.
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
  const atBottom =
    scrollable && window.innerHeight + window.scrollY >= page.scrollHeight - 2;
  if (atBottom) return headings[headings.length - 1]?.id;

  let activeId = headings[0]?.id;
  for (const { id } of headings) {
    const element = document.getElementById(id);
    if (!element) continue;
    // A heading that was jumped to rests exactly at its scroll margin
    const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    if (element.getBoundingClientRect().top > margin + 1) break;
    activeId = id;
  }
  return activeId;
}

/** The #hash of the address, which may not be valid percent-encoding */
function readHash() {
  const hash = window.location.hash.slice(1);
  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
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
