import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useEffect, useRef, type ReactNode } from "react";
import { APP_BAR_HEIGHT, TAB_BAR_HEIGHT } from "./dimensions";

export interface TabDescription {
  label: string;
  path: string;
}

export interface TabbedPanelProps {
  tabs: TabDescription[];
  basePath: string;
  /** Shown above the tabs; scrolls away while the tabs stay pinned */
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

  const contentRef = useRef<HTMLDivElement>(null);
  const previousTab = useRef(currentTab);

  // Tabs stay pinned while the page scrolls, so switching tab from far down a
  // long page would otherwise land partway down, or at the bottom, of the next
  useEffect(() => {
    if (previousTab.current === currentTab) return;
    previousTab.current = currentTab;

    const content = contentRef.current;
    if (!content) return;

    const pinnedBottom = APP_BAR_HEIGHT + TAB_BAR_HEIGHT;
    const top = content.getBoundingClientRect().top;
    if (top < pinnedBottom) {
      window.scrollBy({ top: top - pinnedBottom });
    }
  }, [currentTab]);

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`${basePath}/${value}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {header && <Box sx={{ px: 2, pt: 2 }}>{header}</Box>}

      <Paper
        square
        elevation={0}
        sx={{
          position: "sticky",
          top: APP_BAR_HEIGHT,
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
        <Outlet />
      </Box>
    </Box>
  );
}
