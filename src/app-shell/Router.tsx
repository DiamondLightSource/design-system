import { Layout } from "./Layout";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { ContentPanel } from "./ContentPanel";
import { TabbedPanel, type TabDescription } from "./TabbedPanel";

import type { ReactNode } from "react";

/** App title and navigational intent */
export interface RouterProps {
  /** App name to show in top bar */
  title: string;

  /** a router will be derived to express this */
  navigation: SectionGroup[];
}

/** A group within the main navigation tree */
export interface SectionGroup {
  /** Group name (not currently exposed) */
  name?: string;

  /** The sections within this group */
  sections: Section[];
}

/**
 * A section with a user-friendly name,
 * and optional path.
 * If undefined, path is derived from name */
export interface LabelledRoute {
  name: string;
  path?: string;
}

interface BaseSection extends LabelledRoute {
  /** icon for top-level navigation */
  icon: ReactNode;
}

/** A section rendering a single page, with no sub navigation or child routes */
export interface SingleSection extends BaseSection {
  element: ReactNode;
  tabs?: never;
  pages?: never;
}

/** A section rendering several tabs, with no sub navigation */
export interface TabbedSection extends BaseSection {
  /** First one is default */
  tabs: Tab[];
  /** Shown above the tabs, shared by every tab */
  header?: ReactNode;
  element?: never;
  pages?: never;
}

/** A section rendering multiple pages behind a sub navigation */
export interface PagedSection extends BaseSection {
  /** First one is default */
  pages: Page[];
  element?: never;
  tabs?: never;
}

/**
 * This describes a top-level screen,
 * accessible via main navigation component */
export type Section = SingleSection | TabbedSection | PagedSection;

/** A page rendering its content directly */
export interface ContentPage extends LabelledRoute {
  element: ReactNode;
  tabs?: never;
}

/** A page rendering several tabs, one level below the sub navigation */
export interface TabbedPage extends LabelledRoute {
  /** First one is default */
  tabs: Tab[];
  /** Shown above the tabs, shared by every tab */
  header?: ReactNode;
  element?: never;
}

export type Page = ContentPage | TabbedPage;

export interface Tab extends LabelledRoute {
  element: ReactNode;
}

/** Custom data attached to each leaf route, read via `useMatches()` for the page title */
export interface RouteHandle {
  title: string;
}

/** When paths not given, derive from name through this function */
export function sanitisePath(name: string) {
  return name.toLowerCase().replace(/\s/g, "_");
}

export function routePath(route: LabelledRoute) {
  return route.path ?? sanitisePath(route.name);
}

/** Tabs above an outlet, redirecting to the first tab by default */
function tabbedRoute(
  path: string,
  basePath: string,
  parentName: string,
  tabs: Tab[],
  header?: ReactNode,
): RouteObject {
  const tabDescriptions: TabDescription[] = tabs.map((tab) => ({
    label: tab.name,
    path: routePath(tab),
  }));
  const firstTab = tabs[0];
  return {
    path,
    element: (
      <TabbedPanel
        basePath={basePath}
        tabs={tabDescriptions}
        header={header}
      />
    ),
    children: [
      ...(firstTab
        ? [
            {
              index: true,
              element: <Navigate to={routePath(firstTab)} replace />,
            },
          ]
        : []),
      ...tabs.map((tab) => ({
        path: routePath(tab),
        element: tab.element,
        handle: { title: `${parentName} / ${tab.name}` } satisfies RouteHandle,
      })),
    ],
  };
}

function pageRoute(page: Page, sectionPath: string): RouteObject {
  const pagePath = routePath(page);

  if (page.tabs) {
    return tabbedRoute(
      pagePath,
      `/${sectionPath}/${pagePath}`,
      page.name,
      page.tabs,
      page.header,
    );
  }

  return {
    path: pagePath,
    element: <ContentPanel>{page.element}</ContentPanel>,
    handle: { title: page.name } satisfies RouteHandle,
  };
}

function childRoute(section: Section): RouteObject {
  const sectionPath = routePath(section);

  if (section.tabs) {
    return tabbedRoute(
      sectionPath,
      `/${sectionPath}`,
      section.name,
      section.tabs,
      section.header,
    );
  }

  if (!section.pages) {
    return {
      path: sectionPath,
      element: <ContentPanel>{section.element}</ContentPanel>,
    };
  }

  const firstPage = section.pages[0];
  return {
    path: sectionPath,
    children: [
      ...(firstPage
        ? [
            {
              index: true,
              element: <Navigate to={routePath(firstPage)} replace />,
            },
          ]
        : []),
      ...section.pages.map((page) => pageRoute(page, sectionPath)),
    ],
  };
}

function getRoutes(navigation: SectionGroup[]): Section[] {
  return navigation.flatMap((group) => group.sections);
}

/**
 * Returns a router with a root Route ('/') which renders `<Layout />`,
 * consisting of app bar, side navigation panel, and main content panel (`<Outlet />`).
 *
 * Adds an index child which redirects to the first given route.
 * Sections with pages are listed in a sub navigation beside the side
 * navigation, and redirect to their first page. A section or a page may
 * show tabs instead, and redirects to its first tab.
 *
 */
export function createRouter(props: RouterProps) {
  const routes = getRoutes(props.navigation);
  const children = routes.map(childRoute);

  const firstRoute = routes[0];
  const route: RouteObject = {
    path: "/",
    element: <Layout {...props} />,
    children: [
      {
        index: true,
        element: <Navigate to={`/${firstRoute.path}`} replace />,
      },
      ...children,
    ],
  };
  return createBrowserRouter([route]);
}
