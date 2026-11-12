import { grid } from "./grid";
import { Layout, type LayoutConfig } from "./layout";
import { Canvas } from "./skeleton";

/**
 * The layout patterns, as the Layout patterns page numbers them. A pattern is
 * its layout configuration and the text that describes it for screen readers.
 * Change a pattern by changing its configuration, or build a new one from the
 * regions in `LayoutConfig`.
 */
type PatternDiagram = {
  title: string;
  description: string;
  layout: LayoutConfig;
};

const patterns = {
  "starting-app": {
    title: "Starting app",
    description:
      "A global header sits above a primary navigation rail and a flexible workspace.",
    layout: {},
  },
  "context-navigation": {
    title: "Context navigation",
    description:
      "A global header sits above a primary navigation rail, a context panel of links and a flexible workspace.",
    layout: { context: "links" },
  },
  "tabs-and-status": {
    title: "Tabs and status",
    description:
      "A global header sits above a primary navigation rail and a tabbed workspace. A global status bar runs along the foot.",
    layout: { selector: true, globalStatus: true },
  },
  "persistent-side-drawer": {
    title: "Persistent side drawer",
    description:
      "A global header sits above a primary navigation rail, a context panel with a list of items to choose from, and a workspace. An auxiliary pane is docked on the right with its own status and actions. A global status bar runs along the foot.",
    layout: {
      context: "cards",
      aux: { placement: "side" },
      globalStatus: true,
    },
  },
  "persistent-bottom-drawer": {
    title: "Persistent bottom drawer",
    description:
      "A global header with a breadcrumb sits above a primary navigation rail, a context panel with a list of items to choose from, and a workspace. An auxiliary pane is docked below the workspace content. A global status bar runs along the foot.",
    layout: {
      breadcrumb: true,
      context: "cards",
      aux: { placement: "bottom" },
      globalStatus: true,
    },
  },
  "temporary-side-drawer": {
    title: "Temporary side drawer",
    description:
      "A global header with a breadcrumb sits above a primary navigation rail and a workspace with a toolbar and a data table. An auxiliary pane opens over the right of the workspace without dimming it, so the workspace stays usable. A global status bar runs along the foot.",
    layout: {
      breadcrumb: true,
      toolbar: true,
      content: "table",
      aux: { placement: "side", overlay: true, backdrop: false },
      globalStatus: true,
    },
  },
  "inner-workspace-options": {
    title: "Inner workspace options",
    description:
      "A global header with a breadcrumb sits above a primary navigation rail and a context panel. The workspace has tabs, a toolbar, content, an auxiliary pane on the right with its own status and actions, and a workspace status bar. A global status bar runs along the foot.",
    layout: {
      breadcrumb: true,
      context: "accordion",
      selector: true,
      toolbar: true,
      contentLabel: "E1 · Workspace content",
      aux: { placement: "inner" },
      workspaceStatus: true,
      globalStatus: true,
    },
  },
  "inner-workspace-navigation": {
    title: "Inner workspace navigation",
    description:
      "A global header with a breadcrumb sits above a primary navigation rail and a tabbed workspace. The workspace has a list of items to choose from beside its content. A global status bar runs along the foot.",
    layout: {
      breadcrumb: true,
      selector: true,
      workspaceNav: "cards",
      contentLabel: "E1 · Workspace content",
      globalStatus: true,
    },
  },
  "modal-pane": {
    title: "Modal pane",
    description:
      "A global header with a breadcrumb sits above a primary navigation rail and a workspace with a data table. A modal pane for a form or other content is laid over the workspace. A backdrop dims the whole screen behind it, including the header and navigation.",
    layout: {
      breadcrumb: true,
      content: "table",
      modal: { x: 309, y: 83, w: 508, h: 470, close: true, actions: true },
    },
  },
} satisfies Record<string, PatternDiagram>;

export type PatternName = keyof typeof patterns;

/**
 * A layout drawn as a skeleton diagram. Name one of the patterns, and change
 * parts of it by passing `layout`. Or pass `layout`, `title` and `description`
 * on their own to draw a layout that isn't one of the patterns.
 */
export function LayoutDiagram({
  pattern,
  layout,
  title,
  description,
}: {
  pattern?: PatternName;
  layout?: LayoutConfig;
  title?: string;
  description?: string;
}) {
  const preset: PatternDiagram | undefined = pattern && patterns[pattern];

  return (
    <Canvas
      title={title ?? preset?.title ?? "Layout"}
      description={description ?? preset?.description ?? "A layout skeleton."}
      width={grid.width}
      height={grid.height}
    >
      <Layout {...preset?.layout} {...layout} />
    </Canvas>
  );
}
