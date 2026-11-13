import Box from "@mui/material/Box";
import { useRef, type ReactNode } from "react";
import { PageTitleBar } from "./PageTitleBar";
import { PinnedOffsetContext } from "./pinnedOffset";
import { usePageTitleBar } from "./usePageTitleBar";

/**
 * Padded content area for a page. It must not scroll on its own: the page
 * scrolls instead, so that sticky elements inside it can stay in view.
 * The page's title pins itself as a bar once its heading has scrolled away.
 */
export function ContentPanel({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const titleBar = usePageTitleBar(scopeRef);
  const { top, clearance } = titleBar;

  return (
    <Box ref={scopeRef}>
      <PageTitleBar state={titleBar}>
        <PinnedOffsetContext.Provider value={{ top, clearance }}>
          <Box sx={{ p: 2 }}>{children}</Box>
        </PinnedOffsetContext.Provider>
      </PageTitleBar>
    </Box>
  );
}
