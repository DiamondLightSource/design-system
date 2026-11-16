/** Maximum line length for running text, so prose stays comfortable to read */
export const readingWidth = "66ch";

/**
 * Columns that are at least `min` px wide and share the width, as many as fit.
 * They follow the width of the page, which the navigation panels share with
 * the window, not the width of the window itself.
 */
export const columnsFit = (min: number) =>
  `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`;
