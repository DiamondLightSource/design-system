import { Box } from "@mui/material";
import { useRef, type ReactNode } from "react";
import { readingWidth } from "./layout";
import { usePinnedOffset } from "../app-shell/pinnedOffset";
import { OutlineDisclosure, OutlineRail } from "./PageOutline";
import { MIN_OUTLINE_HEADINGS, usePageOutline } from "./usePageOutline";

/** Width of the page at which the outline fits beside the content */
const RAIL_MIN_WIDTH = "900px";

/** Space the pinned, collapsed list takes up below the bars, including its padding (px) */
const DISCLOSURE_HEIGHT = 64;

/**
 * A documentation page, with an outline of its sections.
 * The outline sits beside the content when the page is wide enough, and
 * folds into a list at the top when it is not. Pages with only a few
 * sections get none.
 */
export function ProsePage({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { headings, activeId } = usePageOutline(contentRef);
  const top = usePinnedOffset();
  const hasOutline =
    headings.filter((heading) => !heading.intro).length >= MIN_OUTLINE_HEADINGS;

  // Keeps a linked heading, or the top of the page, clear of what is pinned
  const scrollMargin = {
    scrollMarginTop: `${top + 16}px`,
    ...(hasOutline && {
      [`@container (width < ${RAIL_MIN_WIDTH})`]: {
        scrollMarginTop: `${top + 16 + DISCLOSURE_HEIGHT}px`,
      },
    }),
  };

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
              component="nav"
              aria-label="On this page"
              sx={{
                // Stays in reach while reading
                position: "sticky",
                top,
                zIndex: 1,
                bgcolor: "background.default",
                pb: 3,
                [`@container (min-width: ${RAIL_MIN_WIDTH})`]: {
                  display: "none",
                },
              }}
            >
              <OutlineDisclosure
                headings={headings}
                activeId={activeId}
                top={top}
              />
            </Box>
          )}
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

        {hasOutline && (
          <Box
            sx={{
              display: "none",
              // The sticky element must be the flex item itself: inside a
              // wrapper only as tall as the outline it would have no room to move
              position: "sticky",
              top: top + 16,
              // Long outlines scroll on their own rather than running off the screen
              maxHeight: `calc(100vh - ${top + 32}px)`,
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
