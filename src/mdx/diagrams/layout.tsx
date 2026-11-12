import {
  AuxiliaryPane,
  ContextPanel,
  GlobalHeader,
  GlobalStatus,
  ModalPane,
  PrimaryNav,
  WorkspaceContent,
  WorkspaceSelector,
  WorkspaceStatus,
  WorkspaceToolbar,
  type ContentKind,
  type ContextKind,
  type Frame,
  type PaneParts,
} from "./regions";
import { grid } from "./grid";
import { Elevated, Scrim } from "./skeleton";

/** Where the auxiliary pane (F) goes */
export type AuxPlacement =
  /** Beside the workspace, the full height of the screen */
  | "side"
  /** Inside the workspace, beside its content */
  | "inner"
  /** Below the workspace content */
  | "bottom";

export type AuxConfig = {
  placement: AuxPlacement;
  /** Opens over the workspace, which is dimmed behind it. Only for "side". */
  overlay?: boolean;
  /**
   * Dim the workspace behind an overlay pane. On by default. Turn it off for a
   * pane that leaves the workspace usable, like MUI's `hideBackdrop`.
   */
  backdrop?: boolean;
  /** Width, in diagram units, instead of the default. Not for "bottom". */
  width?: number;
  /** Height, in diagram units, instead of the default. Only for "bottom". */
  height?: number;
  /** Which parts the pane carries, instead of the defaults for its placement */
  parts?: PaneParts;
};

/**
 * The regions of a layout and how each is drawn. Leave a region out to leave it
 * out of the diagram. The letters match the Layout patterns tables.
 */
export type LayoutConfig = {
  /** Breadcrumb in the global header (A) */
  breadcrumb?: boolean;
  /** Global status bar (G) along the foot */
  globalStatus?: boolean;
  /** Context panel (C), and what it lists */
  context?: ContextKind;
  /** Workspace selector tabs (D) */
  selector?: boolean;
  /** Workspace toolbar (E3) */
  toolbar?: boolean;
  /** A list of items inside the workspace (E2), and what it lists */
  workspaceNav?: ContextKind;
  /** The workspace content (E or E1), as a viewport or a data table */
  content?: ContentKind;
  /** The letter and name of the workspace content region, "E" by default */
  contentRegion?: { id: string; name: string };
  /** Workspace status bar (E4) */
  workspaceStatus?: boolean;
  /** Auxiliary pane (F) */
  aux?: AuxConfig;
  /**
   * Modal pane (H). Place it by its rectangle in diagram units, or leave that
   * out to use the default place on the grid.
   */
  modal?: Partial<Frame> & PaneParts;
};

const defaultWidth: Record<AuxPlacement, number> = {
  side: grid.side,
  inner: grid.inner,
  bottom: 0,
};

const defaultParts: Record<AuxPlacement, PaneParts> = {
  side: { close: true, status: true, actions: true },
  inner: { close: true, status: true, actions: true },
  bottom: { columns: 2 },
};

