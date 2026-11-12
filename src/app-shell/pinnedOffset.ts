import { createContext, useContext } from "react";
import { APP_BAR_HEIGHT } from "./dimensions";

/**
 * How far down the window the pinned bars reach, so that sticky content and
 * scrolled-to headings can stay clear of them. The app bar always; a tab bar
 * too, on tabbed pages.
 */
export const PinnedOffsetContext = createContext(APP_BAR_HEIGHT);

export function usePinnedOffset() {
  return useContext(PinnedOffsetContext);
}
