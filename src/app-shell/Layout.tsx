import Box from "@mui/material/Box";
import { SidebarNav, type Navigation } from "@diamondlightsource/sci-react-ui";
import { useEffect, useRef } from "react";
import { NavLink, Outlet, useMatches } from "react-router-dom";
import { routePath, type RouteHandle, type RouterProps } from "./Router";
import { SECTION_NAV_ID, SectionNav } from "./SectionNav";
import { MAIN_CONTENT_ID, SkipLink } from "./SkipLink";
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

const sectionOf = (path?: string) => path?.split("/")[1];

/**
 * After moving to another page, scrolls to the top and moves focus, as a full
 * page load would start at the top:
 * - into a new section, to the first page in its navigation, as choosing a
 *   page is the next step;
 * - otherwise to the page's heading, else its selected tab, else the main area.
 * Switching tab, jumping to a heading on the same page, and the first load
 * leave focus where it is.
 */
function useMoveFocusOnNavigation() {
  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  const handle = leaf?.handle as RouteHandle | undefined;
  const isRedirect = !!handle?.redirect;
  // A tab's page is the tabbed route above it
  const page = handle?.tab ? matches[matches.length - 2] : leaf;
  const pagePath = page?.pathname;

  // A redirect is not somewhere the reader arrived: wait for where it leads
  const previousPath = useRef(isRedirect ? undefined : pagePath);

  useEffect(() => {
    if (isRedirect || previousPath.current === pagePath) return;
    const from = previousPath.current;
    previousPath.current = pagePath;
    if (from === undefined) return;

    window.scrollTo(0, 0);

    // Only on screen beside the primary navigation on wider screens
    const firstSectionPage =
      sectionOf(from) !== sectionOf(pagePath)
        ? document
            .getElementById(SECTION_NAV_ID)
            ?.querySelector<HTMLElement>("a[href]")
        : null;
    if (firstSectionPage) {
      firstSectionPage.focus({ preventScroll: true });
      return;
    }

    const main = document.getElementById(MAIN_CONTENT_ID);
    // Not every page has a heading of its own (a tab can sit under one that
    // does): then the selected tab, and failing that the main area itself
    const target =
      main?.querySelector<HTMLElement>("h1") ??
      main?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]') ??
      main;
    if (!target) return;

    // A heading is not focusable by default; it only needs to be for this
    // one focus, so it does not become a Tab stop
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        {
          once: true,
        },
      );
    }
    target.focus({ preventScroll: true });
  }, [pagePath, isRedirect]);
}

function toNavItemGroups(routerProps: RouterProps): Navigation {
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
  useMoveFocusOnNavigation();

  return (
    <Box sx={{ display: "flex" }}>
      <SkipLink />
      <TopBar title={props.title} open={open} setOpen={setOpen} />
      <SidebarNav navigation={navigation} open={open} setOpen={setOpen} />
      <SectionNav navigation={props.navigation}>
        <Outlet />
      </SectionNav>
    </Box>
  );
}
