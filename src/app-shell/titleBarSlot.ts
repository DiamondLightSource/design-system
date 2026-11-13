import { createContext, useContext } from "react";

export interface TitleBarSlot {
  /**
   * The right-hand end of the page title bar, where the page can place a
   * control of its own. Empty until the bar has been drawn, and on pages without one.
   */
  element: HTMLElement | null;
  /** Whether the bar is on screen; a control in it is hidden when it is not */
  shown: boolean;
}

export const TitleBarSlotContext = createContext<TitleBarSlot>({
  element: null,
  shown: false,
});

export function useTitleBarSlot() {
  return useContext(TitleBarSlotContext);
}
