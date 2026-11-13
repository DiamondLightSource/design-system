import { createContext, useContext } from "react";
import { APP_BAR_HEIGHT } from "./dimensions";

export interface PinnedOffsets {
  /** How far down the window the bars pinned right now reach */
  top: number;
  /**
   * How far down they reach once every bar that can appear is showing. Linked-to
   * headings land here, so a bar that appears as the page scrolls does not cover them.
   */
  clearance: number;
}

/**
 * How far down the window the pinned bars reach, so that sticky content and
 * scrolled-to headings can stay clear of them. The app bar always; the page
 * title and a tab bar too, where a page has them.
 */
export const PinnedOffsetContext = createContext<PinnedOffsets>({
  top: APP_BAR_HEIGHT,
  clearance: APP_BAR_HEIGHT,
});

export function usePinnedOffset() {
  return useContext(PinnedOffsetContext);
}
