import type { LayoutConfig } from "./layout";

/**
 * Words for a layout, generated from its configuration so they can't drift from
 * the diagram. The list of components follows the Regions table on the page.
 */
export type RegionDescription = {
  /** The region's letter, such as "F" or "E3" */
  id: string;
  name: string;
  /** What sets this region apart in this layout, for the diagram's description */
  note?: string;
  /** The component to use, with `code` marked in backticks */
  components: string;
};

const header = "`Navbar`, or MUI `AppBar`";

/** The regions a layout contains, in the order of their letters */
export function describeLayout(layout: LayoutConfig): RegionDescription[] {
  const regions: RegionDescription[] = [];
  const { aux, modal } = layout;
  const overlay = aux?.placement === "side" && aux.overlay === true;

  regions.push({
    id: "A",
    name: "Global header",
    note: layout.breadcrumb ? "with a breadcrumb" : undefined,
    components: layout.breadcrumb
      ? `${header}, plus a breadcrumb trail (component to be decided)`
      : header,
  });

  regions.push({
    id: "B",
    name: "Primary navigation",
    components: "`SidebarNav`",
  });

  if (layout.context) {
    const notes = {
      links: "a list of links",
      cards: "a list of items to choose from",
      accordion: "with accordion groups",
    };
    regions.push({
      id: "C",
      name: "Context panel",
      note: notes[layout.context],
      components:
        layout.context === "cards"
          ? "use a local component for now (`ContextPanel` with cards, once available)"
          : "use a local component for now (`SubNav`, once available)",
    });
  }

  if (layout.selector) {
    regions.push({
      id: "D",
      name: "Workspace selector",
      note: "tabs",
      components: "MUI `Tabs`",
    });
  }

  const [contentId, contentName] = (
    layout.contentLabel ?? "E · Primary workspace"
  ).split(" · ");
  const table = layout.content === "table";
  regions.push({
    id: contentId,
    name: contentName,
    note: table ? "a data table" : undefined,
    components: table
      ? "Your own content, such as a table view"
      : "Your own content",
  });

  if (layout.workspaceNav) {
    regions.push({
      id: "E2",
      name: "Workspace navigation",
      note: "a list of items to choose from",
      components: "MUI `List`",
    });
  }

  if (layout.toolbar) {
    regions.push({
      id: "E3",
      name: "Workspace toolbar",
      components: "`Bar`, or MUI `Toolbar`",
    });
  }

  if (layout.workspaceStatus) {
    regions.push({
      id: "E4",
      name: "Workspace status",
      components: "`Bar`, or MUI `Toolbar`",
    });
  }

  if (aux) {
    const where = {
      side: overlay
        ? aux.backdrop === false
          ? "opens over the right of the workspace without dimming it"
          : "opens over the right of the workspace, dimming it"
        : "docked on the right",
      inner: "on the right, beside the workspace content",
      bottom: "below the workspace content",
    };
    regions.push({
      id: "F",
      name: "Auxiliary pane",
      note: where[aux.placement],
      components: `MUI \`Drawer\` (${overlay ? "temporary" : "persistent"}, ${
        aux.placement === "bottom" ? "bottom" : "right"
      })${overlay ? ", with MUI `Tabs` for tabbed content" : ""}`,
    });
  }

  if (layout.globalStatus) {
    regions.push({
      id: "G",
      name: "Global status",
      components: "New component, not yet available",
    });
  }

  if (modal) {
    regions.push({
      id: "H",
      name: "Modal pane",
      note: "laid over the screen, which a backdrop dims",
      components: "MUI `Dialog`",
    });
  }

  // Letters first, then numbers: A, B, C, D, E, E1, E2, E3, E4, F, G, H
  return regions.sort((a, b) => a.id.localeCompare(b.id));
}

/** A sentence for screen readers saying what the diagram shows */
export function summariseLayout(regions: RegionDescription[]): string {
  const parts = regions.map((region) =>
    region.note
      ? `${region.id} ${region.name} (${region.note})`
      : `${region.id} ${region.name}`,
  );

  return `A skeleton of a desktop layout with these regions: ${parts.join("; ")}.`;
}
