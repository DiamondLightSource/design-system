import Box from "@mui/material/Box";
import { SidebarNav, type Navigation } from "@diamondlightsource/sci-react-ui";
import { useEffect, useRef } from "react";
import {
  NavLink,
  Outlet,
  useMatches,
  useNavigationType,
} from "react-router-dom";
import {
  isRedirectHandle,
  routePath,
  type PageHandle,
  type RouterProps,
} from "./Router";
import { SECTION_NAV_EXPANDED_SELECTOR, SectionNav } from "./SectionNav";
import { MAIN_CONTENT_ID, SkipLink } from "./SkipLink";
import { TopBar } from "./TopBar";
import { usePersistentDrawerState } from "./usePersistentDrawerState";

const pageTitleSeparator = " · ";

/** Sets `document.title` to "<app title> <separator> <page title>" */
function usePageTitle(appTitle: string) {
  const matches = useMatches();
  const pageTitle = [...matches]
    .reverse()
    .map((match) => (match.handle as PageHandle | undefined)?.title)
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
 * - into a new section from the navigation, to the first page in the
 *   section's navigation, as choosing a page is the next step;
 * - otherwise to the page's heading, else its selected tab, else the main area.
 * Switching tab, jumping to a heading on the same page, the first load, and
 * Back and Forward leave focus and scroll where they are.
 */
function useMoveFocusOnNavigation() {
  const matches = useMatches();
  const navigationType = useNavigationType();
  const leaf = matches[matches.length - 1];
  const isRedirect = isRedirectHandle(leaf?.handle);
  // A tab's page is the tabbed route above it
  const isTab = !isRedirect && (leaf?.handle as PageHandle | undefined)?.tab;
  const page = isTab ? matches[matches.length - 2] : leaf;
  const pagePath = page?.pathname;

  // A redirect is not somewhere the reader arrived: wait for where it leads
  const previousPath = useRef(isRedirect ? undefined : pagePath);

  // Where focus was before the page changed: the link that was pressed is
  // gone from the page by the time the change has been drawn
  const focusWasInContent = useRef(false);
  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const main = document.getElementById(MAIN_CONTENT_ID);
      focusWasInContent.current = main?.contains(event.target as Node) ?? false;
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  useEffect(() => {
    if (isRedirect || previousPath.current === pagePath) return;
    const from = previousPath.current;
    previousPath.current = pagePath;
    // The browser restores the scroll position and the reader knows where they are
    if (from === undefined || navigationType === "POP") return;

    window.scrollTo(0, 0);

    const main = document.getElementById(MAIN_CONTENT_ID);

    // A link inside the page (a card on the home page, say) has focus while
    // the navigation around it does not; the reader is after that page's
    // content, not its menu. The menu is only on screen beside the primary
    // navigation on wider screens, and while the reader has not hidden it.
    const firstSectionPage =
      !focusWasInContent.current && sectionOf(from) !== sectionOf(pagePath)
        ? document
            .querySelector(SECTION_NAV_EXPANDED_SELECTOR)
            ?.querySelector<HTMLElement>("a[href]")
        : null;
    if (firstSectionPage) {
      firstSectionPage.focus({ preventScroll: true });
      return;
    }

    // Not every page has a heading of its own (a tab can sit under one that
    // does): then the selected tab, and failing that the main area itself
    // A heading only if it is the only one: a second could be inside an
    // example, and then there is no telling which is the page's own
    const headings = main?.querySelectorAll<HTMLElement>("h1");
    const target =
      (headings?.length === 1 ? headings[0] : null) ??
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
  }, [pagePath, isRedirect, navigationType]);
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
