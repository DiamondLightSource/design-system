import { Layout } from "./Layout";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { ContentPanel, TabbedPanel, type TabDescription } from "./TabbedRoute";

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

/** A section rendering a single page, with no tabs nav or child routes */
export interface SingleSection extends BaseSection {
  element: ReactNode;
}

/** A section rendering multiple pages behind a tabs nav */
export interface TabbedSection extends BaseSection {
  /** First one is default */
  pages: Page[];
}

/**
 * This describes a top-level screen,
 * accessible via main navigation component */
export type Section = SingleSection | TabbedSection;

export interface Page extends LabelledRoute {
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

function childRoute(section: Section): RouteObject {
  const sectionPath = routePath(section);

  if (!("pages" in section)) {
    return {
      path: sectionPath,
      element: <ContentPanel>{section.element}</ContentPanel>,
    };
  }

  const tabbedPages: TabDescription[] = section.pages.map((page) => {
    return {
      label: page.name,
      path: routePath(page),
    };
  });
  const element = (
    <TabbedPanel basePath={`/${sectionPath}`} tabs={tabbedPages} />
  );
  const childPageRoutes: RouteObject[] = section.pages.map((page) => {
    return {
      path: routePath(page),
      element: page.element,
      handle: { title: page.name } satisfies RouteHandle,
    };
  });

  const firstTab = section.pages[0];
  const firstTabPath = routePath(firstTab);
  return {
    path: sectionPath,
    element: element,
    children: [
      ...(firstTab
        ? [
            {
              index: true,
              element: <Navigate to={firstTabPath} replace />,
            },
          ]
        : []),
      ...childPageRoutes,
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
 * All given routes render a `<TabbedRoute />`, with tabs for each panel,
 * and a redirect to the first panel.
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
