import type { LayoutConfig } from "./layout";

/**
 * The layout patterns, as the Layout patterns page numbers them. This is the
 * single source of truth for them: the diagram, its accessible description and
 * the list of components beside it are all generated from these configurations.
 * Change a pattern by changing its configuration, or build a new one from the
 * regions in `LayoutConfig`.
 */
type Preset = {
  title: string;
  layout: LayoutConfig;
};

const presets = {
  "starting-app": {
    title: "Starting app",
    layout: {},
  },
  "context-navigation": {
    title: "Context navigation",
    layout: { context: "links" },
  },
  "tabs-and-status": {
    title: "Tabs and status",
    layout: { selector: true, globalStatus: true },
  },
  "persistent-side-drawer": {
    title: "Persistent side drawer",
    layout: {
      context: "cards",
      aux: { placement: "side" },
      globalStatus: true,
    },
  },
  "persistent-bottom-drawer": {
    title: "Persistent bottom drawer",
    layout: {
      breadcrumb: true,
      context: "cards",
      aux: { placement: "bottom" },
      globalStatus: true,
    },
  },
  "temporary-side-drawer": {
    title: "Temporary side drawer",
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
    layout: {
      breadcrumb: true,
      content: "table",
      modal: { x: 309, y: 83, w: 508, h: 470, close: true, actions: true },
    },
  },
} satisfies Record<string, Preset>;

export type PatternName = keyof typeof presets;

/**
 * The title and layout to draw: a named pattern, with any changes from
 * `layout` laid over it. The auxiliary pane merges field by field, so changing
 * one of its settings keeps the rest of the preset's.
 */
export function resolveLayout(
  pattern?: PatternName,
  layout?: LayoutConfig,
): { title?: string; layout: LayoutConfig } {
  const preset: Preset | undefined = pattern && presets[pattern];
  const base = preset?.layout ?? {};

  return {
    title: preset?.title,
    layout: {
      ...base,
      ...layout,
      ...(base.aux && layout?.aux
        ? { aux: { ...base.aux, ...layout.aux } }
        : {}),
    },
  };
}
