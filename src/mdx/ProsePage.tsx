import { Box } from "@mui/material";
import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { readingWidth } from "./layout";
import { usePinnedOffset } from "../app-shell/pinnedOffset";
import { useOutlineLabel } from "../app-shell/outlineLabel";
import { useTitleBarSlot } from "../app-shell/titleBarSlot";
import { OutlineDisclosure, OutlineMenu, OutlineRail } from "./PageOutline";
import {
  useIsNarrow,
  useOutlineAnchor,
  useScrolledPast,
} from "./useOutlineLayout";
import { MIN_OUTLINE_HEADINGS, usePageOutline } from "./usePageOutline";

/** Width of the page (px) at which the outline fits beside the content */
const RAIL_MIN_WIDTH = 900;

/** The title bar can appear or leave as the page scrolls; follow it smoothly */
const pinTransition = {
  transition: "top 150ms",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
};

/**
 * A documentation page, with an outline of its sections.
 * The outline sits beside the content when the page is wide enough. When it
 * is not, the outline is a list after the page's introduction, and a button in
 * the page title bar once that list has scrolled out of sight. Pages with only a few
 * sections get none.
 */
export function ProsePage({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { headings, activeId } = usePageOutline(contentRef);
  const { top, clearance } = usePinnedOffset();
  const label = useOutlineLabel();
  const { element: titleBarSlot, shown: titleBarShown } = useTitleBarSlot();
  const hasOutline =
    headings.filter((heading) => !heading.intro).length >= MIN_OUTLINE_HEADINGS;

  // The width of the page, not of the window, decides whether the rail fits:
  // the navigation panels take a varying share of the window.
  const pageRef = useRef<HTMLDivElement>(null);
  const narrow = useIsNarrow(pageRef, RAIL_MIN_WIDTH);
  const outlineAnchor = useOutlineAnchor(contentRef, hasOutline && narrow);
  // The bar takes over the list once it has left the screen, never both at once
  const listPast = useScrolledPast(outlineAnchor, clearance);

  // Keeps a linked heading, or the top of the page, clear of what is pinned
  const scrollMargin = { scrollMarginTop: `${clearance + 16}px` };

  return (
    <Box ref={pageRef}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Only top-level paragraphs: MDX also wraps text inside JSX tags (a
              button label, say) in a paragraph, which must keep its parent's style */}
          <Box
            ref={contentRef}
            sx={{
              "& > p": { typography: "body1", mb: 2, maxWidth: readingWidth },
              ...scrollMargin,
              "& h2, & h3": scrollMargin,
            }}
          >
            {children}
          </Box>
        </Box>

        {hasOutline && !narrow && (
          <Box
            sx={{
              // The sticky element must be the flex item itself: inside a
              // wrapper only as tall as the outline it would have no room to move
              position: "sticky",
              top: top + 16,
              ...pinTransition,
              // Long outlines scroll on their own rather than running off the screen
              maxHeight: `calc(100vh - ${top + 32}px)`,
              overflowY: "auto",
              width: 208,
              flexShrink: 0,
            }}
          >
            <OutlineRail headings={headings} activeId={activeId} label={label} />
          </Box>
        )}
      </Box>

      {outlineAnchor &&
        createPortal(
          <OutlineDisclosure
            headings={headings}
            activeId={activeId}
            label={label}
          />,
          outlineAnchor,
        )}
      {hasOutline &&
        narrow &&
        listPast &&
        titleBarSlot &&
        createPortal(
          <OutlineMenu
            headings={headings}
            activeId={activeId}
            label={label}
            barShown={titleBarShown}
          />,
          titleBarSlot,
        )}
    </Box>
  );
}
