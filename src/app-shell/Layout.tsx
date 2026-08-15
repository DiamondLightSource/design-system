import { Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { NavLink, Outlet, useMatches } from "react-router-dom";
import { routePath, type RouteHandle, type RouterProps } from "./Router";
import { SidebarNav, type Navigation } from "./SidebarNav";
import { TopBar } from "./TopBar";
import { usePersistentDrawerState } from "./usePersistentDrawerState";

const pageTitleSeparator = " · ";

/** Sets `document.title` to "<app title> <separator> <page title>" */
function usePageTitle(appTitle: string) {
  const matches = useMatches();
  const pageTitle = [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .find((title) => title !== undefined);

  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle}${pageTitleSeparator}${appTitle}`
      : appTitle;
  }, [appTitle, pageTitle]);
}

export function toNavItemGroups(routerProps: RouterProps): Navigation {
  return routerProps.navigation.map((group) => ({
    name: group.name,
    navItems: group.sections.map((section) => ({
      label: section.name,
      icon: section.icon,
      linkProps: {
        to: routePath(section),
        component: NavLink,
      },
    })),
  }));
}

export function Layout(props: RouterProps) {
  const { open, setOpen } = usePersistentDrawerState();

  const navigation = toNavItemGroups(props);
  usePageTitle(props.title);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar title={props.title} open={open} setOpen={setOpen} />
      <SidebarNav navigation={navigation} open={open} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* The Toolbar acts as a spacer,
            same size as the toolbar used inside the TopBar's AppBar*/}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