/** A layout drawn from its regions, placed on the grid */
export function Layout({
  breadcrumb = false,
  globalStatus = false,
  context,
  selector = false,
  toolbar = false,
  workspaceNav,
  content = "viewport",
  contentRegion = { id: "E", name: "Primary workspace" },
  workspaceStatus = false,
  aux,
  modal,
}: LayoutConfig) {
  const overlay = aux?.placement === "side" && aux.overlay === true;
  const persistentSide = aux?.placement === "side" && !overlay;
  const auxWidth = aux
    ? (aux.width ?? (overlay ? grid.overlay : defaultWidth[aux.placement]))
    : 0;
  const auxParts = aux ? (aux.parts ?? defaultParts[aux.placement]) : {};

  // The screen, top to bottom: header, body, global status
  const bodyY = grid.header;
  const bodyBottom = grid.height - (globalStatus ? grid.globalStatus : 0);
  const bodyHeight = bodyBottom - bodyY;

  // The body, left to right: navigation, context, workspace, a persistent side pane
  const contextWidth = context ? grid.context : 0;
  const columnX = grid.nav + contextWidth;
  const columnWidth =
    grid.width - columnX - (persistentSide ? auxWidth : 0);

  // The workspace column, top to bottom: selector, toolbar, row, drawer, status
  const selectorHeight = selector ? grid.selector : 0;
  const toolbarHeight = toolbar ? grid.toolbar : 0;
  const statusHeight = workspaceStatus ? grid.workspaceStatus : 0;
  const drawerHeight =
    aux?.placement === "bottom" ? (aux.height ?? grid.bottom) : 0;
  const rowY = bodyY + selectorHeight + toolbarHeight;
  const rowBottom = bodyBottom - statusHeight - drawerHeight;
  const rowHeight = rowBottom - rowY;

  // The workspace row, left to right: item list, content, an inner pane
  const navWidth = workspaceNav ? grid.workspaceNav : 0;
  const innerWidth = aux?.placement === "inner" ? auxWidth : 0;
  const contentX = columnX + navWidth;
  const contentWidth = columnWidth - navWidth - innerWidth;

  const dimmed = overlay && aux?.backdrop !== false;

  return (
    <>
      <GlobalHeader
        x={0}
        y={0}
        w={grid.width}
        h={grid.header}
        breadcrumb={breadcrumb}
      />
      <PrimaryNav x={0} y={bodyY} w={grid.nav} h={bodyHeight} />
      {context && (
        <ContextPanel
          x={grid.nav}
          y={bodyY}
          w={grid.context}
          h={bodyHeight}
          kind={context}
        />
      )}

      {selector && (
        <WorkspaceSelector
          x={columnX}
          y={bodyY}
          w={columnWidth}
          h={grid.selector}
        />
      )}
      {toolbar && (
        <WorkspaceToolbar
          x={columnX}
          y={bodyY + selectorHeight}
          w={columnWidth}
          h={grid.toolbar}
        />
      )}
      {workspaceNav && (
        <ContextPanel
          x={columnX}
          y={rowY}
          w={grid.workspaceNav}
          h={rowHeight}
          kind={workspaceNav}
          label="E2 · Workspace navigation"
        />
      )}
      <WorkspaceContent
        x={contentX}
        y={rowY}
        w={contentWidth}
        h={rowHeight}
        kind={content}
        label={`${contentRegion.id} · ${contentRegion.name}`}
      />
      {aux?.placement === "inner" && (
        <AuxiliaryPane
          x={grid.width - innerWidth}
          y={rowY}
          w={innerWidth}
          h={rowHeight}
          {...auxParts}
        />
      )}
      {aux?.placement === "bottom" && (
        <AuxiliaryPane
          x={columnX}
          y={rowBottom}
          w={columnWidth}
          h={drawerHeight}
          edge="top"
          {...auxParts}
        />
      )}
      {persistentSide && (
        <AuxiliaryPane
          x={grid.width - auxWidth}
          y={bodyY}
          w={auxWidth}
          h={bodyHeight}
          {...auxParts}
        />
      )}
      {workspaceStatus && (
        <WorkspaceStatus
          x={columnX}
          y={bodyBottom - statusHeight}
          w={columnWidth}
          h={statusHeight}
        />
      )}
      {globalStatus && (
        <GlobalStatus
          x={0}
          y={bodyBottom}
          w={grid.width}
          h={grid.globalStatus}
        />
      )}

      {/* Floating surfaces go last, over a scrim. A modal blocks the whole
          screen. An overlay pane dims only the workspace it covers. */}
      {modal ? (
        <Scrim x={0} y={0} w={grid.width} h={grid.height} />
      ) : (
        dimmed && (
          <Scrim
            x={columnX}
            y={bodyY}
            w={grid.width - columnX}
            h={bodyHeight}
          />
        )
      )}
      {overlay && (
        // The pane floats over the workspace only, so its shadow stops at the
        // header and the global status bar
        <Elevated clip={{ x: 0, y: bodyY, w: grid.width, h: bodyHeight }}>
          <AuxiliaryPane
            x={grid.width - auxWidth}
            y={bodyY}
            w={auxWidth}
            h={bodyHeight}
            {...auxParts}
          />
        </Elevated>
      )}
      {modal && (
        <Elevated>
          <ModalPane {...grid.modal} {...modal} />
        </Elevated>
      )}
    </>
  );
}
