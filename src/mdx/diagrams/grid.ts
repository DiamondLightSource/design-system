/**
 * The layout grid, in diagram units. Every layout places its regions with
 * these, so changing a size here changes it in every pattern that uses it.
 */
export const grid = {
  width: 1080,
  height: 640,
  header: 48,
  nav: 170.667,
  context: 200,
  selector: 52,
  toolbar: 29.333,
  workspaceStatus: 29,
  globalStatus: 29,
  /** Width of an auxiliary pane that sits beside the workspace */
  side: 230,
  /** Width of an auxiliary pane that opens over the workspace */
  overlay: 463,
  /** Width of an auxiliary pane inside the workspace, beside its content */
  inner: 250,
  /** Height of an auxiliary pane below the workspace content */
  bottom: 160.667,
  /** Width of a list of items inside the workspace */
  workspaceNav: 200,
};
