import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { PINNED_TABS_HEIGHT } from "./dimensions";
import { PageTitleBar } from "./PageTitleBar";
import { PinnedOffsetContext } from "./pinnedOffset";
import { usePageTitleBar } from "./usePageTitleBar";

export interface TabDescription {
  label: string;
  path: string;
}

export interface TabbedPanelProps {
  tabs: TabDescription[];
  basePath: string;
  /**
   * Shown above the tabs; scrolls away while the tabs stay pinned. Its page
   * title, if it has one, then pins above the tabs as a bar.
   */
  header?: ReactNode;
}

/** An outlet for tabbed pages */
export function TabbedPanel({ tabs, basePath, header }: TabbedPanelProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab =
    tabs.find((tab) => {
      const tabPath = `${basePath}/${tab.path}`;
      return (
        location.pathname === tabPath ||
        location.pathname.startsWith(`${tabPath}/`)
      );
    })?.path ?? false;

  const headerRef = useRef<HTMLDivElement>(null);
  const titleBar = usePageTitleBar(headerRef);
  // Tabs reach the title bar only once the heading is gone, so they can be
  // placed under it all along
  const pinnedTop = titleBar.clearance;

  const barRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousTab = useRef(currentTab);

  // Tabs stay pinned while the page scrolls, so switching tab from far down a
  // long page would otherwise land partway down, or at the bottom, of the next.
  // Done before paint, so the wrong position is never shown.
  useLayoutEffect(() => {
    if (previousTab.current === currentTab) return;
    previousTab.current = currentTab;

    const bar = barRef.current;
    const content = contentRef.current;
    if (!bar || !content) return;

    // Content under the pinned bar is hidden by it; bring it back into view
    const hidden =
      bar.getBoundingClientRect().bottom - content.getBoundingClientRect().top;
    if (hidden > 0) {
      window.scrollBy({ top: -hidden });
    }
  }, [currentTab]);

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`${basePath}/${value}`);
  };

  return (
    <PageTitleBar state={titleBar}>
      <Box sx={{ width: "100%" }}>
        {header && (
          <Box ref={headerRef} sx={{ px: 2, pt: 2 }}>
            {header}
          </Box>
        )}

        <Paper
          ref={barRef}
          square
          elevation={0}
          sx={{
            position: "sticky",
            top: pinnedTop,
            zIndex: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.path}
                label={tab.label}
                value={tab.path}
                aria-label={tab.label}
              />
            ))}
          </Tabs>
        </Paper>

        <Box ref={contentRef} sx={{ p: 2 }}>
          <PinnedOffsetContext.Provider
            value={{
              top: pinnedTop + PINNED_TABS_HEIGHT,
              clearance: pinnedTop + PINNED_TABS_HEIGHT,
            }}
          >
            <Outlet />
          </PinnedOffsetContext.Provider>
        </Box>
      </Box>
    </PageTitleBar>
  );
}
