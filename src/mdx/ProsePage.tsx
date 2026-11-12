import { Box } from "@mui/material";
import { useRef, type ReactNode } from "react";
import { readingWidth } from "./layout";
import { OutlineDisclosure, OutlineRail } from "./PageOutline";
import {
  MIN_OUTLINE_HEADINGS,
  HEADING_SCROLL_MARGIN,
  OUTLINE_TOP,
  usePageOutline,
} from "./usePageOutline";

/** Width of the page at which the outline fits beside the content */
const RAIL_MIN_WIDTH = "900px";

/**
 * A documentation page, with an outline of its sections.
 * The outline sits beside the content when the page is wide enough, and
 * folds into a list at the top when it is not. Pages with only a few
 * sections get none.
 */
export function ProsePage({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { headings, activeId } = usePageOutline(contentRef);
  const hasOutline =
    headings.filter((heading) => !heading.intro).length >= MIN_OUTLINE_HEADINGS;

  return (
    // The width of the page, not of the window, decides when the rail fits:
    // the navigation panels take a varying share of the window.
    <Box sx={{ containerType: "inline-size" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {hasOutline && (
            <Box
              sx={{
                // Stays in reach while reading
                position: "sticky",
                top: OUTLINE_TOP,
                zIndex: 1,
                bgcolor: "background.default",
                pb: 3,
                [`@container (min-width: ${RAIL_MIN_WIDTH})`]: {
                  display: "none",
                },
              }}
            >
              <OutlineDisclosure headings={headings} activeId={activeId} />
            </Box>
          )}
          {/* Only top-level paragraphs: MDX also wraps text inside JSX tags (a
              button label, say) in a paragraph, which must keep its parent's style */}
          <Box
            ref={contentRef}
            sx={{
              "& > p": { typography: "body1", mb: 2, maxWidth: readingWidth },
              // Keeps a linked heading, or the top of the page, clear of the pinned bars
              scrollMarginTop: `${HEADING_SCROLL_MARGIN}px`,
              "& h2, & h3": { scrollMarginTop: `${HEADING_SCROLL_MARGIN}px` },
            }}
          >
            {children}
          </Box>
        </Box>

        {hasOutline && (
          <Box
            sx={{
              display: "none",
              // The sticky element must be the flex item itself: inside a
              // wrapper only as tall as the outline it would have no room to move
              position: "sticky",
              top: OUTLINE_TOP + 16,
              // Long outlines scroll on their own rather than running off the screen
              maxHeight: `calc(100vh - ${OUTLINE_TOP + 32}px)`,
              overflowY: "auto",
              width: 208,
              flexShrink: 0,
              [`@container (min-width: ${RAIL_MIN_WIDTH})`]: {
                display: "block",
              },
            }}
          >
            <OutlineRail headings={headings} activeId={activeId} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
