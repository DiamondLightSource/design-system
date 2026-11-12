import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { ContentPanel } from "./ContentPanel";

export interface TabDescription {
  label: string;
  path: string;
}

export interface TabbedPanelProps {
  tabs: TabDescription[];
  basePath: string;
}

/** An outlet for tabbed pages */
export function TabbedPanel({ tabs, basePath }: TabbedPanelProps) {
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

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    navigate(`${basePath}/${value}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        minHeight: 0,
      }}
    >
      <Paper
        square
        elevation={0}
        sx={{
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

      <ContentPanel>
        <Outlet />
      </ContentPanel>
    </Box>
  );
}
