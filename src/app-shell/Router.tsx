import { Layout } from "./Layout";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { ContentPanel, TabbedPanel, type TabDescription } from "./TabbedRoute";
import MdxWrapper from "../Wrapper";

import type { ComponentType, ReactNode } from "react";

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

/**
 * This describes a top-level screen, accessible via main navigation component.
 * Its pages are auto-discovered from `src/pages`, keyed by `folder`:
 * a file `pages/<folder>.mdx` renders as a single page (no tabs);
 * a directory `pages/<folder>/*.mdx` renders as a tabbed section,
 * one tab per page found there. */
export interface Section extends LabelledRoute {
  /** icon for top-level navigation */
  icon: ReactNode;

  /** Name of a file (without extension) or subfolder under src/pages */
  folder: string;
}

/**
 * Optional named export from an .mdx page, e.g.:
 * `export const meta = { name: "Actual Page Name!", order: 2 };`
 * All fields are optional; see CONTRIBUTING.md for defaults and examples. */
export interface PageMeta {
  /** Tab label and page title. Defaults to the filename with PascalCase split into words. */
  name?: string;

  /** URL segment for this page. Defaults to a sanitised form of `name`. */
  path?: string;

  /** Forces sort position among sibling pages (lower sorts first, ties break alphabetically
   * by name). Without this, a file named `Overview` sorts first and everything else sorts
   * alphabetically by filename. */
  order?: number;
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

/** Splits PascalCase/camelCase filenames into words, e.g. "ApplicationStructure" -> "Application Structure" */
function humanise(filename: string) {
  return filename.replace(/(?<=[a-z0-9])(?=[A-Z])/g, " ");
}

type MdxModule = { default: ComponentType; meta?: PageMeta };

const pageModules = import.meta.glob<MdxModule>("../pages/**/*.mdx", {
  eager: true,
});

interface DiscoveredPage extends LabelledRoute {
  order: number;
  module: MdxModule;
}

const rootPages = new Map<string, MdxModule>();
const folderPages = new Map<string, DiscoveredPage[]>();

for (const [key, module] of Object.entries(pageModules)) {
  const match = key.match(/\.\.\/pages\/(?:([^/]+)\/)?([^/]+)\.mdx$/);
  if (!match) continue;
  const [, folder, filename] = match;
  const meta = module.meta;
  const name = meta?.name ?? humanise(filename);
  const page: DiscoveredPage = {
    name,
    path: meta?.path,
    order: meta?.order ?? (filename === "Overview" ? -1 : Infinity),
    module,
  };

  if (folder === undefined) {
    rootPages.set(filename, module);
  } else {
    const pages = folderPages.get(folder) ?? [];
    pages.push(page);
    folderPages.set(folder, pages);
  }
}

for (const pages of folderPages.values()) {
  pages.sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}

function childRoute(section: Section): RouteObject {
  const sectionPath = routePath(section);
  const rootPage = rootPages.get(section.folder);
  const pages = folderPages.get(section.folder);

  if (rootPage) {
    return {
      path: sectionPath,
      element: (
        <ContentPanel>
          <MdxWrapper component={rootPage.default} />
        </ContentPanel>
      ),
    };
  }

  if (!pages) {
    throw new Error(
      `No pages found for section "${section.name}" (folder "${section.folder}"). ` +
        `Expected src/pages/${section.folder}.mdx or src/pages/${section.folder}/*.mdx`,
    );
  }

  const tabbedPages: TabDescription[] = pages.map((page) => {
    return {
      label: page.name,
      path: routePath(page),
    };
  });
  const element = (
    <TabbedPanel basePath={`/${sectionPath}`} tabs={tabbedPages} />
  );
  const childPageRoutes: RouteObject[] = pages.map((page) => {
    return {
      path: routePath(page),
      element: <MdxWrapper component={page.module.default} />,
      handle: { title: page.name } satisfies RouteHandle,
    };
  });

  const firstTab = pages[0];
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
